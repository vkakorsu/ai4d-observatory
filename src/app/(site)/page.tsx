import Link from 'next/link'
import type { Metadata } from 'next'
import { Icon } from '@/components/Icon'
import { Item, ItemList } from '@/components/listing'
import { RegionMap, type MapRow } from '@/components/data-viz'
import { PendingBadge, ProvenanceBadge, Section, TaxChips } from '@/components/ui'
import { SubscribeForm } from '@/components/forms/SubscribeForm'
import { getPayloadClient } from '@/lib/payload'
import { countPublished, getHome, getSettings, indicatorRows, latest } from '@/lib/site'
import { CONTENT_TYPES, pathFor, type ContentTypeKey } from '@/lib/content-types'
import { formatDate, formatDateRange } from '@/lib/format'
import type { Event, Indicator } from '@/payload-types'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  return { title: { absolute: `${s.siteName}. ${s.tagline ?? ''}`.trim() }, description: s.description ?? undefined }
}

type FeaturedRel = { relationTo: ContentTypeKey; value: Record<string, unknown> & { id: string | number; slug?: string | null } }

export default async function HomePage() {
  const payload = await getPayloadClient()
  const [settings, home, counts] = await Promise.all([
    getSettings(),
    getHome(),
    countPublished(payload, ['use-cases', 'publications', 'datasets', 'people', 'organisations', 'events']),
  ])
  const show = Boolean(settings.showPrototypeNotices)

  const featured = ((home.featured ?? []) as unknown as FeaturedRel[]).filter((f) => f && typeof f.value === 'object')
  const [lead, ...side] = featured

  const indicator = (home.featuredIndicator && typeof home.featuredIndicator === 'object' ? home.featuredIndicator : null) as Indicator | null
  const data = indicator ? await indicatorRows(payload, indicator.id) : null

  const [useCases, publications, events, posts] = await Promise.all([
    latest(payload, 'use-cases', 3),
    latest(payload, 'publications', 3),
    latest<Event>(payload, 'events', 3, { startDate: { greater_than_equal: new Date().toISOString() } }, 'startDate'),
    latest(payload, 'posts', 3),
  ])

  return (
    <>
      <div className="container">
        <section className="hero" aria-labelledby="hero-h">
          <div>
            <p className="kicker">Asia AI4D Observatory</p>
            <h1 id="hero-h">{home.headline}</h1>
            <div className="hero__actions">
              <Link className="btn btn--primary" href="/use-cases">
                Explore use cases <Icon name="arrow" size={16} />
              </Link>
              <Link className="btn" href="/data">
                <Icon name="map" size={16} /> Data and maps
              </Link>
              <Link className="btn btn--ghost" href="/search">
                <Icon name="search" size={16} /> Search everything
              </Link>
            </div>
          </div>
          <aside className="hero__aside">
            <p>{home.intro}</p>
            <div className="hero__stats">
              <Link className="stat" href="/use-cases">
                <span className="stat__n">{counts['use-cases']}</span>
                <span className="stat__l">Use cases</span>
              </Link>
              <Link className="stat" href="/publications">
                <span className="stat__n">{counts.publications}</span>
                <span className="stat__l">Publications</span>
              </Link>
              <Link className="stat" href="/datasets">
                <span className="stat__n">{counts.datasets}</span>
                <span className="stat__l">Datasets</span>
              </Link>
              <Link className="stat" href="/directory">
                <span className="stat__n">{counts.people + counts.organisations}</span>
                <span className="stat__l">People and organisations</span>
              </Link>
            </div>
          </aside>
        </section>

        {lead && (
          <Section flush>
            <div className="lead-grid">
              {/* The title carries the link. Taxonomy chips are links of their own, so the card itself is not an anchor. */}
              <article className="lead">
                <span className="item__type">
                  <span className="dot" aria-hidden="true" /> {CONTENT_TYPES[lead.relationTo].label}
                  {typeof lead.value.publishedAt === 'string' && (
                    <time dateTime={lead.value.publishedAt}>{formatDate(lead.value.publishedAt)}</time>
                  )}
                  <ProvenanceBadge provenance={String(lead.value.provenance ?? '')} show={show} />
                </span>
                <h2 className="lead__title">
                  <Link href={pathFor(lead.relationTo, lead.value.slug ?? '')}>
                    {String(lead.value[CONTENT_TYPES[lead.relationTo].titleField] ?? '')}
                  </Link>
                </h2>
                <p className="lead__summary">{String(lead.value.summary ?? '')}</p>
                <TaxChips doc={lead.value} limit={5} />
              </article>
              <div className="lead-side">
                {side.map((f) => (
                  <Item key={`${f.relationTo}-${f.value.id}`} collection={f.relationTo} doc={f.value} showNotices={show} compact />
                ))}
              </div>
            </div>
          </Section>
        )}
      </div>

      {indicator && data && (
        <div className="container">
          <Section
            id="map"
            title={indicator.name}
            more={{ href: `/data/${indicator.slug}`, label: 'Explore this indicator' }}
          >
            <div className="lead-grid">
              <RegionMap rows={data.rows as MapRow[]} indicator={indicator} year={data.year} id="home-map" />
              <div className="flow" style={{ alignSelf: 'center' }}>
                <p className="lede" style={{ fontSize: 'var(--step-2)' }}>
                  {indicator.definition}
                </p>
                <p className="small muted">
                  Source. {indicator.sourceUrl ? <a href={indicator.sourceUrl}>{indicator.source}</a> : indicator.source}.
                  {' '}Every map on this site comes with a legend, a plain-language summary, a table and a CSV export.
                </p>
                {show && indicator.provenance === 'sample' && (
                  <p className="small">
                    <PendingBadge>Illustrative values</PendingBadge> Indicator values are placeholders so the mechanism can be
                    reviewed. Real benchmarking data replaces them through the CMS.
                  </p>
                )}
                <p>
                  <Link className="btn" href="/data">
                    All indicators <Icon name="arrow" size={16} />
                  </Link>
                </p>
              </div>
            </div>
          </Section>
        </div>
      )}

      {home.audienceEntries && home.audienceEntries.length > 0 && (
        <div className="container">
          <Section id="audiences" title="Start from what you need">
            <div className="audience-grid">
              {home.audienceEntries.map((a) => (
                <Link className="audience" href={a.url} key={a.id ?? a.label}>
                  <strong>{a.label}</strong>
                  <span>{a.description}</span>
                  <Icon className="arrow" name="arrow" size={18} />
                </Link>
              ))}
            </div>
            {show && (
              <p className="tiny muted" style={{ marginTop: 'var(--s-3)' }}>
                <PendingBadge>Pending confirmation</PendingBadge> Audience set and order are proposed from Section 2.2 of the RFP and
                are editable in the CMS. They will be confirmed in requirements refinement.
              </p>
            )}
          </Section>
        </div>
      )}

      <div className="container">
        <Section id="latest" title="Latest from the Observatory">
          <div className="lead-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))' }}>
            <div>
              <h3 className="kicker kicker--plain" style={{ color: 'var(--ink-56)' }}>
                Use cases
              </h3>
              <ItemList>
                {useCases.map((d) => (
                  <li key={String(d.id)}>
                    <Item collection="use-cases" doc={d as never} showNotices={show} compact />
                  </li>
                ))}
              </ItemList>
              <p className="small">
                <Link href="/use-cases">All use cases</Link>
              </p>
            </div>
            <div>
              <h3 className="kicker kicker--plain" style={{ color: 'var(--ink-56)' }}>
                Publications
              </h3>
              <ItemList>
                {publications.map((d) => (
                  <li key={String(d.id)}>
                    <Item collection="publications" doc={d as never} showNotices={show} compact />
                  </li>
                ))}
              </ItemList>
              <p className="small">
                <Link href="/publications">All publications</Link>
              </p>
            </div>
            <div>
              <h3 className="kicker kicker--plain" style={{ color: 'var(--ink-56)' }}>
                Upcoming events
              </h3>
              <ItemList>
                {events.length === 0 && (
                  <li>
                    <p className="small muted">No upcoming events. See past events and recordings.</p>
                  </li>
                )}
                {events.map((e) => (
                  <li key={String(e.id)}>
                    <Item
                      collection="events"
                      doc={e as never}
                      showNotices={show}
                      compact
                      meta={
                        <>
                          <Icon name="calendar" size={14} /> {formatDateRange(e.startDate, e.endDate)} ·{' '}
                          {e.format === 'online' ? 'Online' : e.venue ?? 'Venue to be announced'}
                        </>
                      }
                    />
                  </li>
                ))}
              </ItemList>
              <p className="small">
                <Link href="/events">All events</Link>
              </p>
            </div>
            <div>
              <h3 className="kicker kicker--plain" style={{ color: 'var(--ink-56)' }}>
                Commentary
              </h3>
              <ItemList>
                {posts.map((d) => (
                  <li key={String(d.id)}>
                    <Item collection="posts" doc={d as never} showNotices={show} compact />
                  </li>
                ))}
              </ItemList>
              <p className="small">
                <Link href="/commentary">Blog, op-eds and news</Link>
              </p>
            </div>
          </div>
        </Section>

        <Section id="subscribe">
          <div className="lead-grid">
            <div>
              <h2>Quarterly newsletter</h2>
              <p className="lede" style={{ fontSize: 'var(--step-2)' }}>
                New use cases, mapping studies, data releases, events and opportunities from across the region. Four issues a
                year. <Link href="/newsletter">Read past issues</Link>.
              </p>
            </div>
            <div className="panel">
              <SubscribeForm consentText={settings.newsletterConsentText} source="home" />
            </div>
          </div>
        </Section>
      </div>
    </>
  )
}
