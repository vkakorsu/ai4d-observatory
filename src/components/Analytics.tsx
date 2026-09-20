'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Analytics adapter (Section 3.1.6 d).
 * Provider is chosen by NEXT_PUBLIC_ANALYTICS_PROVIDER. "none" until the Client's property exists.
 * Custom events (download, subscribe, register, search) go through `track` so the provider can change
 * without touching the components that fire them.
 */

type Provider = 'none' | 'umami' | 'ga4'

const provider = (process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER || 'none') as Provider

declare global {
  interface Window {
    umami?: { track: (name: string, data?: Record<string, unknown>) => void }
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export function track(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  if (provider === 'umami' && window.umami) window.umami.track(event, data)
  else if (provider === 'ga4' && window.gtag) window.gtag('event', event, data)
  else if (process.env.NODE_ENV !== 'production') console.debug('[analytics:none]', event, data)
}

export function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    // Page views. Umami tracks automatically. GA4 needs a page_view on client navigation.
    if (provider === 'ga4' && window.gtag) window.gtag('event', 'page_view', { page_path: pathname })
  }, [pathname])

  if (provider === 'umami' && process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL && process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID) {
    return (
      <Script
        defer
        src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL}
        data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
        strategy="afterInteractive"
      />
    )
  }
  if (provider === 'ga4' && process.env.NEXT_PUBLIC_GA4_ID) {
    const id = process.env.NEXT_PUBLIC_GA4_ID
    return (
      <>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}',{anonymize_ip:true});`}
        </Script>
      </>
    )
  }
  return null
}
