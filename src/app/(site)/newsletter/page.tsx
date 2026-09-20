import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs, PageHeader, PendingBadge, ProvenanceBadge, Section } from '@/components/ui'
import { SubscribeForm } from '@/components/forms/SubscribeForm'
import { Icon } from '@/components/Icon'
import { getPayloadClient } from '@/lib/payload'
import { getSettings } from '@/lib/site'
import { formatDate } from '@/lib/format'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Newsletter',
  description: 'Subscribe to the Asia AI4D Observatory quarterly newsletter and read past issues.',
  alternates: { types: { 'application/rss+xml': '/feed/newsletters.xml' } },
}

export default async function NewsletterPage() {
  const payload = await getPayloadClient()
  const [settings, issues] = await Promise.all([
    getSettings(),
    payload.find({ collection: 'newsletters', where: { _status: { equals: 'published' } }, sort: '-issueNumber', limit: 100, depth: 0, overrideAccess: false }),
  ])
  const show = Boolean(settings.showPrototypeNotices)
  const provider = process.env.NEWSLETTER_PROVIDER || 'local'

  return (
    <div className="container">
      <Breadcrumbs items={[{ label: 'Newsletter' }]} />
      <PageHeader
        kicker="Engage"
        title="Newsletter"
        lede="A quarterly digest of new use cases, mapping studies, data releases, events and opportunities from across South and Southeast Asia."
        split
        aside={
          <div className="panel">
            <SubscribeForm consentText={settings.newsletterConsentText} source="newsletter" />
            {show && (
              <p className="tiny muted" style={{ marginTop: 'var(--s-3)', marginBottom: 0 }}>
                <PendingBadge>Pending client account</PendingBadge> Subscriptions are stored in the CMS
                {provider === 'local' ? ' and will also sync to the Client’s email service once its credentials are configured.' : ` and synced to ${provider}.`}
              </p>
            )}
          </div>
        }
      />
      <Section title="Past issues" id="issues">
        {issues.docs.length === 0 ? (
          <div className="empty">
            <h2>No issues yet</h2>
            <p>The first issue will appear here after it is sent.</p>
          </div>
        ) : (
          <ul className="item-list">
            {issues.docs.map((n) => (
              <li key={n.id}>
                <article className="item">
                  <div className="item__type">
                    <Icon name="mail" size={14} /> Issue {n.issueNumber}
                    {n.publishedAt && <time dateTime={n.publishedAt}>{formatDate(n.publishedAt)}</time>}
                    <ProvenanceBadge provenance={n.provenance} show={show} />
                  </div>
                  <h3 className="item__title">
                    <Link href={`/newsletter/${n.slug}`}>{n.title}</Link>
                  </h3>
                  <p className="item__summary">{n.summary}</p>
                </article>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  )
}
