import type { Metadata } from 'next'
import Link from '@/components/SmartLink'
import { notFound } from 'next/navigation'
import { DetailPage } from '@/components/DetailPage'
import { RichText } from '@/components/RichText'
import { LinkList } from '@/components/content'
import { Item, ItemList } from '@/components/listing'
import { Avatar, JsonLd, MetaList } from '@/components/ui'
import { findBySlug, getPayloadClient } from '@/lib/payload'
import { getSettings } from '@/lib/site'
import { buildMetadata, jsonLd } from '@/lib/seo'
import { absoluteUrl } from '@/lib/format'
import type { Person, Topic } from '@/payload-types'
import type { Where } from 'payload'

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 60

const AFFIL: Record<string, string> = {
  team: 'Observatory team',
  partner: 'Partner',
  expert: 'Expert',
  contributor: 'Contributor',
  advisory: 'Advisory',
}

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'people',
    limit: 500,
    depth: 0,
    where: { _status: { equals: 'published' } },
  })
  return res.docs.map((d) => ({ slug: d.slug ?? '' })).filter((p) => p.slug)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const doc = await findBySlug<Person>(await getPayloadClient(), 'people', slug, 1)
  if (!doc) return {}
  return buildMetadata({
    title: doc.name,
    description: doc.summary,
    path: `/people/${slug}`,
    image: typeof doc.photo === 'object' ? doc.photo : null,
    seo: doc.seo,
  })
}

export default async function PersonPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const [doc, settings] = await Promise.all([
    findBySlug<Person>(payload, 'people', slug, 2),
    getSettings(),
  ])
  if (!doc) notFound()
  const show = Boolean(settings.showPrototypeNotices)
  const org = doc.organisation && typeof doc.organisation === 'object' ? doc.organisation : null

  // Everything this person is connected to. Reverse relationships resolved with one query per type.
  const published: Where = { _status: { equals: 'published' } }
  const pubWhere: Where = { and: [published, { authors: { equals: doc.id } }] }
  const ucWhere: Where = { and: [published, { people: { equals: doc.id } }] }
  const evWhere: Where = { and: [published, { speakers: { equals: doc.id } }] }
  const [publications, useCases, events, posts, opEds] = await Promise.all([
    payload.find({
      collection: 'publications',
      where: pubWhere,
      limit: 20,
      depth: 1,
      sort: '-publishedAt',
      overrideAccess: false,
    }),
    payload.find({
      collection: 'use-cases',
      where: ucWhere,
      limit: 20,
      depth: 1,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'events',
      where: evWhere,
      limit: 20,
      depth: 1,
      sort: '-startDate',
      overrideAccess: false,
    }),
    payload.find({
      collection: 'posts',
      where: pubWhere,
      limit: 20,
      depth: 1,
      sort: '-publishedAt',
      overrideAccess: false,
    }),
    payload.find({
      collection: 'op-eds',
      where: pubWhere,
      limit: 20,
      depth: 1,
      sort: '-publishedAt',
      overrideAccess: false,
    }),
  ])
  const groups = [
    { title: 'Publications', collection: 'publications' as const, docs: publications.docs },
    { title: 'Use cases', collection: 'use-cases' as const, docs: useCases.docs },
    { title: 'Events', collection: 'events' as const, docs: events.docs },
    { title: 'Blog', collection: 'posts' as const, docs: posts.docs },
    { title: 'Op-eds', collection: 'op-eds' as const, docs: opEds.docs },
  ].filter((g) => g.docs.length)

  return (
    <DetailPage
      path={`/people/${slug}`}
      crumbs={[{ href: '/directory', label: 'People and organisations' }, { label: doc.name }]}
      type={AFFIL[doc.affiliation] ?? 'Person'}
      title={doc.name}
      summary={doc.summary}
      provenance={doc.provenance}
      showNotices={show}
      doc={doc as unknown as Record<string, unknown>}
      aside={
        <>
          <div className="cluster" style={{ gap: 'var(--s-4)' }}>
            <Avatar name={doc.name} photo={typeof doc.photo === 'object' ? doc.photo : null} />
            <div>
              <strong>{doc.role}</strong>
              {org && (
                <div className="small">
                  <Link href={`/organisations/${org.slug}`}>{org.name}</Link>
                </div>
              )}
            </div>
          </div>
          <MetaList
            items={[
              Array.isArray(doc.expertise) &&
                doc.expertise.length > 0 && {
                  label: 'Expertise',
                  value: (
                    <span className="cluster" style={{ gap: 'var(--s-1)' }}>
                      {doc.expertise
                        .filter((t): t is Topic => typeof t === 'object')
                        .map((t) => (
                          <Link className="chip" key={t.id} href={`/topics/${t.slug}`}>
                            {t.name}
                          </Link>
                        ))}
                    </span>
                  ),
                },
              Array.isArray(doc.links) &&
                doc.links.length > 0 && { label: 'Links', value: <LinkList links={doc.links} /> },
            ]}
          />
        </>
      }
    >
      <JsonLd
        data={jsonLd.person({
          name: doc.name,
          url: absoluteUrl(`/people/${slug}`),
          jobTitle: doc.role,
          affiliation: org?.name,
        })}
      />
      <RichText data={doc.bio} serif />
      {groups.map((g) => (
        <section className="detail__block" key={g.title} aria-labelledby={`g-${g.collection}`}>
          <h2 id={`g-${g.collection}`}>{g.title}</h2>
          <ItemList>
            {g.docs.map((d) => (
              <li key={String(d.id)}>
                <Item collection={g.collection} doc={d as never} showNotices={show} compact />
              </li>
            ))}
          </ItemList>
        </section>
      ))}
    </DetailPage>
  )
}
