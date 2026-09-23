import type { Metadata } from 'next'
import Link from '@/components/SmartLink'
import { notFound } from 'next/navigation'
import { DetailPage } from '@/components/DetailPage'
import { RichText } from '@/components/RichText'
import { Item, ItemList } from '@/components/listing'
import { Avatar, ExternalLink, JsonLd, MetaList } from '@/components/ui'
import { findBySlug, getPayloadClient } from '@/lib/payload'
import { getSettings } from '@/lib/site'
import { buildMetadata, jsonLd } from '@/lib/seo'
import { absoluteUrl } from '@/lib/format'
import type { Organisation } from '@/payload-types'

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 60

const ROLE: Record<string, string> = {
  lead: 'Lead organisation',
  partner: 'Consortium partner',
  funder: 'Funder',
  member: 'Network member',
  profiled: 'Profiled organisation',
}

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'organisations',
    limit: 500,
    depth: 0,
    where: { _status: { equals: 'published' } },
  })
  return res.docs.map((d) => ({ slug: d.slug ?? '' })).filter((p) => p.slug)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const doc = await findBySlug<Organisation>(await getPayloadClient(), 'organisations', slug, 1)
  if (!doc) return {}
  return buildMetadata({
    title: doc.name,
    description: doc.summary,
    path: `/organisations/${slug}`,
    seo: doc.seo,
  })
}

export default async function OrganisationPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const [doc, settings] = await Promise.all([
    findBySlug<Organisation>(payload, 'organisations', slug, 2),
    getSettings(),
  ])
  if (!doc) notFound()
  const show = Boolean(settings.showPrototypeNotices)
  const st =
    doc.stakeholderType && typeof doc.stakeholderType === 'object' ? doc.stakeholderType : null
  const published = { _status: { equals: 'published' } }
  const [people, useCases, publications, events] = await Promise.all([
    payload.find({
      collection: 'people',
      where: { and: [published, { organisation: { equals: doc.id } }] },
      limit: 30,
      depth: 0,
      sort: 'name',
      overrideAccess: false,
    }),
    payload.find({
      collection: 'use-cases',
      where: { and: [published, { organisations: { equals: doc.id } }] },
      limit: 20,
      depth: 1,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'publications',
      where: { and: [published, { organisations: { equals: doc.id } }] },
      limit: 20,
      depth: 1,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'events',
      where: { and: [published, { organisations: { equals: doc.id } }] },
      limit: 20,
      depth: 1,
      sort: '-startDate',
      overrideAccess: false,
    }),
  ])
  const groups = [
    { title: 'Use cases', collection: 'use-cases' as const, docs: useCases.docs },
    { title: 'Publications', collection: 'publications' as const, docs: publications.docs },
    { title: 'Events', collection: 'events' as const, docs: events.docs },
  ].filter((g) => g.docs.length)

  return (
    <DetailPage
      path={`/organisations/${slug}`}
      crumbs={[
        { href: '/directory?view=organisations', label: 'Organisations' },
        { label: doc.name },
      ]}
      type={st?.name ?? 'Organisation'}
      title={doc.name}
      summary={doc.summary}
      provenance={doc.provenance}
      showNotices={show}
      doc={doc as unknown as Record<string, unknown>}
      aside={
        <>
          <div className="cluster" style={{ gap: 'var(--s-4)' }}>
            <Avatar
              name={doc.acronym ?? doc.name}
              photo={typeof doc.logo === 'object' ? doc.logo : null}
              org
            />
            <div>
              <strong>{doc.acronym ?? doc.name}</strong>
              {doc.website && (
                <div className="small">
                  <ExternalLink href={doc.website}>
                    {doc.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </ExternalLink>
                </div>
              )}
            </div>
          </div>
          <MetaList
            items={[
              st && {
                label: 'Stakeholder type',
                value: (
                  <Link href={`/directory?view=organisations&stakeholder=${st.slug}`}>
                    {st.name}
                  </Link>
                ),
              },
              doc.observatoryRole && {
                label: 'Role in the Observatory',
                value: ROLE[doc.observatoryRole] ?? doc.observatoryRole,
              },
              people.docs.length > 0 && {
                label: 'People',
                value: (
                  <ul className="related-list">
                    {people.docs.map((p) => (
                      <li key={p.id}>
                        <Link href={`/people/${p.slug}`}>{p.name}</Link>
                        {p.role && <span className="tiny muted">{p.role}</span>}
                      </li>
                    ))}
                  </ul>
                ),
              },
            ]}
          />
        </>
      }
    >
      <JsonLd
        data={jsonLd.organisation(doc.name, doc.website ?? absoluteUrl(`/organisations/${slug}`))}
      />
      <RichText data={doc.description} serif />
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
