import config from '@payload-config'
import { getPayload } from 'payload'
import { REST_GET } from '@payloadcms/next/routes'

/**
 * Media file delivery, in front of Payload's own handler (which keeps doing access control and storage).
 *
 * Two fixes for download managers such as XDM, IDM and wget, which behave differently from browsers:
 * - HEAD is answered. Payload's REST route has no HEAD handler and returned 404, so a download manager
 *   probing for size and type gave up before downloading. HEAD is answered from the media record, without
 *   reading the file, applying the same rule as downloads: gated files only for signed-in staff.
 * - Byte ranges stay correct. Payload answers `Range` with 206 Partial Content, but Vercel's CDN cached the
 *   whole file and then answered range requests with 200, which breaks segmented and resumed downloads.
 *   The CDN is told not to store these responses; browsers still cache them.
 */
const payloadGet = REST_GET(config)

type Ctx = { params: Promise<{ filename: string }> }

const SIZES = ['thumb', 'card', 'wide'] as const

const cacheHeaders = (headers: Headers, req: Request) => {
  // Signed-in staff can read gated files, so their responses must never sit in a shared cache.
  const signedIn = /(?:^|;\s*)payload-token=/.test(req.headers.get('cookie') ?? '')
  headers.set('Accept-Ranges', 'bytes')
  headers.set('Cache-Control', signedIn ? 'private, no-store' : 'public, max-age=3600')
  headers.set('CDN-Cache-Control', 'no-store')
  headers.set('Vercel-CDN-Cache-Control', 'no-store')
  return headers
}

export async function GET(req: Request, ctx: Ctx): Promise<Response> {
  const { filename } = await ctx.params
  const res = await payloadGet(req, {
    params: Promise.resolve({ slug: ['media', 'file', filename] }),
  })
  if (!res.ok && res.status !== 206) return res
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: cacheHeaders(new Headers(res.headers), req),
  })
}

export async function HEAD(req: Request, ctx: Ctx): Promise<Response> {
  const { filename } = await ctx.params
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'media',
    where: {
      or: [
        { filename: { equals: filename } },
        ...SIZES.map((s) => ({ [`sizes.${s}.filename`]: { equals: filename } })),
      ],
    },
    limit: 1,
    depth: 0,
  })
  const doc = res.docs[0]
  if (!doc) return new Response(null, { status: 404 })
  if (doc.access === 'gated') {
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) return new Response(null, { status: 403 })
  }
  const size = SIZES.map((s) => doc.sizes?.[s]).find((v) => v?.filename === filename)
  const headers = new Headers({
    'Content-Type': (size ? size.mimeType : doc.mimeType) ?? 'application/octet-stream',
    'Content-Disposition': `inline; filename="${filename.replace(/"/g, '')}"`,
    'X-Content-Type-Options': 'nosniff',
  })
  const length = size ? size.filesize : doc.filesize
  if (length) headers.set('Content-Length', String(length))
  return new Response(null, { status: 200, headers: cacheHeaders(headers, req) })
}
