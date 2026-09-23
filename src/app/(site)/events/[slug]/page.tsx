import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DetailPage } from '@/components/DetailPage'
import { RichText } from '@/components/RichText'
import { OrgLinks, PeopleLinks, RelatedList } from '@/components/content'
import { RegisterForm } from '@/components/forms/RegisterForm'
import { EVENT_TYPE, FORMAT } from '@/components/EventRow'
import { Icon } from '@/components/Icon'
import { TrackLink } from '@/components/TrackLink'
import { ExternalLink, JsonLd, MetaList } from '@/components/ui'
import { findBySlug, getPayloadClient } from '@/lib/payload'
import { getSettings, relatedContent } from '@/lib/site'
import { buildMetadata, jsonLd } from '@/lib/seo'
import { absoluteUrl, formatDateRange, isPast } from '@/lib/format'
import type { Event } from '@/payload-types'

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 60

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'events',
    limit: 500,
    depth: 0,
    where: { _status: { equals: 'published' } },
  })
  return res.docs.map((d) => ({ slug: d.slug ?? '' })).filter((p) => p.slug)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const doc = await findBySlug<Event>(await getPayloadClient(), 'events', slug, 1)
  if (!doc) return {}
  return buildMetadata({
    title: doc.title,
    description: doc.summary,
    path: `/events/${slug}`,
    image: typeof doc.image === 'object' ? doc.image : null,
    seo: doc.seo,
  })
}

const timeIn = (iso: string, tz: string) =>
  new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: tz,
    timeZoneName: 'short',
  }).format(new Date(iso))

export default async function EventPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const [doc, settings] = await Promise.all([
    findBySlug<Event>(payload, 'events', slug, 2),
    getSettings(),
  ])
  if (!doc) notFound()
  const show = Boolean(settings.showPrototypeNotices)
  const related = await relatedContent(payload, doc as unknown as Record<string, unknown>, {
    collection: 'events',
    id: doc.id,
  })
  const past = isPast(doc.startDate)
  const reg = doc.registration
  const closed = isPast(reg?.closesAt)
  const tz = doc.timezone || 'Asia/Colombo'
  // The join link is staff-only at field level. Show it publicly only for open events that need no registration.
  const openJoinUrl =
    doc.format !== 'in-person' && !past && (!reg || reg.mode === 'none')
      ? (
          await payload.findByID({
            collection: 'events',
            id: doc.id,
            depth: 0,
            select: { onlineUrl: true },
          })
        ).onlineUrl
      : null
  const path = `/events/${slug}`

  return (
    <DetailPage
      path={path}
      crumbs={[{ href: '/events', label: 'Events' }, { label: doc.title }]}
      type={doc.eventType ? (EVENT_TYPE[doc.eventType] ?? 'Event') : 'Event'}
      title={doc.title}
      summary={doc.summary}
      provenance={doc.provenance}
      showNotices={show}
      doc={doc as unknown as Record<string, unknown>}
      aside={
        <>
          <div className="download-box">
            <h2>
              <Icon name="calendar" size={16} />{' '}
              {past ? 'This event has taken place' : 'Registration'}
            </h2>
            {past ? (
              doc.recordingUrl ? (
                <TrackLink
                  className="btn btn--primary"
                  href={doc.recordingUrl}
                  event="event_recording"
                  data={{ event: doc.title }}
                  rel="noopener noreferrer"
                >
                  <Icon name="video" size={16} /> Watch the recording
                </TrackLink>
              ) : (
                <p className="small muted" style={{ margin: 0 }}>
                  No recording has been published.
                </p>
              )
            ) : !reg || reg.mode === 'none' ? (
              <p className="small muted" style={{ margin: 0 }}>
                No registration is needed.
              </p>
            ) : closed ? (
              <p className="small muted" style={{ margin: 0 }}>
                Registration closed on {formatDateRange(reg.closesAt)}.
              </p>
            ) : reg.mode === 'external' && reg.externalUrl ? (
              <>
                <p className="filemeta">Hosted by the organiser</p>
                <TrackLink
                  className="btn btn--primary"
                  href={reg.externalUrl}
                  event="event_register_external"
                  data={{ event: doc.title }}
                  rel="noopener noreferrer"
                >
                  Register <Icon name="external" size={14} />
                </TrackLink>
              </>
            ) : (
              <>
                {reg.closesAt && <p className="filemeta">Closes {formatDateRange(reg.closesAt)}</p>}
                <RegisterForm
                  eventId={String(doc.id)}
                  eventTitle={doc.title}
                  consentText={settings.registrationConsentText}
                />
              </>
            )}
          </div>
          <MetaList
            items={[
              {
                label: 'When',
                value: (
                  <>
                    {formatDateRange(doc.startDate, doc.endDate)}
                    <br />
                    <span className="small muted">
                      {timeIn(doc.startDate, tz)} ({tz})
                    </span>
                  </>
                ),
              },
              { label: 'Format', value: FORMAT[doc.format] },
              doc.venue && { label: 'Venue', value: doc.venue },
              openJoinUrl && {
                label: 'Join',
                value: <ExternalLink href={openJoinUrl}>Online link</ExternalLink>,
              },
              Array.isArray(doc.organisations) &&
                doc.organisations.length > 0 && {
                  label: 'Organised by',
                  value: <OrgLinks orgs={doc.organisations} />,
                },
              Array.isArray(doc.speakers) &&
                doc.speakers.length > 0 && {
                  label: 'Speakers',
                  value: <PeopleLinks people={doc.speakers} />,
                },
            ]}
          />
          <RelatedList items={related} />
        </>
      }
    >
      <JsonLd
        data={jsonLd.event({
          title: doc.title,
          description: doc.summary,
          url: absoluteUrl(path),
          startDate: doc.startDate,
          endDate: doc.endDate,
          format: doc.format,
          venue: doc.venue,
          organiser:
            (doc.organisations ?? [])
              .map((o) => (typeof o === 'object' ? o.name : null))
              .find(Boolean) ?? 'Asia AI4D Observatory',
        })}
      />
      <RichText data={doc.description} serif />
    </DetailPage>
  )
}
