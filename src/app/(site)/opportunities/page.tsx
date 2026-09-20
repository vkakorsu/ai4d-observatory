import type { Metadata } from 'next'
import Link from 'next/link'
import { ListingPage, type PageProps } from '@/components/ListingPage'
import { Item } from '@/components/listing'
import { Icon } from '@/components/Icon'
import { Deadline } from '@/components/Deadline'
import { opportunityFilters } from '@/lib/filters'
import { getParam } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Opportunities',
  description: 'Fellowships, grants, calls for papers, programmes, jobs and competitions relevant to responsible AI in South and Southeast Asia.',
  alternates: { types: { 'application/rss+xml': '/feed/opportunities.xml' } },
}

export default async function OpportunitiesPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const showClosed = getParam(sp, 'closed') === '1'
  const today = new Date().toISOString().slice(0, 10)
  return (
    <ListingPage
      collection="opportunities"
      sp={sp}
      defs={opportunityFilters}
      action="/opportunities"
      kicker="Engage"
      title="Opportunities"
      lede="Funding, fellowships, calls and roles from the Observatory, its partners and the wider AI4D network. Deadlines are shown in the organiser’s stated date. Always confirm on the organiser’s page."
      noun="opportunity"
      sort={showClosed ? '-deadline' : 'deadline'}
      extraWhere={showClosed ? undefined : { or: [{ rolling: { equals: true } }, { deadline: { greater_than_equal: today } }, { deadline: { exists: false } }] }}
      extraControls={showClosed ? <input type="hidden" name="closed" value="1" /> : undefined}
      intro={
        <nav className="tabs" aria-label="Open or all">
          <Link href="/opportunities" aria-current={!showClosed ? 'page' : undefined}>
            Open
          </Link>
          <Link href="/opportunities?closed=1" aria-current={showClosed ? 'page' : undefined}>
            Including closed
          </Link>
        </nav>
      }
      renderItem={(doc, show) => (
        <Item
          collection="opportunities"
          doc={doc}
          showNotices={show}
          meta={
            <>
              <Deadline deadline={typeof doc.deadline === 'string' ? doc.deadline : null} rolling={Boolean(doc.rolling)} />
              {typeof doc.provider === 'string' && (
                <>
                  <span aria-hidden="true">·</span> <Icon name="people" size={14} /> {doc.provider}
                </>
              )}
            </>
          }
        />
      )}
      emptyTitle="No open opportunities right now"
    />
  )
}
