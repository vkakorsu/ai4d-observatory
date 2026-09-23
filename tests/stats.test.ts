import { describe, expect, it } from 'vitest'
import {
  formatValue,
  makeScale,
  NO_DATA,
  quantileBreaks,
  RAMP,
  summarise,
  summariseStatus,
  toCsv,
  type ValueRow,
} from '@/lib/stats'

/** Indicator statistics and the choropleth scale. */

const rows: ValueRow[] = [
  { country: 'Sri Lanka', iso3: 'LKA', isoNumeric: '144', value: 66.7 },
  { country: 'India', iso3: 'IND', isoNumeric: '356', value: 52.4 },
  { country: 'Bangladesh', iso3: 'BGD', isoNumeric: '050', value: 38.9 },
  { country: 'Nepal', iso3: 'NPL', isoNumeric: '524', value: 51.6 },
  { country: 'Bhutan', iso3: 'BTN', isoNumeric: '064', value: null },
]

describe('quantileBreaks', () => {
  it('returns steps minus one ascending breaks', () => {
    const breaks = quantileBreaks([5, 1, 9, 3, 7, 2, 8, 4, 6, 10])
    expect(breaks).toHaveLength(RAMP.length - 1)
    expect([...breaks].sort((a, b) => a - b)).toEqual(breaks)
  })

  it('ignores non-finite values and copes with empty input', () => {
    expect(quantileBreaks([])).toEqual([])
    expect(quantileBreaks([NaN, Infinity])).toEqual([])
    expect(quantileBreaks([1, NaN, 2], 2)).toEqual([2])
  })
})

describe('makeScale', () => {
  it('uses equal intervals when the indicator declares a range', () => {
    const scale = makeScale([10, 20, 90], 0, 100)
    expect(scale.breaks.map((b) => Math.round(b * 1000) / 1000)).toEqual([
      16.667, 33.333, 50, 66.667, 83.333,
    ])
    expect(scale.legend[0].from).toBe(0)
    expect(scale.legend[RAMP.length - 1].to).toBe(100)
  })

  it('maps the low end to the lightest and the high end to the darkest colour', () => {
    const scale = makeScale([], 0, 100)
    expect(scale.colour(0)).toBe(RAMP[0])
    expect(scale.colour(1)).toBe(RAMP[0])
    expect(scale.colour(50)).toBe(RAMP[3])
    expect(scale.colour(100)).toBe(RAMP[RAMP.length - 1])
    expect(scale.colour(1000)).toBe(RAMP[RAMP.length - 1])
  })

  it('falls back to quantiles when no range or a degenerate range is given', () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const quantile = makeScale(values)
    expect(quantile.breaks).toEqual(quantileBreaks(values))
    expect(quantile.legend[0].from).toBe(1)
    expect(quantile.legend[RAMP.length - 1].to).toBe(12)
    expect(makeScale(values, 5, 5).breaks).toEqual(quantileBreaks(values))
    expect(makeScale(values, null, 100).breaks).toEqual(quantileBreaks(values))
  })

  it('assigns the no-data colour to missing values', () => {
    const scale = makeScale([1, 2, 3], 0, 10)
    expect(scale.colour(null)).toBe(NO_DATA)
    expect(scale.colour(undefined)).toBe(NO_DATA)
    expect(scale.colour(NaN)).toBe(NO_DATA)
  })

  it('is monotonic: larger values never get a lighter colour', () => {
    const scale = makeScale([3, 8, 15, 22, 40, 41, 57, 63, 72, 88, 95])
    const idx = (v: number) => RAMP.indexOf(scale.colour(v) as (typeof RAMP)[number])
    let last = -1
    for (let v = 0; v <= 100; v += 1) {
      const i = idx(v)
      expect(i).toBeGreaterThanOrEqual(last)
      last = i
    }
  })
})

describe('formatValue', () => {
  it('formats percentages, counts and plain numbers', () => {
    expect(formatValue(66.66, '%', 'percent')).toBe('66.7%')
    expect(formatValue(1234.6, 'Count of frameworks')).toBe('1235')
    expect(formatValue(3.14159, 'Index 0-100')).toBe('3.1')
  })

  it('says "No data" for missing values', () => {
    expect(formatValue(null, '%')).toBe('No data')
    expect(formatValue(undefined, '%')).toBe('No data')
    expect(formatValue(NaN, '%')).toBe('No data')
  })
})

describe('summarise', () => {
  it('names coverage, extremes and the median', () => {
    const text = summarise(rows, 'Internet penetration', 2024, 'percent')
    expect(text).toContain('Internet penetration, 2024. 4 of 5 countries have data.')
    expect(text).toContain('Highest value Sri Lanka at 66.7 percent.')
    expect(text).toContain('Lowest Bangladesh at 38.9 percent.')
    expect(text).toContain('Median country Nepal at 51.6 percent.')
    expect(text).toContain('1 country has no data for this year.')
    expect(text).not.toContain('Lower values are better')
  })

  it('explains direction when lower is better', () => {
    const text = summarise(rows, 'Gender gap', 2024, 'points', false)
    expect(text).toContain(
      'Lower values are better for this indicator, so Bangladesh leads and Sri Lanka trails.',
    )
  })

  it('pluralises missing countries and handles no data at all', () => {
    const text = summarise(
      [...rows, { country: 'Maldives', iso3: 'MDV', isoNumeric: '462', value: null }],
      'X',
      2024,
      'u',
    )
    expect(text).toContain('2 countries have no data for this year.')
    expect(
      summarise(
        rows.map((r) => ({ ...r, value: null })),
        'X',
        2024,
        'u',
      ),
    ).toBe('No values are recorded for X in 2024.')
  })
})

describe('summarise units', () => {
  it('drops score and count units from the sentence, since the caption states them', () => {
    const text = summarise(rows, 'Compute access index', 2025, 'score 0 to 100')
    expect(text).toContain('Highest value Sri Lanka at 66.7.')
    expect(text).not.toContain('score 0 to 100')
  })
})

describe('summariseStatus', () => {
  const labels = [
    { code: 0, label: 'None' },
    { code: 1, label: 'In development' },
    { code: 2, label: 'Adopted' },
  ]
  const status: ValueRow[] = [
    { country: 'India', iso3: 'IND', isoNumeric: '356', value: 2 },
    { country: 'Sri Lanka', iso3: 'LKA', isoNumeric: '144', value: 2 },
    { country: 'Nepal', iso3: 'NPL', isoNumeric: '524', value: 1 },
    { country: 'Bhutan', iso3: 'BTN', isoNumeric: '064', value: null },
  ]
  it('counts countries per status, highest first, and never prints a raw code', () => {
    const text = summariseStatus(status, 'AI strategy status', 2026, labels)
    expect(text).toContain('3 of 4 countries have data.')
    expect(text).toContain('Adopted: 2 countries (India and Sri Lanka).')
    expect(text).toContain('In development: 1 country (Nepal).')
    expect(text.indexOf('Adopted')).toBeLessThan(text.indexOf('In development'))
    expect(text).toContain('1 country has no data for this year.')
    expect(text).not.toMatch(/at \d+ status/)
  })
})

describe('toCsv', () => {
  it('writes a header row and escapes commas, quotes and newlines', () => {
    const csv = toCsv([
      { country: 'Sri Lanka', value: 66.7, note: null },
      { country: 'Korea, Republic of', value: 1, note: 'He said "hi"\nthen left' },
    ])
    expect(csv.split('\n')[0]).toBe('country,value,note')
    expect(csv).toContain('Sri Lanka,66.7,')
    expect(csv).toContain('"Korea, Republic of",1,"He said ""hi""\nthen left"')
  })

  it('returns an empty string for no rows', () => {
    expect(toCsv([])).toBe('')
  })
})
