import type { ReactNode } from 'react'
import { Breadcrumbs, ProvenanceBadge, TaxChips } from './ui'
import { formatDate } from '@/lib/format'

/**
 * Shared frame for content detail pages. Eight-column article, four-column metadata rail.
 * Every detail page shows its type, its date, its provenance and its taxonomy in the same place.
 */
export function DetailPage({
  crumbs,
  type,
  title,
  summary,
  date,
  provenance,
  showNotices,
  doc,
  children,
  aside,
  before,
}: {
  crumbs: Array<{ href?: string; label: string }>
  type: string
  title: string
  summary?: string | null
  date?: string | null
  provenance?: string | null
  showNotices: boolean
  doc: Record<string, unknown>
  children: ReactNode
  aside?: ReactNode
  /** Rendered full width above the two columns, for example an image or a map. */
  before?: ReactNode
}) {
  return (
    <div className="container">
      <Breadcrumbs items={crumbs} />
      <header className="page-header" style={{ paddingBottom: 'var(--s-4)' }}>
        <p className="kicker">
          {type}
          {date && (
            <>
              <span aria-hidden="true" style={{ color: 'var(--ink-32)' }}>
                ·
              </span>
              <time dateTime={date} style={{ color: 'var(--ink-56)', fontWeight: 500, letterSpacing: 0, textTransform: 'none' }}>
                {formatDate(date)}
              </time>
            </>
          )}
          <ProvenanceBadge provenance={provenance} show={showNotices} />
        </p>
        <h1 className="detail__title">{title}</h1>
        {summary && <p className="lede">{summary}</p>}
        <div style={{ marginTop: 'var(--s-4)' }}>
          <TaxChips doc={doc} />
        </div>
      </header>
      {before}
      <div className="detail">
        <article>{children}</article>
        {aside && <aside className="detail__aside">{aside}</aside>}
      </div>
    </div>
  )
}
