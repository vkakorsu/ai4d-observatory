import Link from '@/components/SmartLink'
import type { Media } from '@/payload-types'
import { Icon } from './Icon'
import { GateForm } from './forms/GateForm'
import { TrackLink } from './TrackLink'
import { CONTENT_TYPES, pathFor, type ContentTypeKey } from '@/lib/content-types'
import { typeLabelFor } from './listing'
import type { MetaItem } from './ui'
import { downloadName, fileKind, formatDate, formatFileSize } from '@/lib/format'

/* Components used by detail pages. */

/** Open or gated download, decided by the media item's `access` field. */
export function DownloadBox({
  file,
  resourceTitle,
  resourceUrl,
  consentText,
  label = 'Download',
}: {
  file: Media | string | number | null | undefined
  resourceTitle: string
  resourceUrl: string
  consentText: string
  label?: string
}) {
  if (!file || typeof file !== 'object' || !file.url) return null
  const sizeLabel = formatFileSize(file.filesize)
  if (file.access === 'gated') {
    return (
      <GateForm
        fileId={String(file.id)}
        resourceTitle={resourceTitle}
        resourceUrl={resourceUrl}
        purpose={
          file.gatePurpose ??
          'We ask for your email address so we can tell you when this resource is updated.'
        }
        consentText={consentText}
        filename={file.filename}
        size={file.filesize}
      />
    )
  }
  return (
    <div className="download-box">
      <h2>
        <Icon name="download" size={16} /> {label}
      </h2>
      <p className="filemeta">
        {fileKind(file.filename)}
        {sizeLabel ? ` · ${sizeLabel}` : ''} · open access
      </p>
      <TrackLink
        className="btn btn--primary"
        href={file.url}
        event="download"
        data={{ resource: resourceTitle, gated: false }}
        download={downloadName(resourceTitle, file.filename)}
      >
        <Icon name="download" size={16} /> Download{' '}
        {file.mimeType === 'application/pdf' ? 'PDF' : 'file'}
      </TrackLink>
    </div>
  )
}

export function RelatedList({
  items,
  title = 'Related',
}: {
  items: Array<{ collection: ContentTypeKey; doc: Record<string, unknown> }>
  title?: string
}) {
  if (!items.length) return null
  return (
    <section className="detail__block" aria-labelledby="related-h">
      <h2 id="related-h">{title}</h2>
      <ul className="related-list">
        {items.map(({ collection, doc }) => {
          const def = CONTENT_TYPES[collection]
          const d = doc as Record<string, unknown> & { id: string | number; slug?: string | null }
          const title = String(d[def.titleField] ?? '')
          const date =
            typeof d.publishedAt === 'string'
              ? d.publishedAt
              : typeof d.startDate === 'string'
                ? d.startDate
                : ''
          return (
            <li key={`${collection}-${d.id}`}>
              <span className="item__type">
                <span className="dot" aria-hidden="true" /> {typeLabelFor(collection, d)}
                {date && <time dateTime={date}>{formatDate(date)}</time>}
              </span>
              <Link href={pathFor(collection, d.slug ?? '')}>{title}</Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

type PersonLike = {
  id: string | number
  name: string
  slug?: string | null
  role?: string | null
  organisation?: unknown
}
type OrgLike = { id: string | number; name: string; slug?: string | null; acronym?: string | null }

export function PeopleLinks({ people }: { people: unknown }) {
  const list = Array.isArray(people)
    ? (people.filter((p) => p && typeof p === 'object') as PersonLike[])
    : []
  if (!list.length) return null
  return (
    <ul className="related-list">
      {list.map((p) => (
        <li key={p.id}>
          <Link href={`/people/${p.slug}`}>{p.name}</Link>
          {p.role && <span className="tiny muted">{p.role}</span>}
        </li>
      ))}
    </ul>
  )
}

export function OrgLinks({ orgs }: { orgs: unknown }) {
  const list = Array.isArray(orgs)
    ? (orgs.filter((o) => o && typeof o === 'object') as OrgLike[])
    : []
  if (!list.length) return null
  return (
    <ul className="related-list">
      {list.map((o) => (
        <li key={o.id}>
          <Link href={`/organisations/${o.slug}`}>
            {o.name}
            {o.acronym ? ` (${o.acronym})` : ''}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function LinkList({ links }: { links: unknown }) {
  const list = Array.isArray(links)
    ? (links as Array<{ label: string; url: string; id?: string }>)
    : []
  if (!list.length) return null
  return (
    <ul className="related-list">
      {list.map((l, i) => (
        <li key={l.id ?? i}>
          <a href={l.url} rel="noopener noreferrer">
            {l.label} <Icon name="external" size={12} />
          </a>
        </li>
      ))}
    </ul>
  )
}

export function Facts({ items }: { items: MetaItem[] }) {
  const rows = items.filter((x): x is { label: string; value: React.ReactNode } => Boolean(x))
  if (!rows.length) return null
  return (
    <dl className="detail__facts">
      {rows.map((r) => (
        <div className="fact" key={r.label}>
          <dt>{r.label}</dt>
          <dd>{r.value}</dd>
        </div>
      ))}
    </dl>
  )
}
