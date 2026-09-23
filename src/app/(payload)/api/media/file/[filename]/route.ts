import config from '@payload-config'
import { REST_GET } from '@payloadcms/next/routes'

/**
 * Media file delivery, in front of Payload's own handler (which keeps doing access control and storage).
 *
 * Two fixes for download managers such as XDM, IDM and wget, which behave differently from browsers:
 * - HEAD is answered. Payload's REST route has no HEAD handler and returned 404, so a download manager
 *   probing for size and type gave up before downloading.
 * - Byte ranges stay correct. Payload answers `Range` with 206 Partial Content, but Vercel's CDN cached the
 *   whole file and then answered range requests with 200, which breaks segmented and resumed downloads.
 *   The CDN is told not to store these responses; browsers still cache them.
 */
const payloadGet = REST_GET(config)

type Ctx = { params: Promise<{ filename: string }> }

const serve = async (req: Request, ctx: Ctx): Promise<Response> => {
  const { filename } = await ctx.params
  const res = await payloadGet(req, {
    params: Promise.resolve({ slug: ['media', 'file', filename] }),
  })
  if (!res.ok && res.status !== 206) return res
  const headers = new Headers(res.headers)
  headers.set('Accept-Ranges', 'bytes')
  // Signed-in staff can read gated files here, so their responses must never sit in a shared cache.
  const signedIn = /(?:^|;\s*)payload-token=/.test(req.headers.get('cookie') ?? '')
  headers.set('Cache-Control', signedIn ? 'private, no-store' : 'public, max-age=3600')
  headers.set('CDN-Cache-Control', 'no-store')
  headers.set('Vercel-CDN-Cache-Control', 'no-store')
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers })
}

export const GET = serve

export async function HEAD(req: Request, ctx: Ctx): Promise<Response> {
  const res = await serve(new Request(req.url, { method: 'GET', headers: req.headers }), ctx)
  await res.body?.cancel()
  return new Response(null, {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
  })
}
