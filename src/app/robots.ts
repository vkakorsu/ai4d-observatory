import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/format'

export default function robots(): MetadataRoute.Robots {
  // Set NEXT_PUBLIC_NOINDEX=true on evaluation and staging hosts so they never compete with the production domain.
  const noindex = process.env.NEXT_PUBLIC_NOINDEX === 'true'
  return {
    rules: noindex
      ? [{ userAgent: '*', disallow: '/' }]
      : [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/download/', '/search', '/prototype-notes'] }],
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
