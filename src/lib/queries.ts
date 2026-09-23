import type { Where } from 'payload'

/**
 * Filter definitions map URL parameters to database conditions (Section 3.1.4 b).
 * Filtered views live in the URL so they can be shared, bookmarked and indexed.
 */

export type FilterKind = 'relationship' | 'select' | 'number' | 'boolean' | 'text'

export type FilterDef = {
  /** URL parameter name. */
  param: string
  /** Field path in the collection. */
  field: string
  kind: FilterKind
  label: string
  /** Relationship filters compare against related document slugs, resolved by the caller. */
  multiple?: boolean
  /** Fixed options for select filters. Relationship filters load options from the taxonomy. */
  options?: Array<{ value: string; label: string }>
  /**
   * For select filters that stand for several field values, for example a "Reports" group covering four
   * publication types. Each option value expands to the listed field values.
   */
  expand?: Record<string, string[]>
}

export type SearchParams = Record<string, string | string[] | undefined>

export const PAGE_SIZE = 12

/** Sentinel id that no document has. Used to make a relationship filter with unknown slugs match nothing. */
export const NO_MATCH_ID = -1

export const getParam = (sp: SearchParams, key: string): string | undefined => {
  const v = sp[key]
  if (Array.isArray(v)) return v[0]
  return v
}

export const getParamList = (sp: SearchParams, key: string): string[] => {
  const v = sp[key]
  if (!v) return []
  const arr = Array.isArray(v) ? v : [v]
  return arr
    .flatMap((x) => x.split(','))
    .map((x) => x.trim())
    .filter(Boolean)
}

export const getPage = (sp: SearchParams): number => {
  const n = Number(getParam(sp, 'page') ?? '1')
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1
}

/**
 * Build a Payload `where` clause from URL parameters.
 * `resolveIds` turns taxonomy slugs into document ids for relationship filters (caller looks them up).
 */
export const buildWhere = (
  sp: SearchParams,
  defs: FilterDef[],
  resolveIds: (field: string, slugs: string[]) => Array<string | number> = () => [],
  base: Where = { _status: { equals: 'published' } },
): Where => {
  const and: Where[] = [base]
  for (const def of defs) {
    const values = getParamList(sp, def.param)
    if (values.length === 0) continue
    switch (def.kind) {
      case 'relationship': {
        const ids = resolveIds(def.field, values)
        // An unknown slug should yield no results rather than everything. Ids are numeric and start at 1,
        // so a negative id is a valid, always-false condition on both SQLite and PostgreSQL.
        and.push(ids.length ? { [def.field]: { in: ids } } : { id: { equals: NO_MATCH_ID } })
        break
      }
      case 'select':
      case 'text': {
        const expanded = def.expand ? values.flatMap((v) => def.expand?.[v] ?? []) : values
        // An unknown group should yield no results rather than everything.
        and.push(
          expanded.length ? { [def.field]: { in: expanded } } : { id: { equals: NO_MATCH_ID } },
        )
        break
      }
      case 'number': {
        const nums = values.map(Number).filter((n) => Number.isFinite(n))
        if (nums.length) and.push({ [def.field]: { in: nums } })
        break
      }
      case 'boolean':
        and.push({ [def.field]: { equals: values[0] === 'true' } })
        break
    }
  }
  return and.length === 1 ? and[0] : { and }
}

/** Keep the current filters while changing one parameter. Used by filter chips and pagination links. */
export const withParam = (
  sp: SearchParams,
  key: string,
  value: string | undefined,
  resetPage = true,
): string => {
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(sp)) {
    if (k === key || (resetPage && k === 'page')) continue
    if (Array.isArray(v)) v.forEach((x) => params.append(k, x))
    else if (v) params.set(k, v)
  }
  if (value) params.set(key, value)
  const s = params.toString()
  return s ? `?${s}` : ''
}

export const activeFilterCount = (sp: SearchParams, defs: FilterDef[]): number =>
  defs.reduce((n, d) => n + (getParamList(sp, d.param).length ? 1 : 0), 0)
