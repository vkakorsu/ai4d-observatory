import Link from '@/components/SmartLink'
import type { ReactNode } from 'react'
import { Icon } from './Icon'
import { ProvenanceBadge, TaxChips } from './ui'
import { FilterDisclosure } from './FilterDisclosure'
import { isPlaceholderImage, MosaicCover, ReportCover } from './ArtCover'
import { formatDate } from '@/lib/format'
import { CONTENT_TYPES, pathFor, type ContentTypeKey } from '@/lib/content-types'
import {
  activeFilterCount,
  getParam,
  getParamList,
  withParam,
  type FilterDef,
  type SearchParams,
} from '@/lib/queries'

/* Listing building blocks. Filter rail, result rows, active filter chips, pagination. */

type Doc = Record<string, unknown> & { id: string | number; slug?: string | null }

const str = (v: unknown) => (typeof v === 'string' ? v : '')

export function typeLabelFor(collection: ContentTypeKey, doc: Doc): string {
  if (collection === 'publications' && typeof doc.type === 'string')
    return doc.type.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
  if (collection === 'learning-resources' && typeof doc.resourceType === 'string')
    return doc.resourceType.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
  if (collection === 'opportunities' && typeof doc.opportunityType === 'string')
    return doc.opportunityType.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
  return CONTENT_TYPES[collection].label
}

export function Item({
  collection,
  doc,
  showNotices,
  compact = false,
  cover = false,
  meta,
}: {
  collection: ContentTypeKey
  doc: Doc
  showNotices: boolean
  compact?: boolean
  cover?: boolean
  meta?: ReactNode
}) {
  const def = CONTENT_TYPES[collection]
  const title = str(doc[def.titleField])
  const href = pathFor(collection, doc.slug ?? '')
  const type = typeLabelFor(collection, doc)
  const img = (doc.cover ?? doc.image) as {
    url?: string
    sizes?: { card?: { url?: string }; thumb?: { url?: string } }
    alt?: string
    mimeType?: string
    caption?: string
    filename?: string
  } | null
  const real = img && typeof img === 'object' && !isPlaceholderImage(img) ? img : null
  const portrait = collection === 'publications' || collection === 'datasets'
  const date = str(doc.publishedAt)
  const seed = `${collection}:${doc.slug ?? doc.id}`
  return (
    <article
      className={`item ${compact ? 'item--compact' : ''} ${cover ? `item--with-cover ${portrait ? '' : 'item--cover-wide'}` : ''}`}
    >
      {cover && (
        <Link
          href={href}
          className={`thumb ${portrait ? 'thumb--portrait' : 'thumb--wide'}`}
          tabIndex={-1}
          aria-hidden="true"
        >
          {real ? (
            // eslint-disable-next-line @next/next/no-img-element -- WebP rendition generated at upload
            <img src={real.sizes?.card?.url || real.url} alt="" loading="lazy" decoding="async" />
          ) : portrait ? (
            <ReportCover
              seed={seed}
              kind={collection === 'datasets' ? 'dataset' : str(doc.type)}
              label={type}
              title={title}
            />
          ) : (
            <MosaicCover seed={seed} />
          )}
        </Link>
      )}
      <div className="item__body">
        <div className="item__type">
          <span className="dot" aria-hidden="true" />
          <span>{type}</span>
          {date && <time dateTime={date}>{formatDate(date)}</time>}
          <ProvenanceBadge provenance={str(doc.provenance)} show={showNotices} />
        </div>
        <h3 className="item__title">
          <Link href={href}>{title}</Link>
        </h3>
        {!compact && str(doc.summary) && <p className="item__summary">{str(doc.summary)}</p>}
        {meta && <div className="item__meta">{meta}</div>}
        {!compact && <TaxChips doc={doc} limit={4} />}
      </div>
    </article>
  )
}

export function ItemList({ children }: { children: ReactNode }) {
  return <ul className="item-list">{children}</ul>
}

export function Filters({
  defs,
  options,
  sp,
  action,
  extra,
  searchLabel = 'Search within results',
}: {
  defs: FilterDef[]
  options: Record<string, Array<{ value: string; label: string }>>
  sp: SearchParams
  action: string
  /** Extra controls rendered inside the form (for example a type select). */
  extra?: ReactNode
  searchLabel?: string
}) {
  const active = activeFilterCount(sp, defs)
  const q = getParam(sp, 'q') ?? ''
  return (
    <>
      <FilterDisclosure active={active > 0 || Boolean(q)} signature={JSON.stringify(sp)}>
        <summary>
          <span>
            <Icon name="filter" size={16} /> Filters{active ? ` (${active})` : ''}
          </span>
        </summary>
        {/* Keyed on the URL: after a client-side navigation (a tab, a chip, Back) the uncontrolled selects would
            otherwise keep showing, and then submit, the previous values. */}
        <form
          key={JSON.stringify(sp)}
          className="filters__body"
          method="get"
          action={action}
          data-autosubmit
        >
          <div className="filters__group">
            <label htmlFor="f-q">{searchLabel}</label>
            <input id="f-q" type="search" name="q" defaultValue={q} />
          </div>
          {extra}
          {defs.map((d) => {
            const opts = options[d.param] ?? []
            if (!opts.length) return null
            const current = getParamList(sp, d.param)
            return (
              <div className="filters__group" key={d.param}>
                <label htmlFor={`f-${d.param}`}>{d.label}</label>
                <select id={`f-${d.param}`} name={d.param} defaultValue={current[0] ?? ''}>
                  <option value="">All</option>
                  {opts.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            )
          })}
          <div className="filters__actions">
            <button className="btn btn--small" type="submit">
              Apply
            </button>
            {(active > 0 || q) && (
              <Link className="btn btn--small btn--ghost" href={action}>
                Clear all
              </Link>
            )}
          </div>
        </form>
      </FilterDisclosure>
      {/* Opens the panel before first paint on wider screens, so desktop never sees it collapse and reopen. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){var d=document.currentScript.previousElementSibling;if(d&&window.matchMedia&&matchMedia('(min-width: 64em)').matches)d.open=true})()`,
        }}
      />
    </>
  )
}

/** Active filters as removable chips. Each chip is a link to the same view minus one parameter. */
export function ActiveFilters({
  defs,
  options,
  sp,
  action,
}: {
  defs: FilterDef[]
  options: Record<string, Array<{ value: string; label: string }>>
  sp: SearchParams
  action: string
}) {
  const chips: Array<{ key: string; label: string; href: string }> = []
  const q = getParam(sp, 'q')
  if (q)
    chips.push({ key: 'q', label: `“${q}”`, href: `${action}${withParam(sp, 'q', undefined)}` })
  for (const d of defs) {
    for (const v of getParamList(sp, d.param)) {
      const label = options[d.param]?.find((o) => o.value === v)?.label ?? v
      chips.push({
        key: `${d.param}-${v}`,
        label: `${d.label}. ${label}`,
        href: `${action}${withParam(sp, d.param, undefined)}`,
      })
    }
  }
  if (!chips.length) return null
  return (
    <div className="filter-chips" aria-label="Active filters">
      <span className="label">Filtering by</span>
      {chips.map((c) => (
        <Link
          key={c.key}
          href={c.href}
          className="chip chip--remove"
          aria-label={`Remove filter ${c.label}`}
        >
          {c.label}
        </Link>
      ))}
    </div>
  )
}

export function ResultsHead({
  total,
  noun,
  children,
}: {
  total: number
  noun: string
  children?: ReactNode
}) {
  return (
    <div className="results-head">
      {/* A real heading so the h3 result titles below sit under an h2 (WCAG 1.3.1, heading order). */}
      <h2 className="results-head__count" aria-live="polite">
        <span className="count">{total}</span> {total === 1 ? noun : `${noun}s`}
      </h2>
      {children}
    </div>
  )
}

export function Pagination({
  page,
  totalPages,
  sp,
  action,
}: {
  page: number
  totalPages: number
  sp: SearchParams
  action: string
}) {
  if (totalPages <= 1) return null
  const link = (p: number) =>
    `${action}${withParam(sp, 'page', p === 1 ? undefined : String(p), false)}`
  const window = 2
  const pages: number[] = []
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= window) pages.push(p)
  }
  return (
    <nav className="pagination" aria-label="Pagination">
      {page > 1 ? (
        <Link href={link(page - 1)} rel="prev">
          Previous
        </Link>
      ) : (
        <span className="muted">Previous</span>
      )}
      <ul className="pages">
        {pages.map((p, i) => (
          <li key={p}>
            {i > 0 && pages[i - 1] !== p - 1 && <span aria-hidden="true">…</span>}
            {p === page ? (
              <span aria-current="page">{p}</span>
            ) : (
              <Link href={link(p)} aria-label={`Page ${p}`}>
                {p}
              </Link>
            )}
          </li>
        ))}
      </ul>
      {page < totalPages ? (
        <Link href={link(page + 1)} rel="next">
          Next
        </Link>
      ) : (
        <span className="muted">Next</span>
      )}
    </nav>
  )
}

/** Progressive enhancement. Submits filter forms on change when JavaScript is available. */
export function AutoSubmit() {
  // Submit filter forms on change, and leave empty fields out so URLs stay short and shareable
  // (?group=reports&country=india rather than ?q=&group=reports&type=&country=india...).
  const code = `document.addEventListener('change',function(e){var f=e.target&&e.target.form;if(f&&f.hasAttribute('data-autosubmit')&&e.target.tagName==='SELECT'){f.requestSubmit?f.requestSubmit():f.submit();}});document.addEventListener('submit',function(e){var f=e.target;if(!f||!f.hasAttribute||!f.hasAttribute('data-autosubmit'))return;var off=[];Array.prototype.forEach.call(f.elements,function(el){if(el.name&&!el.disabled&&el.value===''){el.disabled=true;off.push(el);}});setTimeout(function(){off.forEach(function(el){el.disabled=false;});},0);});`
  return <script dangerouslySetInnerHTML={{ __html: code }} />
}
