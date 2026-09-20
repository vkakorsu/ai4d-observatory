import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Where } from 'payload'
import { Item, ItemList } from './listing'
import { EventRow } from './EventRow'
import { Breadcrumbs, PageHeader, PendingBadge, Section } from './ui'
import { RegionMap, type MapRow } from './data-viz'
import { getPayloadClient } from '@/lib/payload'
import { countPublished, findTerm, getSettings, indicatorRows, latest } from '@/lib/site'
import { buildMetadata } from '@/lib/seo'
import { CONTENT_TYPES, type ContentTypeKey } from '@/lib/content-types'
import type { Country, Event, Indicator } from '@/payload-types'

/**
 * Hub pages for countries, topics (sectors), enablers and responsible AI dimensions.
 * A hub shows everything tagged with the term, grouped by type, with links into the filtered listings.
 * Country hubs also show the country's indicator values.
 */

export type HubKind = 'countries' | 'topics' | 'enablers' | 'rai-dimensions'

const KIND: Record<HubKind, { kicker: string; field: string; param: string; crumb: string; crumbHref: string }> = {
  countries: { kicker: 'Country', field: 'countries', param: 'country', crumb: 'Data and maps', crumbHref: '/data' },
  topics: { kicker: 'Sector', field: 'topics', param: 'topic', crumb: 'Use cases', crumbHref: '/use-cases' },
  enablers: { kicker: 'Ecosystem enabler', field: 'enablers', param: 'enabler', crumb: 'Data and maps', crumbHref: '/data' },
  'rai-dimensions': { kicker: 'Responsible AI dimension', field: 'raiDimensions', param: 'dimension', crumb: 'Use cases', crumbHref: '/use-cases' },
}

const GROUPS: Array<{ collection: ContentTypeKey; limit: number }> = [
  { collection: 'use-cases', limit: 5 },
  { collection: 'publications', limit: 5 },
  { collection: 'datasets', limit: 4 },
  { collection: 'events', limit: 4 },
  { collection: 'learning-resources', limit: 4 },
  { collection: 'posts', limit: 3 },
  { collection: 'op-eds', limit: 3 },
  { collection: 'news', limit: 3 },
  { collection: 'opportunities', limit: 3 },
  { collection: 'organisations', limit: 6 },
  { collection: 'people', limit: 6 },
]

export async function hubStaticParams(kind: HubKind) {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: kind, limit: 500, depth: 0 })
  return res.docs.map((d) => ({ slug: d.slug ?? '' })).filter((p) => p.slug)
}

export async function hubMetadata(kind: HubKind, slug: string, base: string): Promise<Metadata> {
  const term = await findTerm(await getPayloadClient(), kind, slug)
  if (!term) return {}
  return buildMetadata({
    title: `${term.name}. ${KIND[kind].kicker}`,
    description: term.description ?? `Everything on the Asia AI4D Observatory about ${term.name}.`,
    path: `${base}/${slug}`,
  })
}

export async function HubPage({ kind, slug }: { kind: HubKind; slug: string }) {
  const payload = await getPayloadClient()
  const [term, settings] = await Promise.all([findTerm(payload, kind, slug), getSettings()])
  if (!term) notFound()
  const show = Boolean(settings.showPrototypeNotices)
  const meta = KIND[kind]
  const where: Where = { [meta.field]: { equals: term.id } }
  // People carry `expertise` rather than `topics`, and organisations and people have no dimensions.
  const whereFor = (collection: ContentTypeKey): Where | null => {
    if (kind === 'topics' && collection === 'people') return { expertise: { equals: term.id } }
    if (kind === 'rai-dimensions' && !CONTENT_TYPES[collection].taxonomies.includes('raiDimensions')) return null
    if (kind === 'topics' && collection === 'people') return { expertise: { equals: term.id } }
    if (!CONTENT_TYPES[collection].taxonomies.includes(kind === 'rai-dimensions' ? 'raiDimensions' : kind)) return null
    return where
  }
  const applicable = GROUPS.filter((g) => whereFor(g.collection) !== null)
  const counts = Object.fromEntries(
    await Promise.all(
      applicable.map(async (g) => [g.collection, (await countPublished(payload, [g.collection], whereFor(g.collection)!))[g.collection]] as const),
    ),
  ) as Record<ContentTypeKey, number>
  const groups = await Promise.all(
    applicable
      .filter((g) => counts[g.collection] > 0)
      .map(async (g) => ({
        ...g,
        docs: await latest(payload, g.collection, g.limit, whereFor(g.collection)!, g.collection === 'events' ? '-startDate' : g.collection === 'people' || g.collection === 'organisations' ? 'name' : '-publishedAt'),
      })),
  )
  const total = Object.values(counts).reduce((a, b) => a + b, 0)

  // Country hubs. Indicator values for this country, latest year each.
  let countryData: Array<{ name: string; slug: string; unit: string; value: string; year: number; rank: string }> = []
  let mapRows: MapRow[] | null = null
  let mapIndicator: Indicator | null = null
  if (kind === 'countries') {
    const c = term as Country
    const indicators = await payload.find({ collection: 'indicators', limit: 50, sort: 'order', depth: 0 })
    const rowsPer = await Promise.all(indicators.docs.map((ind) => indicatorRows(payload, ind.id)))
    countryData = indicators.docs
      .map((ind, i) => {
        const data = rowsPer[i]
        const row = data.rows.find((r) => r.iso3 === c.iso3)
        if (!row || row.value === null) return null
        const ranked = data.rows.filter((r) => r.value !== null).sort((a, b) => ((ind.higherIsBetter ?? true) ? (b.value ?? 0) - (a.value ?? 0) : (a.value ?? 0) - (b.value ?? 0)))
        const rank = ranked.findIndex((r) => r.iso3 === c.iso3) + 1
        const label = ind.valueType === 'status' ? ind.statusLabels?.find((s) => s.code === row.value)?.label ?? String(row.value) : String(row.value)
        return { name: ind.name, slug: ind.slug ?? '', unit: ind.unit, value: label, year: data.year ?? 0, rank: `${rank} of ${ranked.length}` }
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
    const featured = indicators.docs.find((i) => i.featured) ?? indicators.docs[0]
    if (featured) {
      mapIndicator = featured
      mapRows = rowsPer[indicators.docs.indexOf(featured)].rows as MapRow[]
    }
  }

  return (
    <div className="container">
      <Breadcrumbs items={[{ href: meta.crumbHref, label: meta.crumb }, { label: term.name }]} />
      <PageHeader
        kicker={meta.kicker}
        title={term.name}
        lede={term.description ?? undefined}
        split
        aside={
          <div className="hub-counts">
            {applicable
              .filter((g) => counts[g.collection] > 0)
              .map((g) => (
                <Link key={g.collection} href={`${CONTENT_TYPES[g.collection].listing}${CONTENT_TYPES[g.collection].listing.includes('?') ? '&' : '?'}${meta.param}=${slug}`}>
                  <span className="n">{counts[g.collection]}</span> {CONTENT_TYPES[g.collection].plural}
                </Link>
              ))}
          </div>
        }
      />
      {show && kind !== 'countries' && (
        <p className="small">
          <PendingBadge>Pending confirmation</PendingBadge> This taxonomy is seeded from the Observatory’s public description and will be
          confirmed with the Client. Terms are editable in the CMS.
        </p>
      )}

      {kind === 'countries' && (
        <Section title="Indicators" id="indicators" more={{ href: '/data', label: 'All data and maps' }}>
          {countryData.length === 0 ? (
            <p className="muted">No indicator values recorded for {term.name} yet.</p>
          ) : (
            <div className="lead-grid">
              <div className="table-wrap">
                <table>
                  <caption className="visually-hidden">Indicator values for {term.name}</caption>
                  <thead>
                    <tr>
                      <th scope="col">Indicator</th>
                      <th scope="col" className="num">
                        Value
                      </th>
                      <th scope="col">Unit</th>
                      <th scope="col">Year</th>
                      <th scope="col">Rank in region</th>
                    </tr>
                  </thead>
                  <tbody>
                    {countryData.map((d) => (
                      <tr key={d.slug}>
                        <th scope="row">
                          <Link href={`/data/${d.slug}`}>{d.name}</Link>
                        </th>
                        <td className="num">{d.value}</td>
                        <td className="tiny muted">{d.unit}</td>
                        <td className="mono">{d.year}</td>
                        <td className="mono">{d.rank}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {mapIndicator && mapRows && <RegionMap rows={mapRows} indicator={mapIndicator} year={countryData[0]?.year ?? ''} compact id="hub-map" />}
            </div>
          )}
        </Section>
      )}

      {total === 0 && (
        <div className="empty" style={{ marginTop: 'var(--s-6)' }}>
          <h2>Nothing tagged yet</h2>
          <p>No published content carries this term. Editors tag content from the sidebar of any item in the CMS.</p>
        </div>
      )}

      {groups.map((g) => (
        <Section
          key={g.collection}
          id={g.collection}
          title={CONTENT_TYPES[g.collection].plural}
          more={
            counts[g.collection] > g.limit
              ? { href: `${CONTENT_TYPES[g.collection].listing}${CONTENT_TYPES[g.collection].listing.includes('?') ? '&' : '?'}${meta.param}=${slug}`, label: `All ${counts[g.collection]}` }
              : undefined
          }
        >
          {g.collection === 'events' ? (
            g.docs.map((e) => {
              const ev = e as unknown as Event
              return <EventRow key={String(ev.id)} e={ev} show={show} />
            })
          ) : g.collection === 'people' || g.collection === 'organisations' ? (
            <ul className="related-list">
              {g.docs.map((d) => {
                const doc = d as { id: string; name: string; slug: string; role?: string; summary?: string }
                return (
                  <li key={doc.id}>
                    <Link href={`/${g.collection}/${doc.slug}`}>{doc.name}</Link>
                    <span className="tiny muted">{doc.role ?? doc.summary}</span>
                  </li>
                )
              })}
            </ul>
          ) : (
            <ItemList>
              {g.docs.map((d) => (
                <li key={String((d as { id: string }).id)}>
                  <Item collection={g.collection} doc={d as never} showNotices={show} compact />
                </li>
              ))}
            </ItemList>
          )}
        </Section>
      ))}
    </div>
  )
}
