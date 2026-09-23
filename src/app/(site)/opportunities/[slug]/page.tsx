import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DetailPage } from '@/components/DetailPage'
import { RichText } from '@/components/RichText'
import { Deadline } from '@/components/Deadline'
import { Icon } from '@/components/Icon'
import { TrackLink } from '@/components/TrackLink'
import { JsonLd, MetaList } from '@/components/ui'
import { findBySlug, getPayloadClient } from '@/lib/payload'
import { getSettings } from '@/lib/site'
import { buildMetadata, jsonLd } from '@/lib/seo'
import { absoluteUrl, formatDate, isPast } from '@/lib/format'
import type { Opportunity } from '@/payload-types'

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 60

const TYPE: Record<string, string> = {
  fellowship: 'Fellowship',
  grant: 'Grant or funding call',
  programme: 'Programme',
  'call-for-papers': 'Call for papers',
  job: 'Job',
  competition: 'Competition',
  event: 'Event',
}

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'opportunities',
    limit: 500,
    depth: 0,
    where: { _status: { equals: 'published' } },
  })
  return res.docs.map((d) => ({ slug: d.slug ?? '' })).filter((p) => p.slug)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const doc = await findBySlug<Opportunity>(await getPayloadClient(), 'opportunities', slug, 1)
  if (!doc) return {}
  return buildMetadata({
    title: doc.title,
    description: doc.summary,
    path: `/opportunities/${slug}`,
    seo: doc.seo,
  })
}

export default async function OpportunityPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const [doc, settings] = await Promise.all([
    findBySlug<Opportunity>(payload, 'opportunities', slug, 2),
    getSettings(),
  ])
  if (!doc) notFound()
  const show = Boolean(settings.showPrototypeNotices)
  const closed = Boolean(doc.deadline && !doc.rolling && isPast(doc.deadline))
  const path = `/opportunities/${slug}`

  return (
    <DetailPage
      path={path}
      crumbs={[{ href: '/opportunities', label: 'Opportunities' }, { label: doc.title }]}
      type={TYPE[doc.opportunityType] ?? 'Opportunity'}
      title={doc.title}
      summary={doc.summary}
      date={doc.publishedAt}
      provenance={doc.provenance}
      showNotices={show}
      doc={doc as unknown as Record<string, unknown>}
      aside={
        <>
          <div className="download-box">
            <h2>
              <Icon name="external" size={16} /> {closed ? 'This opportunity has closed' : 'Apply'}
            </h2>
            <p className="filemeta">
              <Deadline deadline={doc.deadline} rolling={doc.rolling} />
            </p>
            <TrackLink
              className={`btn ${closed ? '' : 'btn--primary'}`}
              href={doc.externalUrl}
              event="opportunity_open"
              data={{ resource: doc.title, closed }}
              rel="noopener noreferrer"
            >
              {closed ? 'View on organiser’s site' : 'Go to application'}{' '}
              <Icon name="external" size={14} />
            </TrackLink>
          </div>
          <MetaList
            items={[
              { label: 'Provider', value: doc.provider },
              doc.deadline && { label: 'Deadline', value: formatDate(doc.deadline) },
              doc.rolling && { label: 'Deadline', value: 'Rolling' },
              doc.eligibility && {
                label: 'Eligibility',
                value: <span className="small">{doc.eligibility}</span>,
              },
            ]}
          />
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
      <RichText data={doc.description} serif />
      <p className="tiny muted" style={{ marginTop: 'var(--s-6)' }}>
        The Observatory lists opportunities as a service to the network. Terms, eligibility and
        deadlines are set by the provider.
      </p>
    </DetailPage>
  )
}
