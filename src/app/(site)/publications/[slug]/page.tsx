import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DetailPage } from '@/components/DetailPage'
import { RichText } from '@/components/RichText'
import { DownloadBox, OrgLinks, PeopleLinks, RelatedList } from '@/components/content'
import { ExternalLink, JsonLd, MetaList } from '@/components/ui'
import { TrackLink } from '@/components/TrackLink'
import { Icon } from '@/components/Icon'
import { findBySlug, getPayloadClient } from '@/lib/payload'
import { getSettings, relatedContent } from '@/lib/site'
import { buildMetadata, jsonLd } from '@/lib/seo'
import { absoluteUrl } from '@/lib/format'
import { publicationTypes } from '@/collections/content'
import type { Publication } from '@/payload-types'

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 60

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'publications', limit: 500, depth: 0, where: { _status: { equals: 'published' } } })
  return res.docs.map((d) => ({ slug: d.slug ?? '' })).filter((p) => p.slug)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const doc = await findBySlug<Publication>(await getPayloadClient(), 'publications', slug, 1)
  if (!doc) return {}
  return buildMetadata({
    title: doc.title,
    description: doc.summary,
    path: `/publications/${slug}`,
    type: 'article',
    image: typeof doc.cover === 'object' ? doc.cover : null,
    seo: doc.seo,
    publishedAt: doc.publishedAt,
  })
}

export default async function PublicationPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const [doc, settings] = await Promise.all([findBySlug<Publication>(payload, 'publications', slug, 2), getSettings()])
  if (!doc) notFound()
  const show = Boolean(settings.showPrototypeNotices)
  const related = await relatedContent(payload, doc as unknown as Record<string, unknown>, { collection: 'publications', id: doc.id })
  const typeLabel = publicationTypes.find((t) => t.value === doc.type)?.label ?? 'Publication'
  const authors = Array.isArray(doc.authors) ? doc.authors.filter((a) => typeof a === 'object') : []
  const authorNames = authors.map((a) => (a as { name: string }).name)
  if (doc.authorText) authorNames.push(doc.authorText)
  const path = `/publications/${slug}`

  return (
    <DetailPage
      crumbs={[{ href: '/publications', label: 'Publications' }, { label: doc.title }]}
      type={typeLabel}
      title={doc.title}
      summary={doc.summary}
      date={doc.publishedAt}
      provenance={doc.provenance}
      showNotices={show}
      doc={doc as unknown as Record<string, unknown>}
      aside={
        <>
          <DownloadBox file={doc.file} resourceTitle={doc.title} resourceUrl={path} consentText={settings.downloadConsentText} />
          {doc.externalUrl && (
            <div className="download-box">
              <h2>
                <Icon name="external" size={16} /> Read externally
              </h2>
              <p className="filemeta">Hosted by the publisher</p>
              <TrackLink className="btn" href={doc.externalUrl} event="outbound_publication" data={{ resource: doc.title }} rel="noopener noreferrer">
                Open publication <Icon name="external" size={14} />
              </TrackLink>
            </div>
          )}
          <MetaList
            items={[
              authorNames.length > 0 && {
                label: 'Authors',
                value: authors.length ? <PeopleLinks people={authors} /> : doc.authorText,
              },
              Array.isArray(doc.organisations) && doc.organisations.length > 0 && { label: 'Organisations', value: <OrgLinks orgs={doc.organisations} /> },
              doc.pages && { label: 'Pages', value: doc.pages },
              doc.citation && { label: 'Cite as', value: <span className="tiny">{doc.citation}</span> },
            ]}
          />
          <RelatedList items={related} />
        </>
      }
    >
      <JsonLd
        data={jsonLd.report({
          title: doc.title,
          description: doc.summary,
          url: absoluteUrl(path),
          datePublished: doc.publishedAt,
          authors: authorNames,
        })}
      />
      {doc.authorText && authors.length === 0 && <p className="muted">By {doc.authorText}</p>}
      {doc.abstract ? (
        <RichText data={doc.abstract} serif />
      ) : (
        <p className="prose prose--serif">{doc.summary}</p>
      )}
      {doc.externalUrl && !doc.file && (
        <p className="small">
          This publication is hosted elsewhere. <ExternalLink href={doc.externalUrl}>Read it at the source</ExternalLink>.
        </p>
      )}
    </DetailPage>
  )
}
