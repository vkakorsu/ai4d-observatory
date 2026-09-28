/**
 * Branding for the Payload admin: the logo on Payload's own screens, the navigation icon and a welcome
 * panel on the dashboard. Editors sign in on the site's /sign-in page (see src/proxy.ts). Registered in payload.config.ts under admin.components.
 * The mark matches the public site's wordmark (src/components/Wordmark.tsx).
 */
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? ''

function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" aria-hidden="true" focusable="false">
      <rect x="2" y="12" width="10" height="10" fill="#c8371f" />
      <rect x="9" y="6" width="10" height="10" fill="#3f6b4f" opacity="0.9" />
      <rect x="16" y="1" width="10" height="10" fill="currentColor" />
    </svg>
  )
}

/** Sign-in and first-user screens. */
export function Logo() {
  return (
    <span className="ai4d-logo">
      <Mark size={44} />
      <span className="ai4d-logo__text">
        Asia AI4D Observatory
        <small>Content management</small>
      </span>
    </span>
  )
}

/** Top of the navigation. */
export function NavIcon() {
  return (
    <span className="ai4d-icon">
      <Mark size={20} />
    </span>
  )
}

const LINKS = [
  { href: '/', label: 'View the public site', note: 'Opens the Observatory as visitors see it.' },
  { href: '/prototype-notes#tour', label: 'Ten-minute evaluator tour', note: 'Each step names the RFP clause it shows.' },
  {
    href: 'https://cloud.umami.is/share/RBNwaybQVSQmFY7n',
    label: 'Live analytics',
    note: 'Visits, pages, downloads and sign-ups. Read-only.',
  },
  {
    href: 'https://github.com/vkakorsu/ai4d-observatory/blob/main/docs/EDITOR_GUIDE.md',
    label: 'Editor guide',
    note: 'How to publish, tag, archive and export.',
  },
]

/** Top of the dashboard. */
export function BeforeDashboard() {
  return (
    <section className="ai4d-welcome" aria-labelledby="ai4d-welcome-h">
      <div className="ai4d-welcome__head">
        <Mark size={32} />
        <div>
          <p className="ai4d-welcome__kicker">Asia AI4D Observatory</p>
          <h2 id="ai4d-welcome-h">Content management</h2>
        </div>
      </div>
      <p className="ai4d-welcome__lede">
        Every module on the site is a collection below. Drafts stay private until published; every save keeps a
        version you can restore; archived items leave the site but keep their history. The content here is
        sample content, labelled as such on the site.
      </p>
      <ul className="ai4d-welcome__links">
        {LINKS.map((l) => (
          <li key={l.href}>
            <a href={l.href.startsWith('/') ? `${SITE}${l.href}` : l.href} target="_blank" rel="noopener noreferrer">
              {l.label}
            </a>
            <span>{l.note}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
