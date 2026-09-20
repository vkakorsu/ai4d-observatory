import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DetailPage } from '@/components/DetailPage'
import { RichText } from '@/components/RichText'
import { DownloadBox, RelatedList } from '@/components/content'
import { ExternalLink, MetaList } from '@/components/ui'
import { SubscribeForm } from '@/components/forms/SubscribeForm'
import { findBySlug, getPayloadClient } from '@/lib/payload'
import { getSettings } from '@/lib/site'
import { buildMetadata } from '@/lib/seo'
import type { ContentTypeKey } from '@/lib/content-types'
import type { Newsletter } from '@/payload-types'

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 60

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'newsletters', limit: 500, depth: 0, where: { _status: { equals: 'published' } } })
  return res.docs.map((d) => ({ slug: d.slug ?? '' })).filter((p) => p.slug)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const doc = await findBySlug<Newsletter>(await getPayloadClient(), 'newsletters', slug, 0)
  if (!doc) return {}
  return buildMetadata({ title: doc.title, description: doc.summary, path: `/newsletter/${slug}`, seo: doc.seo })
}

export default async function NewsletterIssuePage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const [doc, settings] = await Promise.all([findBySlug<Newsletter>(payload, 'newsletters', slug, 2), getSettings()])
  if (!doc) notFound()
  const show = Boolean(settings.showPrototypeNotices)
  const featured = ((doc.featured ?? []) as Array<{ relationTo: ContentTypeKey; value: unknown }>)
    .filter((f) => f && typeof f.value === 'object')
    .map((f) => ({ collection: f.relationTo, doc: f.value as Record<string, unknown> }))

  return (
    <DetailPage
      crumbs={[{ href: '/newsletter', label: 'Newsletter' }, { label: `Issue ${doc.issueNumber}` }]}
      type={`Newsletter · Issue ${doc.issueNumber}`}
      title={doc.title}
      summary={doc.summary}
      date={doc.publishedAt}
      provenance={doc.provenance}
      showNotices={show}
      doc={doc as unknown as Record<string, unknown>}
      aside={
        <>
          <DownloadBox file={doc.pdf} resourceTitle={doc.title} resourceUrl={`/newsletter/${slug}`} consentText={settings.downloadConsentText} label="PDF version" />
          <MetaList items={[doc.externalUrl && { label: 'Web version', value: <ExternalLink href={doc.externalUrl}>View in browser</ExternalLink> }]} />
          <RelatedList items={featured} title="In this issue" />
          <div className="panel panel--tint">
            <h2 style={{ fontSize: 'var(--step-2)' }}>Get the next issue</h2>
            <SubscribeForm compact consentText={settings.newsletterConsentText} source={`newsletter/${slug}`} />
          </div>
        </>
      }
    >
      <RichText data={doc.body} serif />
    </DetailPage>
  )
}
