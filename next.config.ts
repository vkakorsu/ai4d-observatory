import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

/**
 * Content Security Policy (Section 3.1.6 b). Third-party origins are limited to the configured
 * analytics provider and the two video hosts the embed helper produces. Payload's admin UI and
 * Next.js need inline scripts and styles, so script-src allows them. worker-src and child-src
 * include blob: for the Lexical editor; connect-src allows Vercel Blob when media is stored there.
 * frame-ancestors, object-src, base-uri and form-action still close the common injection paths.
 * HSTS is set by the reverse proxy.
 */
const analyticsOrigins = [
  process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ? new URL(process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL).origin : '',
  process.env.NEXT_PUBLIC_GA4_ID ? 'https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com' : '',
]
  .filter(Boolean)
  .join(' ')

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${analyticsOrigins}`.trim(),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' https://*.public.blob.vercel-storage.com https://blob.vercel-storage.com ${analyticsOrigins}`.trim(),
  "worker-src 'self' blob:",
  "child-src 'self' blob:",
  "media-src 'self' blob:",
  'frame-src https://www.youtube-nocookie.com https://player.vimeo.com',
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

const nextConfig: NextConfig = {
  // Docker copies `.next/standalone`. Vercel uses its own output, so standalone is off there.
  ...(process.env.VERCEL ? {} : { output: 'standalone' as const }),
  images: {
    // WebP only. AVIF optimisation was disabled upstream after the August 2026 libheif advisory (GHSA-2xp9-vwfh-vxw4).
    formats: ['image/webp'],
    localPatterns: [{ pathname: '/api/media/file/**' }],
  },
  poweredByHeader: false,
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'Content-Security-Policy', value: contentSecurityPolicy },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    },
  ],
  serverExternalPackages: ['libsql', '@libsql/client', '@payloadcms/db-sqlite'],
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
