import { cache } from 'react'
import type { Payload, Where } from 'payload'
import type { Home, SiteSetting } from '@/payload-types'
import { getPayloadClient, resolveTaxonomyIds, taxonomyOptions } from './payload'
import { buildWhere, getPage, getParam, PAGE_SIZE, type FilterDef, type SearchParams } from './queries'
import { type ContentTypeKey } from './content-types'

/*
 * Data access used by server components. Every function goes through the Payload local API,
 * so access control and drafts behave the same as through the REST API.
 */

export const getSettings = cache(async (): Promise<SiteSetting> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
})

export const getHome = cache(async (): Promise<Home> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'home', depth: 2 })
})

export const TAXONOMY_FIELDS = {
  countries: 'countries',
  topics: 'topics',
  expertise: 'topics',
  enablers: 'enablers',
  raiDimensions: 'rai-dimensions',
  tags: 'tags',
  stakeholderType: 'stakeholder-types',
} as const

type TaxonomyCollection = (typeof TAXONOMY_FIELDS)[keyof typeof TAXONOMY_FIELDS]

const collectionForField = (field: string): TaxonomyCollection | null =>
  (TAXONOMY_FIELDS as Record<string, TaxonomyCollection>)[field] ?? null

/** Standard filter set for content listings. Country, sector, enabler, dimension. */
export const standardFilters = (opts: { dimensions?: boolean } = {}): FilterDef[] => [
  { param: 'country', field: 'countries', kind: 'relationship', label: 'Country', multiple: true },
  { param: 'topic', field: 'topics', kind: 'relationship', label: 'Sector', multiple: true },
  { param: 'enabler', field: 'enablers', kind: 'relationship', label: 'Ecosystem enabler', multiple: true },
  ...(opts.dimensions
    ? [{ param: 'dimension', field: 'raiDimensions', kind: 'relationship', label: 'Responsible AI dimension', multiple: true } as FilterDef]
    : []),
]

/** Options for every relationship filter in a definition list. */
export const filterOptions = async (payload: Payload, defs: FilterDef[]) => {
  const entries = await Promise.all(
    defs.map(async (d) => {
      if (d.kind !== 'relationship') return [d.param, d.options ?? []] as const
      const coll = collectionForField(d.field)
      return [d.param, coll ? await taxonomyOptions(payload, coll) : []] as const
    }),
  )
  return Object.fromEntries(entries) as Record<string, Array<{ value: string; label: string }>>
}

export type ListResult<T> = {
  docs: T[]
  totalDocs: number
  totalPages: number
  page: number
  hasNext: boolean
  hasPrev: boolean
}

/**
 * List a collection with URL-driven filters, free text and pagination.
 * Text search uses `like` on title and summary. Site-wide search uses the search index instead.
 */
export const listCollection = async <T = Record<string, unknown>>(
  payload: Payload,
  collection: ContentTypeKey,
  sp: SearchParams,
  defs: FilterDef[],
  opts: { sort?: string; extraWhere?: Where; limit?: number; textFields?: string[]; depth?: number } = {},
): Promise<ListResult<T>> => {
  // Resolve taxonomy slugs to ids first so buildWhere stays synchronous and testable.
  const resolved = new Map<string, Array<string | number>>()
  for (const d of defs) {
    if (d.kind !== 'relationship') continue
    const slugs = (Array.isArray(sp[d.param]) ? (sp[d.param] as string[]) : [sp[d.param]])
      .filter((v): v is string => Boolean(v))
      .flatMap((v) => v.split(','))
    if (!slugs.length) continue
    const coll = collectionForField(d.field)
    if (coll) resolved.set(d.field, await resolveTaxonomyIds(payload, coll, slugs))
  }
  let where = buildWhere(sp, defs, (field) => resolved.get(field) ?? [])
  const q = getParam(sp, 'q')?.trim()
  const and: Where[] = [where]
  if (q) {
    const fields = opts.textFields ?? ['title', 'summary']
    and.push({ or: fields.map((f) => ({ [f]: { like: q } })) })
  }
  if (opts.extraWhere) and.push(opts.extraWhere)
  where = and.length > 1 ? { and } : where

  const page = getPage(sp)
  const res = await payload.find({
    collection,
    where,
    sort: opts.sort ?? '-publishedAt',
    limit: opts.limit ?? PAGE_SIZE,
    page,
    depth: opts.depth ?? 1,
    overrideAccess: false,
  })
  return {
    docs: res.docs as T[],
    totalDocs: res.totalDocs,
    totalPages: res.totalPages,
    page: res.page ?? page,
    hasNext: res.hasNextPage,
    hasPrev: res.hasPrevPage,
  }
}

/** Collections without drafts (for example indicators) have no `_status` field to filter on. */
const hasDrafts = (payload: Payload, collection: ContentTypeKey): boolean =>
  Boolean(payload.collections[collection]?.config.versions?.drafts)

/** `where` restricted to published documents, when the collection supports drafts. */
export const publishedWhere = (payload: Payload, collection: ContentTypeKey, where?: Where): Where | undefined => {
  if (!hasDrafts(payload, collection)) return where
  const status: Where = { _status: { equals: 'published' } }
  return where ? { and: [status, where] } : status
}

/** Counts per collection for the home page and hub pages. */
export const countPublished = async (payload: Payload, collections: ContentTypeKey[], where?: Where) => {
  const entries = await Promise.all(
    collections.map(async (c) => {
      const res = await payload.count({ collection: c, where: publishedWhere(payload, c, where), overrideAccess: false })
      return [c, res.totalDocs] as const
    }),
  )
  return Object.fromEntries(entries) as Record<ContentTypeKey, number>
}

/** Find a taxonomy term by slug, for hub pages. */
export const findTerm = async (payload: Payload, collection: TaxonomyCollection, slug: string) => {
  const res = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, depth: 0 })
  return res.docs[0] ?? null
}

/** Latest published documents for a collection. */
export const latest = async <T = Record<string, unknown>>(
  payload: Payload,
  collection: ContentTypeKey,
  limit = 3,
  where?: Where,
  sort = '-publishedAt',
): Promise<T[]> => {
  const res = await payload.find({
    collection,
    where: publishedWhere(payload, collection, where),
    sort,
    limit,
    depth: 1,
    overrideAccess: false,
  })
  return res.docs as T[]
}

/**
 * Related content. Editors pick explicit relations. If a document has fewer than `min` explicit relations,
 * we fill from items that share a country and a topic or enabler, newest first.
 * The explicit list always comes first so editorial choice wins.
 */
export const relatedContent = async (
  payload: Payload,
  doc: Record<string, unknown>,
  self: { collection: ContentTypeKey; id: string | number },
  min = 4,
): Promise<Array<{ collection: ContentTypeKey; doc: Record<string, unknown> }>> => {
  const explicit: Array<{ collection: ContentTypeKey; doc: Record<string, unknown> }> = []
  const mapping: Array<[string, ContentTypeKey]> = [
    ['relatedUseCases', 'use-cases'],
    ['relatedPublications', 'publications'],
    ['relatedDatasets', 'datasets'],
    ['relatedEvents', 'events'],
    ['relatedLearning', 'learning-resources'],
  ]
  for (const [field, collection] of mapping) {
    const v = doc[field]
    if (!Array.isArray(v)) continue
    for (const item of v) {
      if (item && typeof item === 'object' && (item as { _status?: string })._status !== 'draft')
        explicit.push({ collection, doc: item as Record<string, unknown> })
    }
  }
  if (explicit.length >= min) return explicit.slice(0, 8)

  const ids = (v: unknown) =>
    Array.isArray(v) ? v.map((x) => (x && typeof x === 'object' ? (x as { id: string | number }).id : x)).filter(Boolean) : []
  const countries = ids(doc.countries)
  const topics = ids(doc.topics)
  const enablers = ids(doc.enablers)
  if (!countries.length && !topics.length && !enablers.length) return explicit

  const seen = new Set(explicit.map((e) => `${e.collection}:${(e.doc as { id: string | number }).id}`))
  seen.add(`${self.collection}:${self.id}`)
  const or: Where[] = []
  if (topics.length) or.push({ topics: { in: topics } })
  if (enablers.length) or.push({ enablers: { in: enablers } })
  const where: Where = {
    and: [
      { _status: { equals: 'published' } },
      ...(countries.length ? [{ countries: { in: countries } }] : []),
      ...(or.length ? [{ or }] : []),
    ],
  }
  const pool: ContentTypeKey[] = ['use-cases', 'publications', 'datasets', 'events', 'learning-resources', 'posts']
  const fill: typeof explicit = []
  for (const collection of pool) {
    if (explicit.length + fill.length >= min) break
    const res = await payload.find({ collection, where, limit: 2, depth: 0, sort: '-publishedAt', overrideAccess: false })
    for (const d of res.docs) {
      const key = `${collection}:${d.id}`
      if (seen.has(key)) continue
      seen.add(key)
      fill.push({ collection, doc: d as unknown as Record<string, unknown> })
    }
  }
  return [...explicit, ...fill].slice(0, 8)
}

/** Values for one indicator, joined to the country list, optionally for one year. */
export const indicatorRows = async (
  payload: Payload,
  indicatorId: string | number,
  year?: number,
) => {
  const [countries, values] = await Promise.all([
    payload.find({ collection: 'countries', limit: 200, sort: 'name', depth: 0, pagination: false }),
    payload.find({
      collection: 'indicator-values',
      where: year
        ? { and: [{ indicator: { equals: indicatorId } }, { year: { equals: year } }] }
        : { indicator: { equals: indicatorId } },
      limit: 5000,
      depth: 0,
      pagination: false,
    }),
  ])
  const years = Array.from(new Set(values.docs.map((v) => v.year))).sort((a, b) => b - a)
  const chosen = year ?? years[0]
  const byCountry = new Map<string | number, (typeof values.docs)[number]>()
  for (const v of values.docs) if (v.year === chosen) byCountry.set(typeof v.country === 'object' ? v.country.id : v.country, v)
  const rows = countries.docs.map((c) => {
    const v = byCountry.get(c.id)
    return {
      country: c.name,
      slug: c.slug ?? '',
      iso3: c.iso3,
      isoNumeric: c.isoNumeric,
      subregion: c.subregion,
      smallState: Boolean(c.smallState),
      value: v ? v.value : null,
      note: v?.note ?? null,
    }
  })
  // Series per country for sparklines, all years.
  const series = new Map<string, Array<{ year: number; value: number }>>()
  for (const v of values.docs) {
    const cid = typeof v.country === 'object' ? v.country.id : v.country
    const c = countries.docs.find((x) => x.id === cid)
    if (!c) continue
    const arr = series.get(c.iso3) ?? []
    arr.push({ year: v.year, value: v.value })
    series.set(c.iso3, arr)
  }
  for (const arr of series.values()) arr.sort((a, b) => a.year - b.year)
  return { rows, years, year: chosen, series, countries: countries.docs }
}
