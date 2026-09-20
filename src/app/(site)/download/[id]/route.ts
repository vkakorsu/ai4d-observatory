import { createReadStream, existsSync, statSync } from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'
import { type NextRequest } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { verifyGateToken } from '@/lib/gate'

/**
 * Serves an email-gated file after the form has been completed (Section 3.1.2).
 * The link is signed and short-lived. The public file endpoint refuses gated files, so this is the only route to them.
 */
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const payload = await getPayloadClient()
  const token = verifyGateToken(req.nextUrl.searchParams.get('t'), payload.secret)
  if (!token || token.fileId !== id) {
    return new Response('This download link is invalid or has expired. Please request a new one.', {
      status: 403,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    })
  }
  const file = await payload.findByID({ collection: 'media', id, depth: 0, overrideAccess: true }).catch(() => null)
  if (!file || !file.filename) return new Response('Not found', { status: 404 })

  const headers: Record<string, string> = {
    'content-type': file.mimeType ?? 'application/octet-stream',
    'content-disposition': `attachment; filename="${encodeURIComponent(file.filename)}"`,
    'cache-control': 'private, no-store',
    'x-robots-tag': 'noindex',
  }

  // Remote storage (for example Vercel Blob). Proxy the bytes so the storage URL is never exposed.
  if (file.url && /^https?:\/\//.test(file.url)) {
    const upstream = await fetch(file.url)
    if (!upstream.ok || !upstream.body) return new Response('File unavailable', { status: 502 })
    return new Response(upstream.body, { headers })
  }

  const filePath = path.resolve(process.cwd(), 'media', file.filename)
  if (!existsSync(filePath)) return new Response('File unavailable', { status: 404 })
  headers['content-length'] = String(statSync(filePath).size)
  const stream = Readable.toWeb(createReadStream(filePath)) as ReadableStream
  return new Response(stream, { headers })
}
