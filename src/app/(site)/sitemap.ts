import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { absoluteUrl } from '@/lib/format'
import { contentTypeList, pathFor } from '@/lib/content-types'

export const revalidate = 3600

/** Sitemap generated from the content registry, so a new content type is included by adding it to the registry. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const fixed = ['/', '/use-cases', '/publications', '/datasets', '/data', '/commentary', '/directory', '/events', '/learning', '/opportunities', '/newsletter', '/about', '/about/partners'].map((p) => ({
    url: absoluteUrl(p),
    changeFrequency: 'weekly' as const,
    priority: p === '/' ? 1 : 0.7,
  }))
  const entries: MetadataRoute.Sitemap = [...fixed]
  for (const t of contentTypeList.filter((t) => t.inSitemap)) {
    const res = await payload.find({
      collection: t.collection,
      where: t.collection === 'indicators' ? {} : { _status: { equals: 'published' } },
      limit: 2000,
      depth: 0,
      pagination: false,
      select: { slug: true, updatedAt: true, seo: true } as never,
    })
    for (const d of res.docs as Array<{ slug?: string | null; updatedAt?: string; seo?: { noIndex?: boolean | null } | null }>) {
      if (!d.slug || d.seo?.noIndex) continue
      entries.push({ url: absoluteUrl(pathFor(t.collection, d.slug)), lastModified: d.updatedAt ? new Date(d.updatedAt) : undefined, changeFrequency: 'monthly', priority: 0.6 })
    }
  }
  for (const tax of ['countries', 'topics', 'enablers', 'rai-dimensions'] as const) {
    const res = await payload.find({ collection: tax, limit: 500, depth: 0, pagination: false })
    const base = tax === 'rai-dimensions' ? '/dimensions' : `/${tax}`
    for (const d of res.docs) if (d.slug) entries.push({ url: absoluteUrl(`${base}/${d.slug}`), changeFrequency: 'weekly', priority: 0.5 })
  }
  return entries
}
