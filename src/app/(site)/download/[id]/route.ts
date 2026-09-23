import { type NextRequest } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { verifyGateToken } from '@/lib/gate'
import { attachmentHeader, readStoredFile } from '@/lib/media-files'

/**
 * Serves an email-gated file after the form has been completed (Section 3.1.2).
 * The link is signed and short-lived. The public file endpoint refuses gated files, so this is the only route to them.
 * Bytes are read from storage directly; the storage URL is never exposed to the visitor.
 */
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const payload = await getPayloadClient()
  const token = verifyGateToken(req.nextUrl.searchParams.get('t'), payload.secret)
  if (!token || token.fileId !== id) {
    return new Response(
      'This download link is invalid or has expired. Please request a new one from the resource page.',
      {
        status: 403,
        headers: { 'content-type': 'text/plain; charset=utf-8' },
      },
    )
  }
  const file = await payload
    .findByID({ collection: 'media', id, depth: 0, overrideAccess: true })
    .catch(() => null)
  if (!file || !file.filename) return new Response('Not found', { status: 404 })

  const stored = await readStoredFile(file.filename)
  if (!stored) {
    payload.logger.error({ id, filename: file.filename }, 'Gated file missing from storage')
    return new Response('File unavailable', { status: 404 })
  }

  const headers: Record<string, string> = {
    'content-type': file.mimeType ?? 'application/octet-stream',
    'content-disposition': attachmentHeader(file.filename),
    'cache-control': 'private, no-store',
    'x-robots-tag': 'noindex',
    'x-content-type-options': 'nosniff',
  }
  if (stored.size) headers['content-length'] = String(stored.size)
  return new Response(stored.body, { headers })
}
