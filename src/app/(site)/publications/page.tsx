import type { Metadata } from 'next'
import Link from 'next/link'
import { ListingPage, type PageProps } from '@/components/ListingPage'
import { publicationFilters } from '@/lib/filters'
import { getParam } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Publications',
  description:
    'Reports, mapping studies, research briefs, policy briefs, innovation briefs and comparative analyses from the Asia AI4D Observatory and its partners.',
  alternates: { types: { 'application/rss+xml': '/feed/publications.xml' } },
}

const GROUPS = [
  { label: 'All', value: '' },
  { label: 'Reports and mapping studies', value: 'report,mapping-study,annual-report,comparative-analysis' },
  { label: 'Briefs', value: 'research-brief,policy-brief,innovation-brief' },
  { label: 'Toolkits', value: 'toolkit' },
]

export default async function PublicationsPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const current = getParam(sp, 'type') ?? ''
  return (
    <ListingPage
      collection="publications"
      sp={sp}
      defs={publicationFilters}
      action="/publications"
      kicker="Repository"
      title="Publications"
      lede="Mapping studies on the six ecosystem enablers, benchmarking of AI indices, research and policy briefs, innovation briefs and comparative analyses. Downloads are open unless a partner requires an email address."
      noun="publication"
      cover
      intro={
        <nav className="tabs" aria-label="Publication group">
          {GROUPS.map((g) => (
            <Link key={g.value} href={g.value ? `/publications?type=${g.value}` : '/publications'} aria-current={current === g.value ? 'page' : undefined}>
              {g.label}
            </Link>
          ))}
        </nav>
      }
    />
  )
}
