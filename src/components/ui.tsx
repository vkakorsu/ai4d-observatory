import Link from '@/components/SmartLink'
import type { ReactNode } from 'react'
import { Icon } from './Icon'
import { absoluteUrl } from '@/lib/format'
import { jsonLd } from '@/lib/seo'

/* Small server components shared across pages. */

export function Breadcrumbs({ items }: { items: Array<{ href?: string; label: string }> }) {
  const all = [{ href: '/', label: 'Home' }, ...items]
  return (
    <>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          {all.map((it, i) => (
            <li key={`${it.label}-${i}`}>
              {it.href && i < all.length - 1 ? (
                <Link href={it.href}>{it.label}</Link>
              ) : (
                <span aria-current="page">{it.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={jsonLd.breadcrumbs(
          all.map((it) => ({ name: it.label, url: absoluteUrl(it.href ?? '/') })),
        )}
      />
    </>
  )
}

export function PageHeader({
  kicker,
  title,
  lede,
  aside,
  split = false,
}: {
  kicker?: string
  title: string
  lede?: ReactNode
  aside?: ReactNode
  split?: boolean
}) {
  return (
    <header className={`page-header ${split ? 'page-header--split' : ''}`}>
      <div>
        {kicker && <p className="kicker">{kicker}</p>}
        <h1>{title}</h1>
        {lede && <p className="lede">{lede}</p>}
      </div>
      {aside && <div>{aside}</div>}
    </header>
  )
}

export function Section({
  title,
  more,
  children,
  flush = false,
  id,
}: {
  title?: string
  more?: { href: string; label: string }
  children: ReactNode
  flush?: boolean
  id?: string
}) {
  return (
    <section
      className={`section ${flush ? 'section--flush' : ''}`}
      id={id}
      aria-labelledby={id ? `${id}-h` : undefined}
    >
      {(title || more) && (
        <div className="section__head">
          {title && <h2 id={id ? `${id}-h` : undefined}>{title}</h2>}
          {more && (
            <Link className="section__more" href={more.href}>
              {more.label} <Icon name="arrow" size={14} />
            </Link>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

/** Marks illustrative content while site setting `showPrototypeNotices` is on. */
export function ProvenanceBadge({
  provenance,
  show,
}: {
  provenance?: string | null
  show: boolean
}) {
  if (!show || !provenance || provenance === 'client') return null
  if (provenance === 'public') return <span className="badge">Public record</span>
  return <span className="badge badge--sample">Sample content</span>
}

export function PendingBadge({ children = 'Pending client decision' }: { children?: ReactNode }) {
  return <span className="badge badge--pending">{children}</span>
}

export function Notice({
  children,
  icon = 'info',
}: {
  children: ReactNode
  icon?: 'info' | 'lock'
}) {
  return (
    <div className="notice" role="note">
      <Icon name={icon} size={18} />
      <div>{children}</div>
    </div>
  )
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="empty">
      <h2>{title}</h2>
      {children}
    </div>
  )
}

export function JsonLd({ data }: { data: unknown }) {
  // JSON-LD is data, not markup. The replace guards against a closing script tag inside a string value.
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}

type Term = { id: string | number; name: string; slug?: string | null }

const termList = (v: unknown): Term[] =>
  Array.isArray(v)
    ? v.filter((x): x is Term => Boolean(x) && typeof x === 'object' && 'name' in x)
    : []

/** Taxonomy chips linking to hub pages. Countries first, then enablers, then topics. */
export function TaxChips({
  doc,
  limit,
  base,
}: {
  doc: Record<string, unknown>
  limit?: number
  /** Listing route to filter within instead of the hub. */
  base?: string
}) {
  const countries = termList(doc.countries)
  const enablers = termList(doc.enablers)
  const topics = termList(doc.topics ?? doc.expertise)
  const dims = termList(doc.raiDimensions)
  const chips: Array<{ key: string; label: string; href: string; cls: string }> = [
    ...countries.map((t) => ({
      key: `c-${t.id}`,
      label: t.name,
      href: base ? `${base}?country=${t.slug}` : `/countries/${t.slug}`,
      cls: 'chip chip--country',
    })),
    ...enablers.map((t) => ({
      key: `e-${t.id}`,
      label: t.name,
      href: base ? `${base}?enabler=${t.slug}` : `/enablers/${t.slug}`,
      cls: 'chip chip--enabler',
    })),
    ...topics.map((t) => ({
      key: `t-${t.id}`,
      label: t.name,
      href: base ? `${base}?topic=${t.slug}` : `/topics/${t.slug}`,
      cls: 'chip',
    })),
    ...dims.map((t) => ({
      key: `d-${t.id}`,
      label: t.name,
      href: base ? `${base}?dimension=${t.slug}` : `/dimensions/${t.slug}`,
      cls: 'chip',
    })),
  ]
  const shown = limit ? chips.slice(0, limit) : chips
  const rest = chips.length - shown.length
  if (!chips.length) return null
  return (
    <div className="chip-row">
      {shown.map((c) => (
        <Link key={c.key} href={c.href} className={c.cls}>
          {c.label}
        </Link>
      ))}
      {rest > 0 && <span className="chip">+{rest}</span>}
    </div>
  )
}

/** Falsy values are allowed so callers can write `doc.field && { label, value }`. */
export type MetaItem = { label: string; value: ReactNode } | null | false | undefined | '' | 0

export function MetaList({ items }: { items: MetaItem[] }) {
  const rows = items.filter((x): x is { label: string; value: ReactNode } => Boolean(x))
  if (!rows.length) return null
  return (
    <dl className="meta-list">
      {rows.map((r) => (
        <div key={r.label}>
          <dt>{r.label}</dt>
          <dd>{r.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} rel="noopener noreferrer" target="_blank">
      {children} <Icon name="external" size={13} />
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  )
}

/** Typographic cover for items without imagery. */
export function TypeCover({
  type,
  title,
  large = false,
}: {
  type: string
  title: string
  large?: boolean
}) {
  const cls = `tcover tcover--${type.toLowerCase().replace(/\s+/g, '-')} ${large ? 'tcover--large' : ''}`
  return (
    <div className={cls} aria-hidden="true">
      <span>{type}</span>
      <strong>
        {title.length > (large ? 90 : 48) ? `${title.slice(0, large ? 88 : 46).trim()}…` : title}
      </strong>
    </div>
  )
}

export function Avatar({
  name,
  photo,
  org = false,
}: {
  name: string
  photo?: { url?: string | null; alt?: string | null } | null
  org?: boolean
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')
  return (
    <span className={`avatar ${org ? 'avatar--org' : ''}`} aria-hidden="true">
      {photo?.url ? (
        // eslint-disable-next-line @next/next/no-img-element -- WebP rendition generated at upload
        <img src={photo.url} alt="" loading="lazy" width={52} height={52} />
      ) : (
        initials
      )}
    </span>
  )
}
