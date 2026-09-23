import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { HeroImage } from '@/components/ArtCover'
import { DetailPage } from '@/components/DetailPage'
import { RichText } from '@/components/RichText'
import { Facts, LinkList, OrgLinks, PeopleLinks, RelatedList } from '@/components/content'
import { JsonLd, MetaList } from '@/components/ui'
import { findBySlug, getPayloadClient } from '@/lib/payload'
import { getSettings, relatedContent } from '@/lib/site'
import { buildMetadata, jsonLd } from '@/lib/seo'
import { absoluteUrl } from '@/lib/format'
import type { UseCase } from '@/payload-types'

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 60

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'use-cases',
    limit: 500,
    depth: 0,
    where: { _status: { equals: 'published' } },
  })
  return res.docs.map((d) => ({ slug: d.slug ?? '' })).filter((p) => p.slug)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const doc = await findBySlug<UseCase>(await getPayloadClient(), 'use-cases', slug, 1)
  if (!doc) return {}
  return buildMetadata({
    title: doc.title,
    description: doc.summary,
    path: `/use-cases/${slug}`,
    type: 'article',
    image: typeof doc.image === 'object' ? doc.image : null,
    seo: doc.seo,
    publishedAt: doc.publishedAt,
  })
}

const STAGE: Record<string, string> = {
  concept: 'Concept',
  pilot: 'Pilot',
  deployed: 'Deployed',
  scaled: 'Scaled',
  discontinued: 'Discontinued',
}

export default async function UseCasePage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const [doc, settings] = await Promise.all([
    findBySlug<UseCase>(payload, 'use-cases', slug, 2),
    getSettings(),
  ])
  if (!doc) notFound()
  const show = Boolean(settings.showPrototypeNotices)
  const related = await relatedContent(payload, doc as unknown as Record<string, unknown>, {
    collection: 'use-cases',
    id: doc.id,
  })
  const image = typeof doc.image === 'object' ? doc.image : null

  return (
    <DetailPage
      path={`/use-cases/${slug}`}
      crumbs={[{ href: '/use-cases', label: 'Use cases' }, { label: doc.title }]}
      type="Use case"
      title={doc.title}
      summary={doc.summary}
      date={doc.publishedAt}
      provenance={doc.provenance}
      showNotices={show}
      doc={doc as unknown as Record<string, unknown>}
      aside={
        <>
          <MetaList
            items={[
              { label: 'Stage', value: STAGE[doc.stage] ?? doc.stage },
              doc.yearStarted && { label: 'Started', value: doc.yearStarted },
              Array.isArray(doc.organisations) &&
                doc.organisations.length > 0 && {
                  label: 'Organisations',
                  value: <OrgLinks orgs={doc.organisations} />,
                },
              Array.isArray(doc.people) &&
                doc.people.length > 0 && {
                  label: 'People',
                  value: <PeopleLinks people={doc.people} />,
                },
              Array.isArray(doc.links) &&
                doc.links.length > 0 && { label: 'Links', value: <LinkList links={doc.links} /> },
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
          url: absoluteUrl(`/use-cases/${slug}`),
          datePublished: doc.publishedAt,
        })}
      />
      <HeroImage image={image} seed={`use-cases:${slug}`} label="Use case" />
      <Facts
        items={[
          doc.problem && {
            label: 'Development problem',
            value: (
              <span style={{ fontSize: 'var(--step-1)', fontFamily: 'var(--font-text)' }}>
                {doc.problem}
              </span>
            ),
          },
          doc.responsibleAiPractices && {
            label: 'Responsible AI practices',
            value: (
              <span style={{ fontSize: 'var(--step-1)', fontFamily: 'var(--font-text)' }}>
                {doc.responsibleAiPractices}
              </span>
            ),
          },
          doc.evidenceOfImpact && {
            label: 'Evidence of impact',
            value: (
              <span style={{ fontSize: 'var(--step-1)', fontFamily: 'var(--font-text)' }}>
                {doc.evidenceOfImpact}
              </span>
            ),
          },
        ]}
      />
      <RichText data={doc.body} serif />
    </DetailPage>
  )
}
