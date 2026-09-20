import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { CONTENT_TYPES } from '@/lib/content-types'
import { buildFeed, feedPathFor, feedResponse, isFeedType } from '@/lib/feed'

export const revalidate = 900

/** Per-type RSS 2.0 feed, for example /feed/publications.xml or /feed/opportunities.xml. */
export async function GET(_req: Request, ctx: { params: Promise<{ type: string }> }) {
  const { type: raw } = await ctx.params
  const type = raw.replace(/\.xml$/, '')
  if (!isFeedType(type) || !raw.endsWith('.xml')) notFound()
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  const def = CONTENT_TYPES[type]
  const xml = await buildFeed(payload, {
    types: [type],
    selfPath: feedPathFor(type),
    title: `${def.plural} | ${settings.siteName}`,
    description: `Latest ${def.plural.toLowerCase()} published by the ${settings.siteName}.`,
    perType: 50,
  })
  return feedResponse(xml)
}
