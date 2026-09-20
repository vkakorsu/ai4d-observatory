import type { Metadata } from 'next'
import Link from 'next/link'
import { ActiveFilters, Filters, Pagination, ResultsHead } from '@/components/listing'
import type { PageProps } from '@/components/ListingPage'
import { Avatar, Breadcrumbs, Empty, PageHeader, ProvenanceBadge } from '@/components/ui'
import { getPayloadClient } from '@/lib/payload'
import { filterOptions, getSettings, listCollection } from '@/lib/site'
import { organisationFilters, peopleFilters } from '@/lib/filters'
import { getParam } from '@/lib/queries'
import type { Organisation, Person } from '@/payload-types'

export const metadata: Metadata = {
  title: 'People and organisations',
  description:
    'Directory of the Observatory team, partners, experts and contributors, and of government, private sector, civil society, research and international organisations working on responsible AI in Asia.',
  alternates: { types: { 'application/rss+xml': '/feed/people.xml' } },
}

export default async function DirectoryPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const view = getParam(sp, 'view') === 'organisations' ? 'organisations' : 'people'
  const action = '/directory'
  const defs = view === 'people' ? peopleFilters : organisationFilters
  const payload = await getPayloadClient()
  const [settings, options, result] = await Promise.all([
    getSettings(),
    filterOptions(payload, defs),
    listCollection<Person | Organisation>(payload, view, sp, defs, {
      sort: 'name',
      textFields: ['name', 'summary', 'role'].filter((f) => view === 'people' || f !== 'role'),
      limit: 24,
    }),
  ])
  const show = Boolean(settings.showPrototypeNotices)
  const spWithView = { ...sp, view }

  return (
    <div className="container">
      <Breadcrumbs items={[{ label: 'People and organisations' }]} />
      <PageHeader
        kicker="Directory"
        title="People and organisations"
        lede="Who is working on responsible AI for development across South and Southeast Asia. Organisations are categorised by stakeholder type. People are linked to the publications, use cases and events they are part of."
      />
      <nav className="tabs" aria-label="Directory view">
        <Link href={action} aria-current={view === 'people' ? 'page' : undefined}>
          People
        </Link>
        <Link href={`${action}?view=organisations`} aria-current={view === 'organisations' ? 'page' : undefined}>
          Organisations
        </Link>
      </nav>
      <div className="layout-rail">
        <aside className="rail" aria-label="Filter results">
          <Filters defs={defs} options={options} sp={spWithView} action={action} searchLabel="Search by name" extra={<input type="hidden" name="view" value={view} />} />
        </aside>
        <div>
          <ResultsHead total={result.totalDocs} noun={view === 'people' ? 'person' : 'organisation'} />
          <ActiveFilters defs={defs} options={options} sp={spWithView} action={view === 'organisations' ? `${action}?view=organisations` : action} />
          {result.docs.length === 0 ? (
            <Empty title="No matches">
              <p>Try a different name or remove a filter.</p>
            </Empty>
          ) : view === 'people' ? (
            <div className="card-grid" style={{ marginTop: 'var(--s-4)' }}>
              {(result.docs as Person[]).map((p) => {
                const org = p.organisation && typeof p.organisation === 'object' ? p.organisation : null
                return (
                  <Link className="pcard" href={`/people/${p.slug}`} key={p.id}>
                    <Avatar name={p.name} photo={typeof p.photo === 'object' ? p.photo : null} />
                    <span>
                      <span className="pcard__name">{p.name}</span>
                      <span className="pcard__role" style={{ display: 'block' }}>
                        {p.role}
                        {org ? `, ${org.acronym ?? org.name}` : ''}
                      </span>
                      <span className="pcard__meta" style={{ display: 'block' }}>
                        {AFFIL[p.affiliation] ?? p.affiliation} <ProvenanceBadge provenance={p.provenance} show={show} />
                      </span>
                    </span>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="card-grid" style={{ marginTop: 'var(--s-4)' }}>
              {(result.docs as Organisation[]).map((o) => {
                const st = o.stakeholderType && typeof o.stakeholderType === 'object' ? o.stakeholderType.name : ''
                const countries = Array.isArray(o.countries) ? o.countries.filter((c) => typeof c === 'object').map((c) => (c as { name: string }).name) : []
                return (
                  <Link className="pcard" href={`/organisations/${o.slug}`} key={o.id}>
                    <Avatar name={o.acronym ?? o.name} photo={typeof o.logo === 'object' ? o.logo : null} org />
                    <span>
                      <span className="pcard__name">{o.name}</span>
                      <span className="pcard__role" style={{ display: 'block' }}>
                        {st}
                      </span>
                      <span className="pcard__meta" style={{ display: 'block' }}>
                        {countries.slice(0, 3).join(', ')}
                        {countries.length > 3 ? ` +${countries.length - 3}` : ''} <ProvenanceBadge provenance={o.provenance} show={show} />
                      </span>
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
          <Pagination page={result.page} totalPages={result.totalPages} sp={spWithView} action={action} />
        </div>
      </div>
    </div>
  )
}

const AFFIL: Record<string, string> = {
  team: 'Observatory team',
  partner: 'Partner',
  expert: 'Expert',
  contributor: 'Contributor',
  advisory: 'Advisory',
}
