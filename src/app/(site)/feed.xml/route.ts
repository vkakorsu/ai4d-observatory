import { getPayloadClient } from '@/lib/payload'
import { buildFeed, feedResponse } from '@/lib/feed'

export const revalidate = 900

/** Site-wide RSS 2.0 feed of the latest published items across the main content types. */
export async function GET() {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  const xml = await buildFeed(payload, {
    types: ['use-cases', 'publications', 'datasets', 'posts', 'op-eds', 'news', 'events', 'learning-resources', 'opportunities'],
    selfPath: '/feed.xml',
    title: settings.siteName,
    description: settings.description ?? '',
    perType: 10,
  })
  return feedResponse(xml)
}
