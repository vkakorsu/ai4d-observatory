import type { Metadata } from 'next'
import Link from 'next/link'
import { Avatar, Breadcrumbs, ExternalLink, PageHeader, PendingBadge, Section } from '@/components/ui'
import { getPayloadClient } from '@/lib/payload'
import { getSettings } from '@/lib/site'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Partners and funders',
  description: 'The organisations that lead, deliver and fund the Asia AI4D Observatory.',
}

const ROLE_ORDER = ['lead', 'partner', 'funder', 'member'] as const
const ROLE_LABEL: Record<string, string> = { lead: 'Lead organisation', partner: 'Consortium partners', funder: 'Funders', member: 'Network members' }

export default async function PartnersPage() {
  const payload = await getPayloadClient()
  const [settings, orgs] = await Promise.all([
    getSettings(),
    payload.find({ collection: 'organisations', where: { and: [{ _status: { equals: 'published' } }, { observatoryRole: { in: [...ROLE_ORDER] } }] }, limit: 100, depth: 1, sort: 'name', overrideAccess: false }),
  ])
  const show = Boolean(settings.showPrototypeNotices)
  return (
    <div className="container">
      <Breadcrumbs items={[{ href: '/about', label: 'About' }, { label: 'Partners and funders' }]} />
      <PageHeader kicker="About the Observatory" title="Partners and funders" lede={settings.programmeNote ?? undefined} />
      {show && (
        <p className="small">
          <PendingBadge>Pending client assets</PendingBadge> Logos and approved descriptions replace the text marks once the Client supplies
          brand assets and usage rules for each organisation.
        </p>
      )}
      {ROLE_ORDER.map((role) => {
        const list = orgs.docs.filter((o) => o.observatoryRole === role)
        if (!list.length) return null
        return (
          <Section key={role} id={role} title={ROLE_LABEL[role]}>
            <div className="card-grid card-grid--2">
              {list.map((o) => (
                <article className="pcard" key={o.id} style={{ gridTemplateColumns: '3.25rem 1fr' }}>
                  <Avatar name={o.acronym ?? o.name} photo={typeof o.logo === 'object' ? o.logo : null} org />
                  <div>
                    <h3 className="pcard__name">
                      <Link href={`/organisations/${o.slug}`}>{o.name}</Link>
                    </h3>
                    <p className="pcard__role">{o.summary}</p>
                    {o.website && (
                      <p className="pcard__meta">
                        <ExternalLink href={o.website}>{o.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</ExternalLink>
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </Section>
        )
      })}
    </div>
  )
}
