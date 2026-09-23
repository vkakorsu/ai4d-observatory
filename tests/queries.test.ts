import { describe, expect, it } from 'vitest'
import {
  activeFilterCount,
  buildWhere,
  getPage,
  getParamList,
  NO_MATCH_ID,
  withParam,
  type FilterDef,
} from '@/lib/queries'
import { publicationFilters, useCaseFilters } from '@/lib/filters'

/** Filter query builder from URL parameters (PROTOTYPE_SPEC section 10). */

const defs: FilterDef[] = [
  { param: 'country', field: 'countries', kind: 'relationship', label: 'Country', multiple: true },
  { param: 'stage', field: 'stage', kind: 'select', label: 'Stage' },
  { param: 'year', field: 'yearStarted', kind: 'number', label: 'Year' },
  { param: 'featured', field: 'featured', kind: 'boolean', label: 'Featured' },
]

describe('getParamList', () => {
  it('accepts repeated parameters and comma-separated values', () => {
    expect(getParamList({ country: ['lk', 'in'] }, 'country')).toEqual(['lk', 'in'])
    expect(getParamList({ country: 'lk,in, bd' }, 'country')).toEqual(['lk', 'in', 'bd'])
    expect(getParamList({ country: ['lk,in', 'bd'] }, 'country')).toEqual(['lk', 'in', 'bd'])
  })

  it('drops blanks and missing parameters', () => {
    expect(getParamList({ country: ',,' }, 'country')).toEqual([])
    expect(getParamList({}, 'country')).toEqual([])
  })
})

describe('getPage', () => {
  it('defaults to one and rejects nonsense', () => {
    expect(getPage({})).toBe(1)
    expect(getPage({ page: '3' })).toBe(3)
    expect(getPage({ page: '2.7' })).toBe(2)
    expect(getPage({ page: '0' })).toBe(1)
    expect(getPage({ page: '-4' })).toBe(1)
    expect(getPage({ page: 'abc' })).toBe(1)
  })
})

describe('buildWhere', () => {
  it('returns only the published constraint when no filters are set', () => {
    expect(buildWhere({}, defs)).toEqual({ _status: { equals: 'published' } })
  })

  it('resolves relationship slugs to ids through the caller', () => {
    const where = buildWhere({ country: 'sri-lanka,india' }, defs, (field, slugs) => {
      expect(field).toBe('countries')
      expect(slugs).toEqual(['sri-lanka', 'india'])
      return [144, 356]
    })
    expect(where).toEqual({
      and: [{ _status: { equals: 'published' } }, { countries: { in: [144, 356] } }],
    })
  })

  it('yields no results, not all results, for an unknown taxonomy slug', () => {
    const where = buildWhere({ country: 'atlantis' }, defs, () => [])
    expect(where).toEqual({
      and: [{ _status: { equals: 'published' } }, { id: { equals: NO_MATCH_ID } }],
    })
  })

  it('handles select, number and boolean kinds', () => {
    const where = buildWhere({ stage: 'pilot,deployed', year: '2023,x', featured: 'true' }, defs)
    expect(where).toEqual({
      and: [
        { _status: { equals: 'published' } },
        { stage: { in: ['pilot', 'deployed'] } },
        { yearStarted: { in: [2023] } },
        { featured: { equals: true } },
      ],
    })
  })

  it('omits a number filter when no value parses', () => {
    const where = buildWhere({ year: 'soon' }, defs)
    expect(where).toEqual({ _status: { equals: 'published' } })
  })

  it('accepts a custom base clause', () => {
    const where = buildWhere({ stage: 'pilot' }, defs, () => [], {
      affiliation: { equals: 'team' },
    })
    expect(where).toEqual({
      and: [{ affiliation: { equals: 'team' } }, { stage: { in: ['pilot'] } }],
    })
  })

  it('ignores parameters that are not filter definitions', () => {
    expect(buildWhere({ q: 'flood', page: '2', utm_source: 'x' }, defs)).toEqual({
      _status: { equals: 'published' },
    })
  })
})

describe('listing filter definitions', () => {
  it('use every parameter name once per listing', () => {
    for (const list of [useCaseFilters, publicationFilters]) {
      const params = list.map((d) => d.param)
      expect(new Set(params).size).toBe(params.length)
    }
  })

  it('give select filters fixed options', () => {
    for (const d of [...useCaseFilters, ...publicationFilters]) {
      if (d.kind === 'select') expect(d.options?.length ?? 0).toBeGreaterThan(0)
    }
  })

  it('counts active filters', () => {
    expect(activeFilterCount({ country: 'lk', stage: 'pilot', q: 'x' }, useCaseFilters)).toBe(2)
    expect(activeFilterCount({}, useCaseFilters)).toBe(0)
  })
})

describe('withParam', () => {
  it('replaces one parameter and resets the page', () => {
    expect(withParam({ country: 'lk', page: '3' }, 'stage', 'pilot')).toBe(
      '?country=lk&stage=pilot',
    )
  })

  it('removes a parameter when the value is empty', () => {
    expect(withParam({ country: 'lk', stage: 'pilot' }, 'stage', undefined)).toBe('?country=lk')
    expect(withParam({ stage: 'pilot' }, 'stage', undefined)).toBe('')
  })

  it('keeps repeated values and can preserve the page', () => {
    expect(withParam({ country: ['lk', 'in'], page: '2' }, 'sort', 'title', false)).toBe(
      '?country=lk&country=in&page=2&sort=title',
    )
  })
})

describe('publication groups', () => {
  it('expands a group into its publication types as one filter', () => {
    const where = buildWhere({ group: 'briefs' }, publicationFilters)
    expect(where).toEqual({
      and: [
        { _status: { equals: 'published' } },
        { type: { in: ['research-brief', 'policy-brief', 'innovation-brief'] } },
      ],
    })
    expect(activeFilterCount({ group: 'briefs' }, publicationFilters)).toBe(1)
  })

  it('combines a group with a type and with other filters', () => {
    const where = buildWhere({ group: 'reports', type: 'mapping-study' }, publicationFilters) as {
      and: unknown[]
    }
    expect(where.and).toContainEqual({
      type: { in: ['report', 'mapping-study', 'annual-report', 'comparative-analysis'] },
    })
    expect(where.and).toContainEqual({ type: { in: ['mapping-study'] } })
  })

  it('matches nothing for an unknown group rather than everything', () => {
    const where = buildWhere({ group: 'nope' }, publicationFilters) as { and: unknown[] }
    expect(where.and).toContainEqual({ id: { equals: NO_MATCH_ID } })
  })
})
