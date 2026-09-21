import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@/components/RichText'
import { Breadcrumbs, PageHeader, ProvenanceBadge } from '@/components/ui'
import { findBySlug, getPayloadClient } from '@/lib/payload'
import { getSettings } from '@/lib/site'
import { FILESYSTEM_TOP_SLUGS } from '@/lib/content-types'
import { buildMetadata } from '@/lib/seo'
import type { Page } from '@/payload-types'

/** CMS-managed standalone pages, for example /accessibility and /privacy. `about` has its own route. */

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 60

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'pages', limit: 100, depth: 0, where: { _status: { equals: 'published' } } })
  return res.docs
    .map((d) => ({ slug: d.slug ?? '' }))
    .filter((p) => p.slug && !FILESYSTEM_TOP_SLUGS.has(p.slug))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  if (FILESYSTEM_TOP_SLUGS.has(slug)) return {}
  const doc = await findBySlug<Page>(await getPayloadClient(), 'pages', slug, 0)
  if (!doc) return {}
  return buildMetadata({ title: doc.title, description: doc.summary, path: `/${slug}`, seo: doc.seo })
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params
  if (FILESYSTEM_TOP_SLUGS.has(slug)) notFound()
  const payload = await getPayloadClient()
  const [doc, settings] = await Promise.all([findBySlug<Page>(payload, 'pages', slug, 1), getSettings()])
  if (!doc) notFound()
  const show = Boolean(settings.showPrototypeNotices)
  return (
    <div className="container">
      <Breadcrumbs items={[{ label: doc.title }]} />
      <PageHeader title={doc.title} lede={doc.summary} />
      <article style={{ paddingBottom: 'var(--s-8)' }}>
        {show && doc.provenance === 'sample' && (
          <p className="small">
            <ProvenanceBadge provenance={doc.provenance} show={show} /> Draft text for the Client to review and replace.
          </p>
        )}
        <RichText data={doc.body} />
      </article>
    </div>
  )
}
