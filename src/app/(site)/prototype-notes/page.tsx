import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs, PageHeader, PendingBadge, Section } from '@/components/ui'
import { getPayloadClient } from '@/lib/payload'
import { countPublished, getSettings } from '@/lib/site'
import { RFP_MODULES, contentTypeList } from '@/lib/content-types'
import { selectProvider } from '@/lib/newsletter'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'Prototype notes. What is functional, what is illustrative, what waits on the Client',
  description: 'How to read this prototype. The boundary between decided and undecided, and the status of every module in Section 3.1.2 of the RFP.',
  robots: { index: false, follow: false },
}

/**
 * The RFP asks bidders to "clearly indicate which elements are illustrative and which are proposed as functional".
 * This page states that boundary in the product itself and reads live configuration so it cannot drift from reality.
 */
export default async function PrototypeNotesPage() {
  const payload = await getPayloadClient()
  const settings = await getSettings()
  const counts = await countPublished(
    payload,
    contentTypeList.map((t) => t.collection),
  )
  const newsletter = selectProvider()
  const analytics = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER || 'none'
  const db = (process.env.DATABASE_URI || 'file:./data/ai4d.db').startsWith('postgres') ? 'PostgreSQL' : 'SQLite (development and evaluation)'
  const storage = process.env.MEDIA_STORAGE === 'vercel-blob' ? 'Vercel Blob' : 'Local disk'

  const moduleRows = RFP_MODULES.map((m) => {
    const types = contentTypeList.filter((t) => t.rfpModule === m || (m.startsWith('Reports') && t.collection === 'publications') || (m.startsWith('Research briefs') && t.collection === 'publications'))
    const total = types.reduce((n, t) => n + (counts[t.collection] ?? 0), 0)
    const listing = types[0]?.listing ?? '/'
    return { module: m, types, total, listing }
  })

  return (
    <div className="container">
      <Breadcrumbs items={[{ label: 'Prototype notes' }]} />
      <PageHeader
        kicker="For evaluators"
        title="How to read this prototype"
        lede="Everything on this site is working software on the stack proposed in the Technical Proposal. Content is representative sample content, labelled as such. Three kinds of thing are deliberately left open because they need the Client."
      />

      <Section flush title="Live configuration" id="config">
        <div className="table-wrap">
          <table className="status-table">
            <thead>
              <tr>
                <th scope="col">Integration point</th>
                <th scope="col">State on this deployment</th>
                <th scope="col">What changes it</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Database</td>
                <td>{db}</td>
                <td>
                  <code>DATABASE_URI</code>. Production uses PostgreSQL on the Client’s server.
                </td>
              </tr>
              <tr>
                <td>Media storage</td>
                <td>{storage}</td>
                <td>
                  <code>MEDIA_STORAGE</code>. Production uses local disk or S3-compatible storage on the Client’s server.
                </td>
              </tr>
              <tr>
                <td>Newsletter service</td>
                <td>
                  {newsletter.name === 'local' ? (
                    <>
                      Local store only <PendingBadge>Pending client account</PendingBadge>
                    </>
                  ) : (
                    `${newsletter.name} (connected)`
                  )}
                </td>
                <td>
                  <code>NEWSLETTER_PROVIDER</code> plus the Client’s API key. Brevo and Mailchimp adapters are implemented. Subscribers are
                  always stored in the CMS as well.
                </td>
              </tr>
              <tr>
                <td>Analytics</td>
                <td>
                  {analytics === 'none' ? (
                    <>
                      Events logged to console only <PendingBadge>Pending client property</PendingBadge>
                    </>
                  ) : (
                    `${analytics} (connected)`
                  )}
                </td>
                <td>
                  <code>NEXT_PUBLIC_ANALYTICS_PROVIDER</code>. Umami (self-hosted, no cookies) and GA4 adapters are implemented. Download,
                  subscribe, register and search events already fire.
                </td>
              </tr>
              <tr>
                <td>Sample content labels</td>
                <td>{settings.showPrototypeNotices ? 'On' : 'Off'}</td>
                <td>Site settings in the CMS. Turn off when real content is loaded.</td>
              </tr>
              <tr>
                <td>Brand assets</td>
                <td>
                  Typographic wordmark and text marks for funders <PendingBadge>Pending client assets</PendingBadge>
                </td>
                <td>Logos are uploaded in Site settings and on each organisation record.</td>
              </tr>
              <tr>
                <td>Languages</td>
                <td>English</td>
                <td>
                  One entry in <code>localization.locales</code> plus per-field <code>localized</code> flags adds a language without a
                  redesign.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Module coverage against Section 3.1.2 of the RFP" id="modules">
        <div className="table-wrap">
          <table className="status-table">
            <thead>
              <tr>
                <th scope="col">Module in the RFP</th>
                <th scope="col">Content type(s)</th>
                <th scope="col" className="num">
                  Sample items
                </th>
                <th scope="col">Where</th>
              </tr>
            </thead>
            <tbody>
              {moduleRows.map((r) => (
                <tr key={r.module}>
                  <td>{r.module}</td>
                  <td>{r.types.map((t) => t.plural).join(', ') || 'Site pages'}</td>
                  <td className="num">{r.total}</td>
                  <td>
                    <Link href={r.listing}>{r.listing}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Functional or illustrative" id="boundary">
        <ul className="decisions">
          <li>
            <span className="q">Functional. Content model, search, filters, related content, hub pages, sitemap, RSS (site-wide and per content type), JSON-LD.</span>
            <span className="a">
              All served from the CMS database. Every filtered view is a shareable URL. Search runs on the unified index maintained by the CMS
              on every save. <Link href="/search?q=health">Try a search</Link>.
            </span>
          </li>
          <li>
            <span className="q">Functional. Email-gated downloads.</span>
            <span className="a">
              The form validates, records the request (exportable as CSV in the CMS), and issues a signed link that expires after 30 minutes.
              The public file endpoint refuses gated files. Try a gated item under <Link href="/publications">Publications</Link>.
            </span>
          </li>
          <li>
            <span className="q">Functional. Newsletter sign-up and event registration.</span>
            <span className="a">
              Both store records with the consent text and version they were shown, with a honeypot and rate limiting. The newsletter form also
              calls the configured provider adapter. A nightly job deletes download and registration records older than the retention period
              in Site settings, so the <Link href="/privacy">privacy notice</Link> and the database agree.
            </span>
          </li>
          <li>
            <span className="q">Functional. Accessibility.</span>
            <span className="a">
              Skip link, landmarks, visible focus, keyboard-operable filters and forms, reduced motion, text alternatives for every map and
              chart. <code>pnpm a11y</code> in the repository runs axe-core over thirty page types and reports zero violations. Manual testing
              with NVDA and VoiceOver is part of the work plan, not a claim made here.
            </span>
          </li>
          <li>
            <span className="q">Functional. Maps, charts and tables.</span>
            <span className="a">
              Server-rendered SVG from indicator values in the CMS. Legend, plain-language summary, ranked chart, sortable table with trend
              lines, and a CSV export for every indicator and year. No tile service and no client map library.
            </span>
          </li>
          <li>
            <span className="q">Functional. CMS with roles, drafts, versions, scheduled publishing, unpublish, archive and export.</span>
            <span className="a">
              At <code>/admin</code>. Administrator, Editor and Contributor roles. Unpublish reverts an item to draft; archive moves it to a
              restorable Trash with its history intact. Every list view has an Export button (CSV or JSON, chosen columns), including the
              download, subscriber and registration records. Evaluators can request editor access from the bidder.
            </span>
          </li>
          <li>
            <span className="q">Illustrative. All content, indicator values, people and organisation profiles marked “Sample content”.</span>
            <span className="a">
              Titles, countries, sectors and enablers are drawn from the Observatory’s public description so the structure can be judged.
              Nothing here is presented as Observatory output. Items marked “Public record” carry facts from public sources, for example
              partner organisations.
            </span>
          </li>
          <li>
            <span className="q">Illustrative. The visual identity.</span>
            <span className="a">
              A proposed direction. The wordmark, palette and type are documented in DESIGN.md and will be refined with the Client in weeks 2
              and 3 of the work plan.
            </span>
          </li>
          <li>
            <span className="q">Open. Reserved for requirements refinement (Section 3.1.1 a).</span>
            <span className="a">
              Priority audiences and their order on the home page. Final country list. Final taxonomy terms. Branding sign-off. Each is
              editable in the CMS and marked “Pending” in the interface.
            </span>
          </li>
        </ul>
      </Section>

      <Section title="Where the code is" id="code">
        <p className="measure">
          The repository contains the content model (<code>src/collections</code>), the filter and search logic (<code>src/lib</code>), the
          gated download mechanism (<code>src/lib/gate.ts</code>, <code>src/endpoints/forms.ts</code>), the map rendering (
          <code>src/lib/geo.ts</code>), the design tokens (<code>src/styles/tokens.css</code>) and tests (<code>tests/</code>). The
          documentation package is started in the same repository: README, DEPLOY, the content model, a draft editor guide and the
          third-party register (<code>docs/</code>). The public repository URL is in the Technical Proposal.
        </p>
      </Section>
    </div>
  )
}
