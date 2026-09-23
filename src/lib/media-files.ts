import { createReadStream, existsSync, statSync } from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'
import { head } from '@vercel/blob'

/**
 * Read an uploaded file's bytes straight from storage.
 *
 * The public route /api/media/file/:filename refuses anonymous requests for gated files, so a
 * server-side fetch of that URL fails by design. Gated delivery (/download/:id) therefore reads the
 * storage layer itself: the local media directory on a server, or the Blob store on Vercel.
 */
export type StoredFile = { body: ReadableStream; size?: number }

export const MEDIA_DIR = path.resolve(process.cwd(), process.env.MEDIA_DIR || 'media')

export async function readStoredFile(filename: string): Promise<StoredFile | null> {
  // Never let a stored filename escape the media directory.
  const safe = path.basename(filename)
  if (!safe || safe !== filename) return null

  if (process.env.MEDIA_STORAGE === 'vercel-blob' && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await head(safe, { token: process.env.BLOB_READ_WRITE_TOKEN })
      const res = await fetch(blob.url, { cache: 'no-store' })
      if (!res.ok || !res.body) return null
      return { body: res.body, size: blob.size }
    } catch {
      return null
    }
  }

  const filePath = path.join(MEDIA_DIR, safe)
  if (!existsSync(filePath)) return null
  return {
    body: Readable.toWeb(createReadStream(filePath)) as ReadableStream,
    size: statSync(filePath).size,
  }
}

/** RFC 6266 Content-Disposition with an ASCII fallback and a UTF-8 filename. */
export const attachmentHeader = (filename: string) => {
  const ascii = filename.replace(/[^\x20-\x7e]/g, '_').replace(/["\\]/g, '_')
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(filename)}`
}
