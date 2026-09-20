import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DetailPage } from './DetailPage'
import { RichText } from './RichText'
import { PeopleLinks, RelatedList } from './content'
import { ExternalLink, JsonLd, MetaList } from './ui'
import { Icon } from './Icon'
import { TrackLink } from './TrackLink'
import { findBySlug, getPayloadClient } from '@/lib/payload'
import { getSettings, relatedContent } from '@/lib/site'
import { buildMetadata, jsonLd } from '@/lib/seo'
import { absoluteUrl } from '@/lib/format'
import { CONTENT_TYPES, pathFor, type ContentTypeKey } from '@/lib/content-types'
import type { News, OpEd, Post } from '@/payload-types'

type Article = (Post | OpEd | News) & { outlet?: string | null; externalUrl?: string | null; body?: Post['body'] }
type ArticleType = Extract<ContentTypeKey, 'posts' | 'op-eds' | 'news'>

const LABEL: Record<ArticleType, { type: string; crumb: string; listing: string }> = {
  posts: { type: 'Blog', crumb: 'Blog and commentary', listing: '/commentary?type=posts' },
  'op-eds': { type: 'Op-ed', crumb: 'Op-eds and external publications', listing: '/commentary?type=op-eds' },
  news: { type: 'News', crumb: 'News', listing: '/commentary?type=news' },
}

export async function articleStaticParams(collection: ArticleType) {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection, limit: 500, depth: 0, where: { _status: { equals: 'published' } } })
  return res.docs.map((d) => ({ slug: d.slug ?? '' })).filter((p) => p.slug)
}

export async function articleMetadata(collection: ArticleType, slug: string): Promise<Metadata> {
  const doc = await findBySlug<Article>(await getPayloadClient(), collection, slug, 1)
  if (!doc) return {}
  return buildMetadata({
    title: doc.title,
    description: doc.summary,
    path: pathFor(collection, slug),
    type: 'article',
    image: typeof doc.image === 'object' ? doc.image : null,
    seo: doc.seo,
    publishedAt: doc.publishedAt,
  })
}

export async function ArticlePage({ collection, slug }: { collection: ArticleType; slug: string }) {
  const payload = await getPayloadClient()
  const [doc, settings] = await Promise.all([findBySlug<Article>(payload, collection, slug, 2), getSettings()])
  if (!doc) notFound()
  const show = Boolean(settings.showPrototypeNotices)
  const related = await relatedContent(payload, doc as unknown as Record<string, unknown>, { collection, id: doc.id })
  const labels = LABEL[collection]
  const authors = Array.isArray(doc.authors) ? doc.authors.filter((a) => typeof a === 'object') : []
  const authorNames = authors.map((a) => (a as { name: string }).name)
  if (doc.authorText) authorNames.push(doc.authorText)
  const image = typeof doc.image === 'object' ? doc.image : null
  const path = pathFor(collection, slug)

  return (
    <DetailPage
      crumbs={[{ href: '/commentary', label: 'Commentary' }, { href: labels.listing, label: labels.crumb }, { label: doc.title }]}
      type={labels.type}
      title={doc.title}
      summary={doc.summary}
      date={doc.publishedAt}
      provenance={doc.provenance}
      showNotices={show}
      doc={doc as unknown as Record<string, unknown>}
      aside={
        <>
          {collection === 'op-eds' && doc.externalUrl && (
            <div className="download-box">
              <h2>
                <Icon name="external" size={16} /> Read the full piece
              </h2>
              <p className="filemeta">Published in {doc.outlet}</p>
              <TrackLink className="btn btn--primary" href={doc.externalUrl} event="outbound_oped" data={{ resource: doc.title }} rel="noopener noreferrer">
                Open at {doc.outlet} <Icon name="external" size={14} />
              </TrackLink>
            </div>
          )}
          <MetaList
            items={[
              authorNames.length > 0 && { label: authorNames.length > 1 ? 'Authors' : 'Author', value: authors.length ? <PeopleLinks people={authors} /> : doc.authorText },
              collection === 'op-eds' && doc.outlet && { label: 'Outlet', value: doc.outlet },
            ]}
          />
          <RelatedList items={related} />
        </>
      }
    >
      <JsonLd
        data={jsonLd.article({
          title: doc.title,
          description: doc.summary,
          url: absoluteUrl(path),
          datePublished: doc.publishedAt,
          authors: authorNames,
        })}
      />
      {image?.url && (
        <figure style={{ marginBottom: 'var(--s-5)' }}>
          <img className="cover-img" src={image.sizes?.wide?.url ?? image.url} alt={image.alt} width={1440} height={810} />
          {(image.caption || image.credit) && (
            <figcaption className="tiny muted">
              {image.caption} {image.credit && <span>Credit. {image.credit}</span>}
            </figcaption>
          )}
        </figure>
      )}
      {collection === 'op-eds' ? (
        <div className="prose prose--serif">
          <p>{doc.summary}</p>
          {doc.externalUrl && (
            <p className="small" style={{ fontFamily: 'var(--font-text)' }}>
              This piece was published by {doc.outlet}. <ExternalLink href={doc.externalUrl}>Read it there</ExternalLink>.
            </p>
          )}
        </div>
      ) : (
        <RichText data={doc.body} serif />
      )}
      <p className="tiny muted" style={{ marginTop: 'var(--s-6)' }}>
        {CONTENT_TYPES[collection].label} · Views are the authors’ own and do not necessarily reflect those of LIRNEasia, its partners or its funders.
      </p>
    </DetailPage>
  )
}
