import Link from 'next/link'
import { Icon } from './Icon'
import { ProvenanceBadge, TaxChips } from './ui'
import { formatDateRange } from '@/lib/format'
import type { Event } from '@/payload-types'

export const FORMAT: Record<string, string> = { online: 'Online', 'in-person': 'In person', hybrid: 'Hybrid' }

export const EVENT_TYPE: Record<string, string> = {
  dialogue: 'Policy dialogue',
  webinar: 'Webinar',
  workshop: 'Workshop',
  convening: 'Convening',
  scopeathon: 'Scope-a-thon',
  cop: 'Community of Practice',
}

export function EventRow({ e, show }: { e: Event; show: boolean }) {
  const start = new Date(e.startDate)
  const past = start.getTime() < Date.now()
  const regOpen =
    !past &&
    e.registration?.mode &&
    e.registration.mode !== 'none' &&
    !(e.registration.closesAt && new Date(e.registration.closesAt).getTime() < Date.now())
  return (
    <article className="event-row">
      <div className={`date-block ${past ? 'date-block--past' : ''}`} aria-hidden="true">
        <span className="d">{start.getDate()}</span>
        <span className="m">{start.toLocaleString('en-GB', { month: 'short' })}</span>
        <span className="m">{start.getFullYear()}</span>
      </div>
      <div className="stack">
        <div className="item__type">
          <span className="dot" aria-hidden="true" />
          <span>{e.eventType ? EVENT_TYPE[e.eventType] ?? e.eventType : 'Event'}</span>
          <span>{FORMAT[e.format]}</span>
          {past ? <span className="badge">Past</span> : regOpen ? <span className="badge badge--live">Registration open</span> : null}
          <ProvenanceBadge provenance={e.provenance} show={show} />
        </div>
        <h3 className="item__title">
          <Link href={`/events/${e.slug}`}>{e.title}</Link>
        </h3>
        <p className="item__summary">{e.summary}</p>
        <div className="item__meta">
          <Icon name="calendar" size={14} /> {formatDateRange(e.startDate, e.endDate)}
          {e.venue && (
            <>
              <span aria-hidden="true">·</span> <Icon name="pin" size={14} /> {e.venue}
            </>
          )}
          {e.recordingUrl && (
            <>
              <span aria-hidden="true">·</span> <Icon name="video" size={14} /> Recording available
            </>
          )}
        </div>
        <TaxChips doc={e as unknown as Record<string, unknown>} limit={4} />
      </div>
    </article>
  )
}
