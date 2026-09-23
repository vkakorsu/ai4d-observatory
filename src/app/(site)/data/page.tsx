import type { Metadata } from 'next'
import Link from '@/components/SmartLink'
import { Breadcrumbs, PageHeader, PendingBadge, Section } from '@/components/ui'
import { RegionMap, type MapRow } from '@/components/data-viz'
import { Icon } from '@/components/Icon'
import { getPayloadClient } from '@/lib/payload'
import { getSettings, indicatorRows } from '@/lib/site'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Data and maps',
  description:
    'Interactive regional maps and country comparisons of responsible AI ecosystem indicators across South and Southeast Asia, each with a text summary, table and CSV export.',
}

export default async function DataPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const wanted = typeof sp.indicator === 'string' ? sp.indicator : undefined
  const payload = await getPayloadClient()
  const [settings, indicators, countries] = await Promise.all([
    getSettings(),
    payload.find({ collection: 'indicators', limit: 100, sort: 'order', depth: 1 }),
    payload.find({ collection: 'countries', limit: 100, sort: 'name', depth: 0 }),
  ])
  const show = Boolean(settings.showPrototypeNotices)
  const featured =
    (wanted && indicators.docs.find((i) => i.slug === wanted)) ||
    indicators.docs.find((i) => i.featured) ||
    indicators.docs[0]
  const data = featured ? await indicatorRows(payload, featured.id) : null
  const byEnabler = new Map<string, typeof indicators.docs>()
  for (const ind of indicators.docs) {
    const key = ind.enabler && typeof ind.enabler === 'object' ? ind.enabler.name : 'Cross-cutting'
    byEnabler.set(key, [...(byEnabler.get(key) ?? []), ind])
  }

  return (
    <div className="container">
      <Breadcrumbs items={[{ label: 'Data and maps' }]} />
      <PageHeader
        kicker="Interactive maps and data"
        title="Data and maps"
        lede="Country-level indicators on the responsible AI ecosystem, drawn from the Observatory’s benchmarking studies and public indices. Choose an indicator to see the regional map, a ranked chart, a table and the values as CSV."
        split
        aside={
          show && (
            <p className="small">
              <PendingBadge>Illustrative values</PendingBadge> The indicators and values here are
              placeholders that show the mechanism. Editors add real benchmarking data as indicator
              values in the CMS and the map, chart and table update without code.
            </p>
          )
        }
      />

      {featured && data && (
        <Section flush>
          <form
            className="indicator-select"
            method="get"
            action="/data#data-map"
            data-autosubmit
            style={{ marginBottom: 'var(--s-4)' }}
          >
            <div className="field">
              <label htmlFor="indicator">Indicator</label>
              <select id="indicator" name="indicator" defaultValue={featured.slug ?? ''}>
                {Array.from(byEnabler.entries()).map(([enabler, list]) => (
                  <optgroup key={enabler} label={enabler}>
                    {list.map((ind) => (
                      <option key={ind.id} value={ind.slug ?? ''}>
                        {ind.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <button className="btn btn--small" type="submit">
              Show
            </button>
          </form>
          <RegionMap
            rows={data.rows as MapRow[]}
            indicator={featured}
            year={data.year}
            id="data-map"
          />
          <p className="small" style={{ marginTop: 'var(--s-3)' }}>
            <Link className="btn" href={`/data/${featured.slug}`}>
              Explore {featured.name} <Icon name="arrow" size={16} />
            </Link>
          </p>
        </Section>
      )}

      <Section title="Indicators by ecosystem enabler" id="indicators">
        {Array.from(byEnabler.entries()).map(([enabler, list]) => (
          <div key={enabler} style={{ marginBottom: 'var(--s-6)' }}>
            <h3 className="kicker kicker--plain" style={{ color: 'var(--ink-56)' }}>
              {enabler}
            </h3>
            <ul className="item-list">
              {list.map((ind) => (
                <li key={ind.id}>
                  <article className="item item--compact">
                    <div className="item__type">
                      <Icon name="data" size={14} /> {ind.unit} · {ind.source}
                    </div>
                    <h4
                      className="item__title"
                      style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
                    >
                      <Link href={`/data/${ind.slug}`}>{ind.name}</Link>
                    </h4>
                    <p className="item__summary">{ind.definition}</p>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Section>

      <Section
        title="Countries"
        id="countries"
        more={{ href: '/directory', label: 'People and organisations' }}
      >
        <div className="hub-counts">
          {countries.docs.map((c) => (
            <Link key={c.id} href={`/countries/${c.slug}`}>
              <span className="mono tiny muted">{c.iso3}</span> {c.name}
            </Link>
          ))}
        </div>
        {show && (
          <p className="tiny muted" style={{ marginTop: 'var(--s-3)' }}>
            <PendingBadge>Pending confirmation</PendingBadge> Country coverage is a seed list for
            South and Southeast Asia. The Client confirms the final list during requirements
            refinement. Adding or removing a country is one record in the CMS.
          </p>
        )}
      </Section>
    </div>
  )
}
