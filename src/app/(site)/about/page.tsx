import type { Metadata } from 'next'
import Link from '@/components/SmartLink'
import { notFound } from 'next/navigation'
import { RichText } from '@/components/RichText'
import {
  Avatar,
  Breadcrumbs,
  PageHeader,
  PendingBadge,
  ProvenanceBadge,
  Section,
} from '@/components/ui'
import { Icon } from '@/components/Icon'
import { findBySlug, getPayloadClient } from '@/lib/payload'
import { getSettings } from '@/lib/site'
import { buildMetadata } from '@/lib/seo'
import type { Page } from '@/payload-types'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const doc = await findBySlug<Page>(await getPayloadClient(), 'pages', 'about', 0)
  return buildMetadata({
    title: doc?.title ?? 'About',
    description: doc?.summary,
    path: '/about',
    seo: doc?.seo,
  })
}

export default async function AboutPage() {
  const payload = await getPayloadClient()
  const [doc, settings, team, partners] = await Promise.all([
    findBySlug<Page>(payload, 'pages', 'about', 1),
    getSettings(),
    payload.find({
      collection: 'people',
      where: { and: [{ _status: { equals: 'published' } }, { affiliation: { equals: 'team' } }] },
      sort: 'name',
      limit: 50,
      depth: 1,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'organisations',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { observatoryRole: { in: ['lead', 'partner', 'funder'] } },
        ],
      },
      sort: 'name',
      limit: 50,
      depth: 1,
      overrideAccess: false,
    }),
  ])
  if (!doc) notFound()
  const show = Boolean(settings.showPrototypeNotices)

  return (
    <div className="container">
      <Breadcrumbs items={[{ label: 'About' }]} />
      <PageHeader kicker="About the Observatory" title={doc.title} lede={doc.summary} />
      <div className="detail">
        <article>
          {show && (
            <p className="small">
              <ProvenanceBadge provenance={doc.provenance} show={show} /> Copy on this page is drawn
              from LIRNEasia’s public description of the Observatory and is a placeholder for the
              Client’s own text.
            </p>
          )}
          <RichText data={doc.body} serif />
        </article>
        <aside className="detail__aside">
          <nav className="panel" aria-label="About section">
            <h2 style={{ fontSize: 'var(--step-2)' }}>In this section</h2>
            <ul className="related-list">
              <li>
                <Link href="/about/partners">Partners and funders</Link>
              </li>
              <li>
                <Link href="/about#team">Team</Link>
              </li>
              <li>
                <Link href="/accessibility">Accessibility statement</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy</Link>
              </li>
              <li>
                <Link href="/prototype-notes">Prototype notes</Link>
              </li>
            </ul>
          </nav>
          <div className="panel panel--tint">
            <h2 style={{ fontSize: 'var(--step-2)' }}>Contact</h2>
            <p className="small" style={{ margin: 0 }}>
              {settings.contactEmail ? (
                <a href={`mailto:${settings.contactEmail}`}>
                  <Icon name="mail" size={14} /> {settings.contactEmail}
                </a>
              ) : (
                <>
                  <PendingBadge>Pending client input</PendingBadge> Contact address to be set in
                  Site settings.
                </>
              )}
            </p>
          </div>
        </aside>
      </div>

      <Section
        id="partners"
        title="Led by LIRNEasia with partners"
        more={{ href: '/about/partners', label: 'Partners and funders' }}
      >
        <div className="card-grid">
          {partners.docs.map((o) => (
            <Link className="pcard" href={`/organisations/${o.slug}`} key={o.id}>
              <Avatar
                name={o.acronym ?? o.name}
                photo={typeof o.logo === 'object' ? o.logo : null}
                org
              />
              <span>
                <span className="pcard__name">{o.name}</span>
                <span className="pcard__role" style={{ display: 'block' }}>
                  {o.observatoryRole === 'lead'
                    ? 'Lead organisation'
                    : o.observatoryRole === 'funder'
                      ? 'Funder'
                      : 'Consortium partner'}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section id="team" title="Team">
        {team.docs.length === 0 ? (
          <p className="muted">
            <PendingBadge>Pending client input</PendingBadge> Team profiles are added by editors as
            People with the affiliation “Observatory team”.
          </p>
        ) : (
          <div className="card-grid">
            {team.docs.map((p) => (
              <Link className="pcard" href={`/people/${p.slug}`} key={p.id}>
                <Avatar name={p.name} photo={typeof p.photo === 'object' ? p.photo : null} />
                <span>
                  <span className="pcard__name">{p.name}</span>
                  <span className="pcard__role" style={{ display: 'block' }}>
                    {p.role}
                  </span>
                  <span className="pcard__meta" style={{ display: 'block' }}>
                    <ProvenanceBadge provenance={p.provenance} show={show} />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </div>
  )
}
