import type { Metadata } from 'next'
import Link from 'next/link'
import type { PaginatedDocs, Where } from 'payload'
import type { Search } from '@/payload-types'
import type { PageProps } from '@/components/ListingPage'
import { Pagination, ResultsHead } from '@/components/listing'
import { Breadcrumbs, Empty, PageHeader } from '@/components/ui'
import { Icon } from '@/components/Icon'
import { getPayloadClient } from '@/lib/payload'
import { getSettings } from '@/lib/site'
import { CONTENT_TYPES, contentTypeList, type ContentTypeKey } from '@/lib/content-types'
import { getPage, getParam, withParam } from '@/lib/queries'
import { formatDate } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search every use case, publication, dataset, person, organisation, event, learning resource and opportunity on the Asia AI4D Observatory.',
  robots: { index: false, follow: true },
}

const PAGE = 15

/**
 * Site-wide search over the unified index (Section 3.1.4 a).
 * The index row carries title, excerpt, keywords (taxonomy names and type), path and type label,
 * so one query spans every content type. Results are grouped by type count and filterable by type.
 */
export default async function SearchPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const q = (getParam(sp, 'q') ?? '').trim().slice(0, 120)
  const type = getParam(sp, 'type') as ContentTypeKey | undefined
  const page = getPage(sp)
  const payload = await getPayloadClient()
  const settings = await getSettings()
  const show = Boolean(settings.showPrototypeNotices)

  let results: PaginatedDocs<Search> | null = null
  let counts: Array<{ type: ContentTypeKey; n: number }> = []
  if (q) {
    const terms = q.split(/\s+/).filter(Boolean).slice(0, 6)
    const textMatch: Where = {
      and: terms.map((t): Where => ({ or: [{ title: { like: t } }, { excerpt: { like: t } }, { keywords: { like: t } }] })),
    }
    const where: Where = type ? { and: [textMatch, { 'doc.relationTo': { equals: type } }] } : textMatch
    ;[results, counts] = await Promise.all([
      payload.find({ collection: 'search', where, sort: '-priority', limit: PAGE, page, depth: 0 }),
      Promise.all(
        contentTypeList
          .filter((t) => t.inSearch)
          .map(async (t) => ({
            type: t.collection,
            n: (await payload.count({ collection: 'search', where: { and: [textMatch, { 'doc.relationTo': { equals: t.collection } }] } })).totalDocs,
          })),
      ).then((arr) => arr.filter((x) => x.n > 0)),
    ])
  }

  return (
    <div className="container">
      <Breadcrumbs items={[{ label: 'Search' }]} />
      <PageHeader kicker="Search" title={q ? `Results for “${q}”` : 'Search the Observatory'} />
      <form className="search-form" role="search" method="get" action="/search">
        <label htmlFor="q" className="visually-hidden">
          Search
        </label>
        <input id="q" type="search" name="q" defaultValue={q} placeholder="Try a country, a sector, an enabler or a title" autoFocus={!q} />
        {type && <input type="hidden" name="type" value={type} />}
        <button className="btn btn--primary" type="submit">
          <Icon name="search" size={16} /> Search
        </button>
      </form>

      {!q && (
        <div className="flow" style={{ marginTop: 'var(--s-6)', maxWidth: 'var(--measure)' }}>
          <p className="muted">One search covers every content type. Or browse by structure.</p>
          <div className="hub-counts">
            {contentTypeList
              .filter((t) => t.inSearch && t.collection !== 'pages')
              .map((t) => (
                <Link key={t.collection} href={t.listing}>
                  {t.plural}
                </Link>
              ))}
          </div>
        </div>
      )}

      {q && results && (
        <div className="layout-rail" style={{ marginTop: 'var(--s-6)' }}>
          <aside className="rail" aria-label="Filter by type">
            <div className="filters">
              <p className="filters__group" style={{ margin: 0 }}>
                <span style={{ fontSize: 'var(--step--1)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-56)' }}>
                  Type
                </span>
              </p>
              <ul className="related-list" style={{ marginTop: 'var(--s-2)' }}>
                <li>
                  <Link href={`/search${withParam(sp, 'type', undefined)}`} aria-current={!type ? 'page' : undefined} style={{ fontWeight: !type ? 700 : 500 }}>
                    All results <span className="mono muted tiny">{counts.reduce((a, b) => a + b.n, 0)}</span>
                  </Link>
                </li>
                {counts.map((c) => (
                  <li key={c.type}>
                    <Link href={`/search${withParam(sp, 'type', c.type)}`} aria-current={type === c.type ? 'page' : undefined} style={{ fontWeight: type === c.type ? 700 : 500 }}>
                      {CONTENT_TYPES[c.type].plural} <span className="mono muted tiny">{c.n}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          <div>
            <ResultsHead total={results.totalDocs} noun="result" />
            {results.docs.length === 0 ? (
              <Empty title="No results">
                <p>
                  Check the spelling, try a broader word, or browse <Link href="/use-cases">use cases</Link>, <Link href="/publications">publications</Link>{' '}
                  or <Link href="/data">data</Link>.
                </p>
              </Empty>
            ) : (
              <ul className="item-list">
                {results.docs.map((r) => {
                  const rel = r.doc as { relationTo: ContentTypeKey; value: string | number }
                  return (
                    <li key={r.id}>
                      <article className="item result">
                        <div className="item__type">
                          <span className="dot" aria-hidden="true" /> {r.typeLabel ?? CONTENT_TYPES[rel.relationTo]?.label}
                          {r.publishedAt && <time dateTime={r.publishedAt}>{formatDate(r.publishedAt)}</time>}
                          {r.countries && <span>· {r.countries}</span>}
                        </div>
                        <h3 className="item__title">
                          <Link href={r.path ?? '/'}>
                            <Highlight text={r.title ?? ''} terms={q} />
                          </Link>
                        </h3>
                        {r.excerpt && (
                          <p className="item__summary">
                            <Highlight text={r.excerpt.slice(0, 240)} terms={q} />
                            {r.excerpt.length > 240 ? '…' : ''}
                          </p>
                        )}
                      </article>
                    </li>
                  )
                })}
              </ul>
            )}
            <Pagination page={results.page ?? page} totalPages={results.totalPages} sp={sp} action="/search" />
            {show && (
              <p className="tiny muted" style={{ marginTop: 'var(--s-5)' }}>
                Search runs on the CMS search index. In production on PostgreSQL the same index gains full-text ranking with a
                generated tsvector column. No third-party search service is required.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/** Wrap matched terms in <mark>. Plain string splitting, no HTML injection. */
function Highlight({ text, terms }: { text: string; terms: string }) {
  const words = terms.split(/\s+/).filter((w) => w.length > 1)
  if (!words.length) return <>{text}</>
  const pattern = `(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`
  const parts = text.split(new RegExp(pattern, 'ig'))
  const isMatch = new RegExp(`^${pattern}$`, 'i')
  return (
    <>
      {parts.map((p, i) => (isMatch.test(p) ? <mark key={i}>{p}</mark> : <span key={i}>{p}</span>))}
    </>
  )
}
