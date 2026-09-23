import type { Metadata } from 'next'
import { absoluteUrl, truncate } from './format'

/**
 * Metadata for search engines and social sharing (Section 3.1.6 e).
 * Editors can override title, description and image per document through the `seo` group.
 */

type SeoInput = {
  title: string
  description?: string | null
  path: string
  type?: 'website' | 'article'
  image?: { url?: string | null; alt?: string | null } | null
  seo?: {
    metaTitle?: string | null
    metaDescription?: string | null
    image?: { url?: string | null; alt?: string | null } | string | number | null
    noIndex?: boolean | null
  } | null
  publishedAt?: string | null
  siteName?: string
}

const isSvg = (u: string) => /\.svg(\?|#|$)/i.test(u)

export const buildMetadata = (input: SeoInput): Metadata => {
  const siteName = input.siteName ?? 'Asia AI4D Observatory'
  const title = input.seo?.metaTitle || input.title
  const description = truncate(input.seo?.metaDescription || input.description || '', 160)
  const seoImage = input.seo?.image && typeof input.seo.image === 'object' ? input.seo.image : null
  // Social platforms do not render SVG previews. Use an uploaded raster image when there is one,
  // otherwise the item's generated share card (/og/<path>).
  const raster = [seoImage?.url, input.image?.url].find(
    (u): u is string => Boolean(u) && !isSvg(u as string),
  )
  const url = absoluteUrl(input.path)
  const ogImage = raster
    ? absoluteUrl(raster)
    : absoluteUrl(input.path === '/' ? '/og/home' : `/og${input.path}`)
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: input.seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName,
      type: input.type ?? 'website',
      images: [
        {
          url: ogImage,
          alt: seoImage?.alt || input.image?.alt || title,
          ...(raster ? {} : { width: 1200, height: 630 }),
        },
      ],
      ...(input.publishedAt && input.type === 'article'
        ? { publishedTime: input.publishedAt }
        : {}),
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  }
}

/** JSON-LD helpers. Schema.org types chosen per content type. */
export const jsonLd = {
  organisation: (name: string, url: string) => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
  }),
  website: (name: string, url: string) => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }),
  article: (a: {
    title: string
    description?: string
    url: string
    datePublished?: string | null
    authors?: string[]
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    url: a.url,
    datePublished: a.datePublished ?? undefined,
    author: a.authors?.map((name) => ({ '@type': 'Person', name })),
  }),
  report: (a: {
    title: string
    description?: string
    url: string
    datePublished?: string | null
    authors?: string[]
  }) => ({
    ...jsonLd.article(a),
    '@type': 'Report',
  }),
  dataset: (d: {
    title: string
    description?: string
    url: string
    creator?: string
    license?: string
    temporalCoverage?: string
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: d.title,
    description: d.description,
    url: d.url,
    creator: d.creator ? { '@type': 'Organization', name: d.creator } : undefined,
    license: d.license,
    temporalCoverage: d.temporalCoverage,
  }),
  event: (e: {
    title: string
    description?: string
    url: string
    startDate: string
    endDate?: string | null
    format: 'online' | 'in-person' | 'hybrid'
    venue?: string | null
    organiser?: string | null
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: e.title,
    description: e.description,
    url: e.url,
    startDate: e.startDate,
    endDate: e.endDate ?? undefined,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: {
      online: 'https://schema.org/OnlineEventAttendanceMode',
      'in-person': 'https://schema.org/OfflineEventAttendanceMode',
      hybrid: 'https://schema.org/MixedEventAttendanceMode',
    }[e.format],
    // The virtual location points at the event page, never at the join link, which is for registrants.
    location: [
      ...(e.format !== 'in-person' ? [{ '@type': 'VirtualLocation', url: e.url }] : []),
      ...(e.format !== 'online'
        ? [{ '@type': 'Place', name: e.venue ?? 'To be announced', address: e.venue ?? undefined }]
        : []),
    ],
    organizer: e.organiser ? { '@type': 'Organization', name: e.organiser } : undefined,
  }),
  person: (p: {
    name: string
    url: string
    jobTitle?: string | null
    affiliation?: string | null
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: p.name,
    url: p.url,
    jobTitle: p.jobTitle ?? undefined,
    affiliation: p.affiliation ? { '@type': 'Organization', name: p.affiliation } : undefined,
  }),
  breadcrumbs: (items: Array<{ name: string; url: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  }),
}
