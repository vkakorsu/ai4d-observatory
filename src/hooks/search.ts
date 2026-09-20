import type { BeforeSync } from '@payloadcms/plugin-search/types'
import { CONTENT_TYPES, pathFor, searchableTypes, type ContentTypeKey } from '@/lib/content-types'

/**
 * Unified search index (Section 3.1.4 a).
 * Whenever a document is saved, the plugin writes one row to the `search` collection.
 * Here we enrich that row with an excerpt, the type label, the public path and taxonomy names,
 * so one query covers publications, use cases, datasets, events, learning resources and the rest.
 */

export const searchCollections = searchableTypes

export const searchPriorities = Object.fromEntries(
  Object.values(CONTENT_TYPES).filter((t) => t.inSearch).map((t) => [t.collection, t.searchPriority]),
) as Record<string, number>

type AnyDoc = Record<string, unknown> & { id: string | number }

const names = async (
  payload: Parameters<BeforeSync>[0]['payload'],
  collection: 'countries' | 'topics' | 'enablers' | 'rai-dimensions' | 'tags',
  value: unknown,
): Promise<string[]> => {
  if (!Array.isArray(value) || value.length === 0) return []
  const ids = value.map((v) => (typeof v === 'object' && v ? (v as AnyDoc).id : v)).filter(Boolean)
  const populated = value.filter((v): v is AnyDoc => typeof v === 'object' && v !== null && 'name' in v)
  if (populated.length === value.length) return populated.map((v) => String(v.name))
  const res = await payload.find({ collection, where: { id: { in: ids } }, limit: 100, depth: 0, pagination: false })
  return res.docs.map((d) => String((d as unknown as AnyDoc).name))
}

export const buildSearchText = (doc: Record<string, unknown>): string => {
  const parts: string[] = []
  for (const key of ['summary', 'definition', 'problem', 'authorText', 'outlet', 'provider', 'source', 'role']) {
    const v = doc[key]
    if (typeof v === 'string' && v.trim()) parts.push(v.trim())
  }
  return parts.join(' ').slice(0, 1200)
}

export const searchBeforeSync: BeforeSync = async ({ originalDoc, searchDoc, payload }) => {
  const collection = searchDoc.doc.relationTo as ContentTypeKey
  const def = CONTENT_TYPES[collection]
  const doc = originalDoc as Record<string, unknown>
  const title = String(doc[def?.titleField ?? 'title'] ?? searchDoc.title ?? '')
  const slug = String(doc.slug ?? '')

  const [countries, topics, enablers, dims, tags] = await Promise.all([
    names(payload, 'countries', doc.countries),
    names(payload, 'topics', doc.topics ?? doc.expertise),
    names(payload, 'enablers', doc.enablers),
    names(payload, 'rai-dimensions', doc.raiDimensions),
    names(payload, 'tags', doc.tags),
  ])

  const typeLabel =
    collection === 'publications' && typeof doc.type === 'string'
      ? doc.type.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
      : (def?.label ?? collection)

  return {
    ...searchDoc,
    title,
    excerpt: buildSearchText(doc),
    keywords: [typeLabel, ...countries, ...topics, ...enablers, ...dims, ...tags].join(' '),
    typeLabel,
    path: slug ? pathFor(collection, slug) : def?.listing ?? '/',
    countries: countries.join(', '),
    topics: topics.join(', '),
    publishedAt: typeof doc.publishedAt === 'string' ? doc.publishedAt : undefined,
  }
}
