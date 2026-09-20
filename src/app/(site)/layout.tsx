import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
// Weight axis only. The optical-size build is 2.3 times heavier (279 KB against 123 KB for roman and italic),
// which matters more to this audience than the subtler display cut (Section 3.1.5 c).
import '@fontsource-variable/newsreader/wght.css'
import '@fontsource-variable/newsreader/wght-italic.css'
import '@fontsource-variable/ibm-plex-sans/index.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import '@/styles/tokens.css'
import '@/styles/base.css'
import '@/styles/components.css'
import { SiteFooter, SiteHeader } from '@/components/SiteChrome'
import { Analytics } from '@/components/Analytics'
import { AutoSubmit } from '@/components/listing'
import { JsonLd } from '@/components/ui'
import { getSettings } from '@/lib/site'
import { siteUrl } from '@/lib/format'
import { jsonLd } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: s.siteName, template: `%s | ${s.siteName}` },
    description: s.description ?? undefined,
    applicationName: s.siteName,
    alternates: { types: { 'application/rss+xml': '/feed.xml' } },
    openGraph: { siteName: s.siteName, type: 'website', locale: 'en_GB' },
    icons: { icon: '/icon.svg' },
  }
}

export const viewport: Viewport = { themeColor: '#f7f5f0', width: 'device-width', initialScale: 1 }

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings()
  return (
    <html lang="en-GB">
      <body>
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <SiteHeader settings={settings} />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter settings={settings} />
        <AutoSubmit />
        <Analytics />
        <JsonLd data={jsonLd.website(settings.siteName, siteUrl())} />
      </body>
    </html>
  )
}
