/**
 * Small statistics and scale helpers for accessible data views (Section 3.1.4 e).
 * Every visualisation is accompanied by a text summary produced here, and a table.
 */

export type ValueRow = {
  country: string
  iso3: string
  isoNumeric: string
  value: number | null
  note?: string | null
}

/** Sequential ramp, teal-green, six steps, light to dark. Kept distinct from the vermilion accent. */
export const RAMP = ['#e6efe9', '#c3d9cc', '#95bda9', '#659c84', '#3f7a63', '#25553f'] as const

export const NO_DATA = '#f1efe9'

export const quantileBreaks = (values: number[], steps: number = RAMP.length): number[] => {
  const sorted = [...values].filter((v) => Number.isFinite(v)).sort((a, b) => a - b)
  if (sorted.length === 0) return []
  const breaks: number[] = []
  for (let i = 1; i < steps; i++) {
    const idx = Math.min(sorted.length - 1, Math.floor((i / steps) * sorted.length))
    breaks.push(sorted[idx])
  }
  return breaks
}

/** Equal-interval breaks when the indicator has a defined min and max, otherwise quantiles. */
export const makeScale = (values: number[], min?: number | null, max?: number | null) => {
  const finite = values.filter((v) => Number.isFinite(v))
  const useInterval = typeof min === 'number' && typeof max === 'number' && max > min
  const breaks = useInterval
    ? Array.from({ length: RAMP.length - 1 }, (_, i) => min + ((i + 1) * (max - min)) / RAMP.length)
    : quantileBreaks(finite)
  const colour = (v: number | null | undefined): string => {
    if (v === null || v === undefined || !Number.isFinite(v)) return NO_DATA
    let i = 0
    while (i < breaks.length && v >= breaks[i]) i++
    return RAMP[Math.min(i, RAMP.length - 1)]
  }
  const legend = RAMP.map((c, i) => {
    const lo = i === 0 ? (useInterval ? min : Math.min(...finite)) : breaks[i - 1]
    const hi = i === RAMP.length - 1 ? (useInterval ? max : Math.max(...finite)) : breaks[i]
    return { colour: c, from: lo, to: hi }
  })
  return { colour, legend, breaks }
}

export const formatValue = (v: number | null | undefined, unit: string, valueType?: string): string => {
  if (v === null || v === undefined || !Number.isFinite(v)) return 'No data'
  if (valueType === 'percent') return `${round(v)}%`
  return unit.toLowerCase().startsWith('count') ? String(Math.round(v)) : String(round(v))
}

const round = (v: number) => Math.round(v * 10) / 10

/** Plain-language summary read by everyone and especially by screen reader users. */
export const summarise = (
  rows: ValueRow[],
  indicatorName: string,
  year: number | string,
  unit: string,
  higherIsBetter = true,
): string => {
  const withData = rows.filter((r) => r.value !== null && Number.isFinite(r.value as number)) as Array<
    ValueRow & { value: number }
  >
  if (withData.length === 0) return `No values are recorded for ${indicatorName} in ${year}.`
  const sorted = [...withData].sort((a, b) => b.value - a.value)
  const top = sorted[0]
  const bottom = sorted[sorted.length - 1]
  const mid = sorted[Math.floor(sorted.length / 2)]
  const missing = rows.length - withData.length
  const best = higherIsBetter ? top : bottom
  const worst = higherIsBetter ? bottom : top
  const parts = [
    `${indicatorName}, ${year}. ${withData.length} of ${rows.length} countries have data.`,
    `Highest value ${top.country} at ${round(top.value)} ${unit}. Lowest ${bottom.country} at ${round(bottom.value)} ${unit}.`,
    `Median country ${mid.country} at ${round(mid.value)} ${unit}.`,
  ]
  if (best.iso3 !== top.iso3 || !higherIsBetter)
    parts.push(`Lower values are better for this indicator, so ${best.country} leads and ${worst.country} trails.`)
  if (missing > 0) parts.push(`${missing} ${missing === 1 ? 'country has' : 'countries have'} no data for this year.`)
  return parts.join(' ')
}

export const toCsv = (rows: Array<Record<string, string | number | null | undefined>>): string => {
  if (rows.length === 0) return ''
  const headers = Object.keys(rows[0])
  const esc = (v: string | number | null | undefined) => {
    const s = v === null || v === undefined ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  return [headers.join(','), ...rows.map((r) => headers.map((h) => esc(r[h])).join(','))].join('\n')
}
