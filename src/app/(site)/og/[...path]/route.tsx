import { getPayloadClient } from '@/lib/payload'
import { contentTypeList, type ContentTypeKey } from '@/lib/content-types'
import { renderOgCard } from '@/lib/og'
import { typeLabelFor } from '@/components/listing'

export const revalidate = 3600

const TONE: Partial<Record<ContentTypeKey, number>> = {
  'use-cases': 5,
  publications: 4,
  datasets: 3,
  indicators: 3,
  events: 2,
  posts: 1,
  'op-eds': 1,
  news: 1,
}

/**
 * GET /og/<content path>, for example /og/use-cases/khmer-speech-recognition-agricultural-hotline.
 * Renders the share card for a published item. The card text comes from the CMS, never from the URL,
 * so the endpoint cannot be used to put arbitrary words under the Observatory's name.
 */
export async function GET(_req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params
  const slug = path[path.length - 1] ?? ''
  const base = `/${path.slice(0, -1).join('/')}`
  const def =
    contentTypeList.find((t) => t.base === base && t.collection !== 'pages') ??
    (path.length === 1 ? contentTypeList.find((t) => t.collection === 'pages') : undefined)

  const payload = await getPayloadClient()
  let doc: Record<string, unknown> | null = null
  if (def && slug) {
    const res = await payload.find({
      collection: def.collection,
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
      overrideAccess: false,
    })
    doc = (res.docs[0] as unknown as Record<string, unknown>) ?? null
  }

  if (!def || !doc) {
    return renderOgCard({
      kicker: 'Asia AI4D Observatory',
      title: 'Evidence for responsible AI in Asia',
      summary:
        'Use cases, mapping studies, data, people and opportunities. A policy and innovation network led by LIRNEasia.',
    })
  }

  const names = (v: unknown) =>
    Array.isArray(v)
      ? v
          .filter((x) => x && typeof x === 'object' && 'name' in x)
          .map((x) => String((x as { name: string }).name))
      : []
  const title = String(doc[def.titleField] ?? '')
  const summary =
    typeof doc.summary === 'string'
      ? doc.summary
      : typeof doc.definition === 'string'
        ? doc.definition
        : null
  return renderOgCard({
    kicker: typeLabelFor(def.collection, doc as never),
    title,
    summary,
    tags: [...names(doc.countries), ...names(doc.enablers)],
    tone: TONE[def.collection] ?? 4,
  })
}
