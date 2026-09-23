import type { Payload, Where } from 'payload'
import type { Search } from '@/payload-types'

/**
 * Site-wide search (Section 3.1.4 a). Matching runs in the database over the unified search index; ranking and
 * spelling suggestions run here, so behaviour is identical on SQLite and PostgreSQL and needs no search service.
 *
 * Ranking weights a term found in the title above one found in taxonomy keywords, above one in the excerpt,
 * rewards the whole phrase appearing in the title, then breaks ties by content-type priority and recency.
 * At the Observatory's scale (thousands of records) this is fast; a PostgreSQL tsvector index can replace the
 * candidate query later without changing the page.
 */

const STOP = new Set([
  'a',
  'an',
  'and',
  'the',
  'of',
  'in',
  'on',
  'for',
  'to',
  'with',
  'by',
  'at',
  'is',
  'are',
  'or',
])

/** Words of a query or a record. Queries are capped at `limit` terms; vocabulary building passes no cap. */
export const tokenize = (q: string, limit = 8): string[] =>
  Array.from(
    new Set(
      q
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .split(/[^\p{L}\p{N}]+/u)
        .filter((t) => t.length > 1 && !STOP.has(t)),
    ),
  ).slice(0, limit)

type Scorable = Pick<Search, 'title' | 'excerpt' | 'keywords' | 'priority' | 'publishedAt'>

const norm = (s: string | null | undefined) =>
  (s ?? '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')

export const scoreDoc = (doc: Scorable, terms: string[], phrase: string): number => {
  const title = norm(doc.title)
  const keywords = norm(doc.keywords)
  const excerpt = norm(doc.excerpt)
  let score = 0
  for (const t of terms) {
    const wordStart = new RegExp(
      `(^|[^\\p{L}\\p{N}])${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
      'u',
    )
    if (title.includes(t)) score += wordStart.test(title) ? 14 : 8
    if (keywords.includes(t)) score += wordStart.test(keywords) ? 7 : 4
    if (excerpt.includes(t)) score += wordStart.test(excerpt) ? 3 : 1.5
  }
  if (terms.length > 1 && phrase && title.includes(phrase)) score += 20
  score += (doc.priority ?? 0) / 10
  if (doc.publishedAt) {
    const ageDays = (Date.now() - new Date(doc.publishedAt).getTime()) / 86_400_000
    score += Math.max(0, 2 - ageDays / 365)
  }
  return score
}

/** Levenshtein distance with an early exit once it exceeds `max`. */
export const editDistance = (a: string, b: string, max = 2): number => {
  if (Math.abs(a.length - b.length) > max) return max + 1
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const cur = [i]
    let rowMin = i
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
      rowMin = Math.min(rowMin, cur[j])
    }
    if (rowMin > max) return max + 1
    prev = cur
  }
  return prev[b.length]
}

/** Replace each unknown term with the closest vocabulary word, if one is close enough. Null when nothing changes. */
export const suggest = (terms: string[], vocabulary: Map<string, number>): string | null => {
  let changed = false
  const out = terms.map((t) => {
    if (vocabulary.has(t) || t.length < 4) return t
    let best: { w: string; d: number; n: number } | null = null
    const max = t.length > 7 ? 2 : 1
    for (const [w, n] of vocabulary) {
      if (Math.abs(w.length - t.length) > max) continue
      const d = editDistance(t, w, max)
      if (d <= max && (!best || d < best.d || (d === best.d && n > best.n))) best = { w, d, n }
    }
    if (best) {
      changed = true
      return best.w
    }
    return t
  })
  return changed ? out.join(' ') : null
}

let vocabCache: { at: number; words: Map<string, number> } | null = null
const vocabulary = async (payload: Payload) => {
  if (vocabCache && Date.now() - vocabCache.at < 5 * 60_000) return vocabCache.words
  const res = await payload.find({
    collection: 'search',
    limit: 5000,
    depth: 0,
    pagination: false,
    select: { title: true, keywords: true },
  })
  const words = new Map<string, number>()
  for (const d of res.docs)
    for (const w of tokenize(`${d.title ?? ''} ${d.keywords ?? ''}`, Infinity))
      words.set(w, (words.get(w) ?? 0) + 1)
  vocabCache = { at: Date.now(), words }
  return words
}

export type SearchOutcome = {
  results: Search[]
  total: number
  totalPages: number
  page: number
  counts: Record<string, number>
  suggestion: string | null
}

export async function runSearch(
  payload: Payload,
  q: string,
  opts: { type?: string; page?: number; perPage?: number } = {},
): Promise<SearchOutcome> {
  const perPage = opts.perPage ?? 15
  const terms = tokenize(q)
  const empty = { results: [], total: 0, totalPages: 0, page: 1, counts: {}, suggestion: null }
  if (!terms.length) return empty
  const where: Where = {
    and: terms.map((t): Where => ({
      or: [{ title: { like: t } }, { excerpt: { like: t } }, { keywords: { like: t } }],
    })),
  }
  const res = await payload.find({
    collection: 'search',
    where,
    limit: 1000,
    depth: 0,
    pagination: false,
  })
  const phrase = terms.join(' ')
  const ranked = res.docs
    .map((d) => ({ d, s: scoreDoc(d, terms, phrase) }))
    .sort((a, b) => b.s - a.s)
    .map((x) => x.d)

  const counts: Record<string, number> = {}
  for (const d of ranked) {
    const rel = (d.doc as { relationTo: string }).relationTo
    counts[rel] = (counts[rel] ?? 0) + 1
  }
  const filtered = opts.type
    ? ranked.filter((d) => (d.doc as { relationTo: string }).relationTo === opts.type)
    : ranked
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const page = Math.min(Math.max(1, opts.page ?? 1), totalPages)
  const suggestion = ranked.length === 0 ? suggest(terms, await vocabulary(payload)) : null
  return {
    results: filtered.slice((page - 1) * perPage, page * perPage),
    total: filtered.length,
    totalPages,
    page,
    counts,
    suggestion,
  }
}
