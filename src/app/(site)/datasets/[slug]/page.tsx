import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DetailPage } from '@/components/DetailPage'
import { RichText } from '@/components/RichText'
import { DownloadBox, RelatedList } from '@/components/content'
import { JsonLd, MetaList } from '@/components/ui'
import { TrackLink } from '@/components/TrackLink'
import { Icon } from '@/components/Icon'
import { findBySlug, getPayloadClient } from '@/lib/payload'
import { getSettings, relatedContent } from '@/lib/site'
import { buildMetadata, jsonLd } from '@/lib/seo'
import { absoluteUrl } from '@/lib/format'
import type { Dataset, Indicator } from '@/payload-types'

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 60

const LICENCES: Record<string, { label: string; url?: string }> = {
  'cc-by-4': { label: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' },
  'cc-by-sa-4': { label: 'CC BY-SA 4.0', url: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  cc0: { label: 'CC0 1.0', url: 'https://creativecommons.org/publicdomain/zero/1.0/' },
  odc: { label: 'Open Data Commons' },
  restricted: { label: 'Restricted. See notes' },
  other: { label: 'Other. See notes' },
}

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'datasets', limit: 500, depth: 0, where: { _status: { equals: 'published' } } })
  return res.docs.map((d) => ({ slug: d.slug ?? '' })).filter((p) => p.slug)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const doc = await findBySlug<Dataset>(await getPayloadClient(), 'datasets', slug, 1)
  if (!doc) return {}
  return buildMetadata({ title: doc.title, description: doc.summary, path: `/datasets/${slug}`, seo: doc.seo })
}

export default async function DatasetPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const [doc, settings] = await Promise.all([findBySlug<Dataset>(payload, 'datasets', slug, 2), getSettings()])
  if (!doc) notFound()
  const show = Boolean(settings.showPrototypeNotices)
  const related = await relatedContent(payload, doc as unknown as Record<string, unknown>, { collection: 'datasets', id: doc.id })
  const licence = doc.licence ? LICENCES[doc.licence] : null
  const indicators = Array.isArray(doc.indicators) ? doc.indicators.filter((i): i is Indicator => typeof i === 'object') : []
  const path = `/datasets/${slug}`

  return (
    <DetailPage
      crumbs={[{ href: '/datasets', label: 'Datasets' }, { label: doc.title }]}
      type="Dataset"
      title={doc.title}
      summary={doc.summary}
      date={doc.publishedAt}
      provenance={doc.provenance}
      showNotices={show}
      doc={doc as unknown as Record<string, unknown>}
      aside={
        <>
          {(doc.files ?? []).map((f) => (
            <DownloadBox
              key={f.id ?? f.label}
              file={f.file}
              resourceTitle={`${doc.title}. ${f.label}`}
              resourceUrl={path}
              consentText={settings.downloadConsentText}
              label={f.label}
            />
          ))}
          {doc.accessLinks && doc.accessLinks.length > 0 && (
            <div className="download-box">
              <h2>
                <Icon name="external" size={16} /> Access
              </h2>
              <ul className="related-list">
                {doc.accessLinks.map((l) => (
                  <li key={l.id ?? l.url}>
                    <TrackLink href={l.url} event="dataset_access" data={{ resource: doc.title, label: l.label }} rel="noopener noreferrer">
                      {l.label} <Icon name="external" size={12} />
                    </TrackLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <MetaList
            items={[
              { label: 'Source', value: doc.source },
              doc.temporalCoverage && { label: 'Temporal coverage', value: doc.temporalCoverage },
              doc.updateFrequency && { label: 'Update frequency', value: doc.updateFrequency },
              licence && {
                label: 'Licence',
                value: licence.url ? <a href={licence.url}>{licence.label}</a> : licence.label,
              },
              indicators.length > 0 && {
                label: 'Indicators derived',
                value: (
                  <ul className="related-list">
                    {indicators.map((i) => (
                      <li key={i.id}>
                        <Link href={`/data/${i.slug}`}>{i.name}</Link>
                      </li>
                    ))}
                  </ul>
                ),
              },
            ]}
          />
          <RelatedList items={related} />
        </>
      }
    >
      <JsonLd
        data={jsonLd.dataset({
          title: doc.title,
          description: doc.summary,
          url: absoluteUrl(path),
          creator: doc.source,
          license: licence?.url,
          temporalCoverage: doc.temporalCoverage ?? undefined,
        })}
      />
      <RichText data={doc.description} serif />
      {doc.methodNotes && (
        <section className="detail__block" aria-labelledby="method-h">
          <h2 id="method-h">Method and caveats</h2>
          <p className="prose">{doc.methodNotes}</p>
        </section>
      )}
    </DetailPage>
  )
}
