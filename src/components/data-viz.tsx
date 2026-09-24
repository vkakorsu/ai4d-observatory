import Link from '@/components/SmartLink'
import { MapTooltip } from './MapTooltip'
import { buildRegionMap } from '@/lib/geo'
import { formatValue, makeScale, summarise, summariseStatus, type ValueRow } from '@/lib/stats'

/*
 * Accessible data views (Section 3.1.4 e). Each visualisation is server-rendered SVG with
 * a text summary, a legend, and a table of the same numbers. Nothing here needs client JavaScript.
 */

export type MapRow = ValueRow & { slug: string; smallState: boolean; subregion: string }

type Indicator = {
  name: string
  unit: string
  valueType?: string | null
  min?: number | null
  max?: number | null
  higherIsBetter?: boolean | null
  statusLabels?: Array<{ code: number; label: string }> | null
}

const statusLabel = (ind: Indicator, v: number | null) => {
  if (v === null) return 'No data'
  return ind.statusLabels?.find((s) => s.code === v)?.label ?? String(v)
}

const display = (ind: Indicator, v: number | null) =>
  ind.valueType === 'status'
    ? statusLabel(ind, v)
    : formatValue(v, ind.unit, ind.valueType ?? undefined)

export function RegionMap({
  rows,
  indicator,
  year,
  linkBase = '/countries',
  compact = false,
  id = 'map',
}: {
  rows: MapRow[]
  indicator: Indicator
  year: number | string
  linkBase?: string
  compact?: boolean
  id?: string
}) {
  const geo = buildRegionMap(
    rows.map((r) => r.isoNumeric),
    compact ? 720 : 960,
    compact ? 440 : 560,
  )
  const values = rows.map((r) => r.value).filter((v): v is number => v !== null)
  const scale = makeScale(values, indicator.min, indicator.max)
  const byIso = new Map(rows.map((r) => [r.isoNumeric, r]))
  const isStatus = indicator.valueType === 'status'
  const summary = isStatus
    ? summariseStatus(rows, indicator.name, year, indicator.statusLabels ?? [])
    : summarise(rows, indicator.name, year, indicator.unit, indicator.higherIsBetter ?? true)

  return (
    <figure className="map-figure" aria-labelledby={`${id}-cap`} aria-describedby={`${id}-sum`}>
      {/* role="group", not "img": the countries are links, and an img role would hide them from assistive technology. */}
      <svg viewBox={`0 0 ${geo.width} ${geo.height}`} role="group" aria-labelledby={`${id}-title`}>
        <title
          id={`${id}-title`}
        >{`Map of South and Southeast Asia shaded by ${indicator.name}, ${year}. Each country is a link to its hub.`}</title>
        <g>
          {geo.context.map((c, i) => (
            // Natural Earth assigns the same numeric id to some disputed or minor territories, so the index disambiguates.
            <path key={`ctx-${c.isoNumeric}-${i}`} className="context" d={c.d} />
          ))}
        </g>
        <g>
          {geo.covered.map((c) => {
            const r = byIso.get(c.isoNumeric)
            const v = r?.value ?? null
            const fill = scale.colour(v)
            const label = r ? `${r.country}. ${display(indicator, v)}` : c.isoNumeric
            return (
              <Link
                key={c.isoNumeric}
                href={`${linkBase}/${r?.slug ?? ''}`}
                className="country-link"
                aria-label={label}
              >
                <title>{label}</title>
                <path className="country" d={c.d} fill={fill} />
                {r?.smallState && (
                  <circle
                    className="marker"
                    cx={c.centroid[0]}
                    cy={c.centroid[1]}
                    r={6}
                    fill={fill}
                  />
                )}
              </Link>
            )
          })}
        </g>
        {!compact && (
          <g aria-hidden="true">
            {geo.covered.map((c) => {
              const r = byIso.get(c.isoNumeric)
              if (!r) return null
              const dx = r.smallState ? 10 : 0
              return (
                <text
                  key={`t-${c.isoNumeric}`}
                  x={c.centroid[0] + dx}
                  y={c.centroid[1] + 4}
                  className="label-halo"
                  textAnchor={r.smallState ? 'start' : 'middle'}
                >
                  {r.iso3}
                </text>
              )
            })}
          </g>
        )}
      </svg>
      <MapTooltip />
      <figcaption id={`${id}-cap`} className="tiny muted" style={{ marginTop: 'var(--s-3)' }}>
        {indicator.name}, {year}. {isStatus ? 'Categorical status.' : `Unit: ${indicator.unit}.`}{' '}
        Boundaries from Natural Earth, for orientation only; they do not imply any position on
        disputed territory.
      </figcaption>
      <div className="legend" aria-hidden={isStatus ? undefined : 'true'}>
        {isStatus
          ? (indicator.statusLabels ?? []).map((s) => (
              <span className="legend__item" key={s.code}>
                <span className="legend__swatch" style={{ background: scale.colour(s.code) }} />{' '}
                {s.label}
              </span>
            ))
          : scale.legend.map((l, i) => (
              <span className="legend__item" key={i}>
                <span className="legend__swatch" style={{ background: l.colour }} />
                {formatValue(l.from, indicator.unit, indicator.valueType ?? undefined)} to{' '}
                {formatValue(l.to, indicator.unit, indicator.valueType ?? undefined)}
              </span>
            ))}
        <span className="legend__item">
          <span className="legend__swatch legend__swatch--none" /> No data
        </span>
      </div>
      <p
        id={`${id}-sum`}
        className="map-summary"
        style={{ marginTop: 'var(--s-3)', marginBottom: 0 }}
      >
        {summary}
      </p>
    </figure>
  )
}

/** Horizontal bar chart, sorted, labelled directly, zero-based for counts and percentages. */
export function BarChart({
  rows,
  indicator,
  id = 'bars',
}: {
  rows: MapRow[]
  indicator: Indicator
  id?: string
}) {
  const data = rows
    .filter((r): r is MapRow & { value: number } => r.value !== null)
    .sort((a, b) => ((indicator.higherIsBetter ?? true) ? b.value - a.value : a.value - b.value))
  if (!data.length) return null
  const rowH = 22
  const labelW = 120
  const width = 640
  const height = data.length * rowH + 8
  const max =
    typeof indicator.max === 'number' ? indicator.max : Math.max(...data.map((d) => d.value))
  const min =
    indicator.valueType === 'status' || (typeof indicator.min === 'number' && indicator.min < 0)
      ? (indicator.min ?? 0)
      : 0
  const span = max - min || 1
  const x = (v: number) => labelW + ((v - min) / span) * (width - labelW - 60)
  return (
    <figure className="bar-chart" aria-labelledby={`${id}-t`}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${id}-t`}>
        <title
          id={`${id}-t`}
        >{`${indicator.name} by country, sorted ${indicator.higherIsBetter === false ? 'lowest' : 'highest'} first`}</title>
        <line className="axis" x1={labelW} x2={labelW} y1={0} y2={height} />
        {data.map((d, i) => (
          <g key={d.iso3} transform={`translate(0, ${i * rowH + 4})`}>
            <text x={labelW - 8} y={13} textAnchor="end">
              {d.country}
            </text>
            <rect
              x={labelW}
              y={3}
              width={Math.max(1, x(d.value) - labelW)}
              height={rowH - 8}
              fill="var(--data-5)"
            />
            <text className="val" x={x(d.value) + 6} y={13}>
              {display(indicator, d.value)}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  )
}

export function DataTable({
  rows,
  indicator,
  series,
  csvHref,
  linkBase = '/countries',
}: {
  rows: MapRow[]
  indicator: Indicator
  series?: Map<string, Array<{ year: number; value: number }>>
  csvHref?: string
  linkBase?: string
}) {
  const sorted = [...rows].sort((a, b) => {
    if (a.value === null && b.value === null) return a.country.localeCompare(b.country)
    if (a.value === null) return 1
    if (b.value === null) return -1
    return (indicator.higherIsBetter ?? true) ? b.value - a.value : a.value - b.value
  })
  const values = rows.map((r) => r.value).filter((v): v is number => v !== null)
  const max = typeof indicator.max === 'number' ? indicator.max : Math.max(...values, 1)
  return (
    <div>
      <div className="table-wrap" tabIndex={0} role="region" aria-label={`${indicator.name} table`}>
        <table>
          <caption className="visually-hidden">{`${indicator.name} by country. Unit ${indicator.unit}.`}</caption>
          <thead>
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">Country</th>
              <th scope="col">Sub-region</th>
              <th scope="col" className="num">
                Value
              </th>
              {indicator.valueType !== 'status' && <th scope="col">Bar</th>}
              {series && <th scope="col">Trend</th>}
              <th scope="col">Note</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => (
              <tr key={r.iso3}>
                <td className="num">{r.value === null ? '' : i + 1}</td>
                <th scope="row">
                  <Link href={`${linkBase}/${r.slug}`}>{r.country}</Link>
                </th>
                <td>{r.subregion === 'south-asia' ? 'South Asia' : 'Southeast Asia'}</td>
                <td className="num">{display(indicator, r.value)}</td>
                {indicator.valueType !== 'status' && (
                  <td aria-hidden="true">
                    {r.value !== null && (
                      <span
                        className="bar"
                        style={{
                          width: `${Math.max(2, (r.value / max) * 100)}%`,
                          maxWidth: '100%',
                        }}
                      />
                    )}
                  </td>
                )}
                {series && (
                  <td>
                    <Sparkline
                      points={series.get(r.iso3) ?? []}
                      min={indicator.min}
                      max={indicator.max}
                    />
                  </td>
                )}
                <td className="tiny muted">{r.note ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {csvHref && (
        <p className="tiny" style={{ marginTop: 'var(--s-3)' }}>
          <a href={csvHref}>Download these values as CSV</a>
        </p>
      )}
    </div>
  )
}

function Sparkline({
  points,
  min,
  max,
}: {
  points: Array<{ year: number; value: number }>
  min?: number | null
  max?: number | null
}) {
  if (points.length < 2)
    return <span className="tiny muted">{points.length === 1 ? 'one year' : ''}</span>
  const w = 80
  const h = 20
  const lo = typeof min === 'number' ? min : Math.min(...points.map((p) => p.value))
  const hi = typeof max === 'number' ? max : Math.max(...points.map((p) => p.value))
  const span = hi - lo || 1
  const xs = points.map((_, i) => (i / (points.length - 1)) * (w - 4) + 2)
  const ys = points.map((p) => h - 2 - ((p.value - lo) / span) * (h - 4))
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ')
  const first = points[0]
  const last = points[points.length - 1]
  const label = `${first.year} ${first.value} to ${last.year} ${last.value}`
  return (
    <svg
      className="sparkline"
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={label}
    >
      <path d={d} fill="none" stroke="var(--data-5)" strokeWidth={1.5} />
      <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r={2} fill="var(--accent)" />
    </svg>
  )
}
