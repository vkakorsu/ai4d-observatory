import type { Metadata } from 'next'
import Link from '@/components/SmartLink'
import { notFound } from 'next/navigation'
import { DetailPage } from '@/components/DetailPage'
import { RichText } from '@/components/RichText'
import { DownloadBox, RelatedList } from '@/components/content'
import { Icon } from '@/components/Icon'
import { TrackLink } from '@/components/TrackLink'
import { JsonLd, MetaList } from '@/components/ui'
import { findBySlug, getPayloadClient } from '@/lib/payload'
import { getSettings, relatedContent } from '@/lib/site'
import { buildMetadata, jsonLd } from '@/lib/seo'
import { absoluteUrl, embedUrl } from '@/lib/format'
import type { LearningResource } from '@/payload-types'

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 60

const TYPE: Record<string, string> = {
  course: 'Course',
  video: 'Video',
  toolkit: 'Toolkit',
  guide: 'Guide',
  framework: 'Framework',
  'reading-list': 'Reading list',
}
const LEVEL: Record<string, string> = {
  introductory: 'Introductory',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'learning-resources',
    limit: 500,
    depth: 0,
    where: { _status: { equals: 'published' } },
  })
  return res.docs.map((d) => ({ slug: d.slug ?? '' })).filter((p) => p.slug)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const doc = await findBySlug<LearningResource>(
    await getPayloadClient(),
    'learning-resources',
    slug,
    1,
  )
  if (!doc) return {}
  return buildMetadata({
    title: doc.title,
    description: doc.summary,
    path: `/learning/${slug}`,
    seo: doc.seo,
  })
}

export default async function LearningResourcePage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const [doc, settings] = await Promise.all([
    findBySlug<LearningResource>(payload, 'learning-resources', slug, 2),
    getSettings(),
  ])
  if (!doc) notFound()
  const show = Boolean(settings.showPrototypeNotices)
  const related = await relatedContent(payload, doc as unknown as Record<string, unknown>, {
    collection: 'learning-resources',
    id: doc.id,
  })
  const org =
    doc.providerOrganisation && typeof doc.providerOrganisation === 'object'
      ? doc.providerOrganisation
      : null
  const embed = doc.videoEmbedUrl ? embedUrl(doc.videoEmbedUrl) : null
  const path = `/learning/${slug}`

  return (
    <DetailPage
      path={path}
      crumbs={[{ href: '/learning', label: 'Learning resources' }, { label: doc.title }]}
      type={TYPE[doc.resourceType] ?? 'Learning resource'}
      title={doc.title}
      summary={doc.summary}
      date={doc.publishedAt}
      provenance={doc.provenance}
      showNotices={show}
      doc={doc as unknown as Record<string, unknown>}
      aside={
        <>
          {doc.externalUrl && (
            <div className="download-box">
              <h2>
                <Icon name="book" size={16} /> Open the resource
              </h2>
              <p className="filemeta">{doc.provider ?? org?.name ?? 'External'}</p>
              <TrackLink
                className="btn btn--primary"
                href={doc.externalUrl}
                event="learning_open"
                data={{ resource: doc.title }}
                rel="noopener noreferrer"
              >
                Go to resource <Icon name="external" size={14} />
              </TrackLink>
            </div>
          )}
          <DownloadBox
            file={doc.file}
            resourceTitle={doc.title}
            resourceUrl={path}
            consentText={settings.downloadConsentText}
          />
          <MetaList
            items={[
              doc.level && { label: 'Level', value: LEVEL[doc.level] ?? doc.level },
              doc.duration && { label: 'Duration', value: doc.duration },
              { label: 'Language', value: doc.language ?? 'English' },
              (doc.provider || org) && {
                label: 'Provider',
                value: org ? (
                  <Link href={`/organisations/${org.slug}`}>{org.name}</Link>
                ) : (
                  doc.provider
                ),
              },
            ]}
          />
          <RelatedList items={related} />
        </>
      }
    >
      <JsonLd
        data={jsonLd.article({
          title: doc.title,
          description: doc.summary,
          url: absoluteUrl(path),
          datePublished: doc.publishedAt,
        })}
      />
      {embed && (
        <figure style={{ marginBottom: 'var(--s-5)' }}>
          <div
            style={{
              aspectRatio: '16 / 9',
              border: 'var(--rule)',
              background: 'var(--paper-deep)',
            }}
          >
            <iframe
              src={embed}
              title={doc.title}
              width="100%"
              height="100%"
              loading="lazy"
              allow="encrypted-media; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              style={{ border: 0, display: 'block', width: '100%', height: '100%' }}
            />
          </div>
          <figcaption className="tiny muted">
            Video is embedded from an external service.{' '}
            <a href={doc.videoEmbedUrl ?? '#'}>Open on the provider’s site</a>.
          </figcaption>
        </figure>
      )}
      <RichText data={doc.description} serif />
    </DetailPage>
  )
}
