import type { Payload } from 'payload'
import { absoluteUrl } from './format'
import { CONTENT_TYPES, pathFor, type ContentTypeKey } from './content-types'
import { publishedWhere } from './site'

/**
 * RSS 2.0 feeds (Section 3.1.6 e, discoverability). One site-wide feed at /feed.xml and one per
 * content type at /feed/<type>.xml, so a partner site or a newsletter tool can follow, say, only
 * new publications or only opportunities.
 */

/** Types that carry a publication date and are worth following. */
export const FEED_TYPES = [
  'use-cases',
  'publications',
  'datasets',
  'posts',
  'op-eds',
  'news',
  'events',
  'learning-resources',
  'opportunities',
  'newsletters',
  'people',
  'organisations',
] as const satisfies readonly ContentTypeKey[]

export type FeedType = (typeof FEED_TYPES)[number]

export const isFeedType = (value: string): value is FeedType => (FEED_TYPES as readonly string[]).includes(value)

/** Path of the per-type feed, used for <link rel="alternate"> on listing pages. */
export const feedPathFor = (type: FeedType) => `/feed/${type}.xml`

const esc = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c] as string)

type FeedItem = { title: string; link: string; date: string; summary: string; type: string }

type FeedDoc = { title?: string; name?: string; slug?: string | null; publishedAt?: string | null; summary?: string | null; bio?: string | null }

export const buildFeed = async (
  payload: Payload,
  args: { types: readonly FeedType[]; selfPath: string; title: string; description: string; perType?: number; max?: number },
): Promise<string> => {
  const items: FeedItem[] = []
  for (const t of args.types) {
    const def = CONTENT_TYPES[t]
    const res = await payload.find({
      collection: t,
      where: publishedWhere(payload, t),
      sort: '-publishedAt',
      limit: args.perType ?? 20,
      depth: 0,
      overrideAccess: false,
    })
    for (const d of res.docs as FeedDoc[]) {
      if (!d.slug || !d.publishedAt) continue
      items.push({
        title: String(d[def.titleField] ?? ''),
        link: absoluteUrl(pathFor(t, d.slug)),
        date: d.publishedAt,
        summary: d.summary ?? d.bio ?? '',
        type: def.label,
      })
    }
  }
  items.sort((a, b) => b.date.localeCompare(a.date))
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${esc(args.title)}</title>
<link>${absoluteUrl('/')}</link>
<atom:link href="${absoluteUrl(args.selfPath)}" rel="self" type="application/rss+xml"/>
<description>${esc(args.description)}</description>
<language>en-gb</language>
${items
  .slice(0, args.max ?? 50)
  .map(
    (i) => `<item>
<title>${esc(i.title)}</title>
<link>${i.link}</link>
<guid>${i.link}</guid>
<pubDate>${new Date(i.date).toUTCString()}</pubDate>
<category>${esc(i.type)}</category>
<description>${esc(i.summary)}</description>
</item>`,
  )
  .join('\n')}
</channel>
</rss>`
}

export const feedResponse = (xml: string) =>
  new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8', 'cache-control': 'public, max-age=900' } })
