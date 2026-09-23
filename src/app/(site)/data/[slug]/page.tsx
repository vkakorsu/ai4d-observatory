import type { Metadata } from 'next'
import Link from '@/components/SmartLink'
import { notFound } from 'next/navigation'
import { Breadcrumbs, JsonLd, MetaList, PageHeader, PendingBadge, Section } from '@/components/ui'
import { BarChart, DataTable, RegionMap, type MapRow } from '@/components/data-viz'
import { findBySlug, getPayloadClient } from '@/lib/payload'
import { getSettings, indicatorRows } from '@/lib/site'
import { buildMetadata, jsonLd } from '@/lib/seo'
import { absoluteUrl } from '@/lib/format'
import type { Indicator } from '@/payload-types'
import type { SearchParams } from '@/lib/queries'
import { getParam } from '@/lib/queries'

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<SearchParams> }

export const revalidate = 60

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'indicators', limit: 200, depth: 0 })
  return res.docs.map((d) => ({ slug: d.slug ?? '' })).filter((p) => p.slug)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const doc = await findBySlug<Indicator>(await getPayloadClient(), 'indicators', slug, 0)
  if (!doc) return {}
  return buildMetadata({
    title: `${doc.name}. Regional map and data`,
    description: doc.definition,
    path: `/data/${slug}`,
  })
}

export default async function IndicatorPage({ params, searchParams }: Props) {
  const { slug } = await params
  const sp = await searchParams
  const payload = await getPayloadClient()
  const [doc, settings] = await Promise.all([
    findBySlug<Indicator>(payload, 'indicators', slug, 1),
    getSettings(),
  ])
  if (!doc) notFound()
  const show = Boolean(settings.showPrototypeNotices)
  const requested = Number(getParam(sp, 'year'))
  const data = await indicatorRows(
    payload,
    doc.id,
    Number.isFinite(requested) && requested > 0 ? requested : undefined,
  )
  const rows = data.rows as MapRow[]
  const path = `/data/${slug}`
  const csv = `${path}/csv${data.year ? `?year=${data.year}` : ''}`
  const enabler = doc.enabler && typeof doc.enabler === 'object' ? doc.enabler : null
  const dataset = doc.dataset && typeof doc.dataset === 'object' ? doc.dataset : null

  return (
    <div className="container">
      <Breadcrumbs items={[{ href: '/data', label: 'Data and maps' }, { label: doc.name }]} />
      <PageHeader
        kicker={enabler ? `Indicator · ${enabler.name}` : 'Indicator'}
        title={doc.name}
        lede={doc.definition}
        split
        aside={
          <form className="indicator-select" method="get" action={path} data-autosubmit>
            <div className="field">
              <label htmlFor="year">Year</label>
              <select id="year" name="year" defaultValue={String(data.year ?? '')}>
                {data.years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn btn--small" type="submit">
              Show
            </button>
          </form>
        }
      />
      <JsonLd
        data={jsonLd.dataset({
          title: doc.name,
          description: doc.definition,
          url: absoluteUrl(path),
          creator: doc.source,
        })}
      />
      {show && doc.provenance === 'sample' && (
        <p className="small">
          <PendingBadge>Illustrative values</PendingBadge> Values shown are placeholders so the map,
          chart and table can be reviewed.
        </p>
      )}

      {data.rows.every((r) => r.value === null) ? (
        <div className="empty">
          <h2>No values yet</h2>
          <p>
            This indicator has no values for the selected year. Editors add values as indicator
            value records in the CMS.
          </p>
        </div>
      ) : (
        <>
          <Section flush>
            <RegionMap rows={rows} indicator={doc} year={data.year} id="ind-map" />
          </Section>
          <Section title="Ranked" id="ranked">
            <div className="lead-grid">
              <BarChart rows={rows} indicator={doc} />
              <MetaList
                items={[
                  { label: 'Unit', value: doc.unit },
                  {
                    label: 'Direction',
                    value: doc.higherIsBetter === false ? 'Lower is better' : 'Higher is better',
                  },
                  typeof doc.min === 'number' &&
                    typeof doc.max === 'number' && {
                      label: 'Range',
                      value: `${doc.min} to ${doc.max}`,
                    },
                  {
                    label: 'Source',
                    value: doc.sourceUrl ? <a href={doc.sourceUrl}>{doc.source}</a> : doc.source,
                  },
                  dataset && {
                    label: 'Dataset',
                    value: <Link href={`/datasets/${dataset.slug}`}>{dataset.title}</Link>,
                  },
                  doc.methodology && {
                    label: 'Methodology',
                    value: <span className="small">{doc.methodology}</span>,
                  },
                  { label: 'Years available', value: data.years.join(', ') },
                ]}
              />
            </div>
          </Section>
          <Section title="Table" id="table">
            <DataTable rows={rows} indicator={doc} series={data.series} csvHref={csv} />
          </Section>
        </>
      )}
    </div>
  )
}
