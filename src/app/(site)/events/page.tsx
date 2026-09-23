import type { Metadata } from 'next'
import Link from '@/components/SmartLink'
import { ListingPage, type PageProps } from '@/components/ListingPage'
import { EventRow } from '@/components/EventRow'
import { eventFilters } from '@/lib/filters'
import { getParam } from '@/lib/queries'
import type { Event } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Policy dialogues, webinars, workshops, convenings, scope-a-thons and Community of Practice sessions of the Asia AI4D Observatory.',
  alternates: { types: { 'application/rss+xml': '/feed/events.xml' } },
}

export default async function EventsPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const when = getParam(sp, 'when') === 'past' ? 'past' : 'upcoming'
  const now = new Date().toISOString()
  const spWithWhen = when === 'past' ? { ...sp, when } : sp
  return (
    <ListingPage
      collection="events"
      sp={spWithWhen}
      defs={eventFilters}
      action="/events"
      kicker="Engage"
      title="Events"
      lede="Regional policy dialogues, webinars, workshops and Community of Practice sessions. Registration happens on this site where the Observatory hosts the event, and through the organiser’s page where it does not."
      noun="event"
      sort={when === 'past' ? '-startDate' : 'startDate'}
      extraWhere={
        when === 'past'
          ? { startDate: { less_than: now } }
          : { startDate: { greater_than_equal: now } }
      }
      extraControls={when === 'past' ? <input type="hidden" name="when" value="past" /> : undefined}
      intro={
        <nav className="tabs" aria-label="Upcoming or past">
          <Link href="/events" aria-current={when === 'upcoming' ? 'page' : undefined}>
            Upcoming
          </Link>
          <Link href="/events?when=past" aria-current={when === 'past' ? 'page' : undefined}>
            Past and recordings
          </Link>
        </nav>
      }
      renderItem={(doc, show) => <EventRow e={doc as unknown as Event} show={show} />}
      emptyTitle={when === 'past' ? 'No past events yet' : 'No upcoming events'}
    />
  )
}
