import configPromise from '@payload-config'
import { getPayload, type Payload } from 'payload'

/** Single Payload instance per process. Server components query the database directly, no HTTP hop. */
export const getPayloadClient = async (): Promise<Payload> => getPayload({ config: configPromise })

type Doc = {
  id: string | number
  slug?: string | null
  name?: string | null
  title?: string | null
}

/** Resolve taxonomy slugs to ids for relationship filters. */
export const resolveTaxonomyIds = async (
  payload: Payload,
  collection: 'countries' | 'topics' | 'enablers' | 'rai-dimensions' | 'stakeholder-types' | 'tags',
  slugs: string[],
): Promise<Array<string | number>> => {
  if (slugs.length === 0) return []
  const res = await payload.find({
    collection,
    where: { slug: { in: slugs } },
    limit: 200,
    depth: 0,
    pagination: false,
  })
  return res.docs.map((d) => (d as Doc).id)
}

/** Fetch all terms of a taxonomy for filter controls. */
type TaxonomySlug =
  'countries' | 'topics' | 'enablers' | 'rai-dimensions' | 'stakeholder-types' | 'tags'

/**
 * Filter options change rarely but were read on every listing request, four or five queries each. Cached in
 * memory for a minute per server instance, so a new term an editor adds appears in the filters within a minute.
 */
const OPTIONS_TTL_MS = 60_000
const optionsCache = new Map<
  TaxonomySlug,
  { at: number; value: Promise<Array<{ value: string; label: string }>> }
>()

export const taxonomyOptions = async (payload: Payload, collection: TaxonomySlug) => {
  const hit = optionsCache.get(collection)
  if (hit && Date.now() - hit.at < OPTIONS_TTL_MS) return hit.value
  const value = payload
    .find({ collection, limit: 500, sort: 'name', depth: 0, pagination: false })
    .then((res) =>
      res.docs.map((d) => ({ value: (d as Doc).slug ?? '', label: (d as Doc).name ?? '' })),
    )
  optionsCache.set(collection, { at: Date.now(), value })
  // A failed query must not be cached.
  value.catch(() => optionsCache.delete(collection))
  return value
}

export const findBySlug = async <T = unknown>(
  payload: Payload,
  collection: string,
  slug: string,
  depth = 2,
  draft = false,
): Promise<T | null> => {
  const res = await payload.find({
    // Payload typing narrows collection slugs; pages call with known slugs.
    collection: collection as never,
    where: { slug: { equals: slug } },
    limit: 1,
    depth,
    draft,
    overrideAccess: false,
  })
  return (res.docs[0] as T) ?? null
}

/** Narrow relationship values that may be ids or populated documents. */
export const rel = <T extends object>(v: T | string | number | null | undefined): T | null =>
  v && typeof v === 'object' ? v : null

export const rels = <T extends object>(v: Array<T | string | number> | null | undefined): T[] =>
  (v ?? []).filter((x): x is T => Boolean(x) && typeof x === 'object')
