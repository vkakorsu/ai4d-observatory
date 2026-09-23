import Link from '@/components/SmartLink'
import { Icon } from './Icon'
import { NavLinks } from './NavLinks'
import { NavToggle } from './NavToggle'
import { Wordmark } from './Wordmark'
import type { SiteSetting } from '@/payload-types'
import { SubscribeForm } from './forms/SubscribeForm'

export function SiteHeader({ settings }: { settings: SiteSetting }) {
  return (
    <>
      {settings.announcement?.enabled && settings.announcement.text && (
        <div className="announcement">
          <div className="container">
            {settings.announcement.url ? (
              <Link href={settings.announcement.url}>{settings.announcement.text}</Link>
            ) : (
              settings.announcement.text
            )}
          </div>
        </div>
      )}
      <header className="site-header">
        <div className="container site-header__inner">
          <Wordmark />
          <nav className="site-nav" aria-label="Primary">
            <NavLinks variant="bar" />
          </nav>
          <NavToggle
            summary={
              <summary>
                <Icon name="menu" size={18} />
                Menu
              </summary>
            }
          >
            <nav className="nav-toggle__panel" aria-label="Primary, mobile">
              <NavLinks variant="panel" />
            </nav>
          </NavToggle>
        </div>
      </header>
    </>
  )
}

export function SiteFooter({ settings }: { settings: SiteSetting }) {
  const funders = settings.funders ?? []
  const partners = settings.partners ?? []
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Wordmark />
            <p style={{ marginTop: '1rem' }}>{settings.programmeNote}</p>
            <div style={{ marginTop: '1.5rem', maxWidth: '28rem' }}>
              <h2>Quarterly newsletter</h2>
              <SubscribeForm compact consentText={settings.newsletterConsentText} source="footer" />
            </div>
          </div>
          <div>
            <h2>Repository</h2>
            <ul>
              <li>
                <Link href="/use-cases">Use cases</Link>
              </li>
              <li>
                <Link href="/publications">Publications</Link>
              </li>
              <li>
                <Link href="/datasets">Datasets</Link>
              </li>
              <li>
                <Link href="/data">Data and maps</Link>
              </li>
              <li>
                <Link href="/search">Search</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2>Community</h2>
            <ul>
              <li>
                <Link href="/directory">People and organisations</Link>
              </li>
              <li>
                <Link href="/events">Events</Link>
              </li>
              <li>
                <Link href="/learning">Learning resources</Link>
              </li>
              <li>
                <Link href="/opportunities">Opportunities</Link>
              </li>
              <li>
                <Link href="/newsletter">Newsletter archive</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2>About</h2>
            <ul>
              <li>
                <Link href="/about">About the Observatory</Link>
              </li>
              <li>
                <Link href="/about/partners">Partners and funders</Link>
              </li>
              <li>
                <Link href="/commentary">Blog, op-eds and news</Link>
              </li>
              <li>
                <Link href="/accessibility">Accessibility</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy</Link>
              </li>
              <li>
                <Link href="/feed.xml">
                  <Icon name="rss" size={14} /> RSS feed
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-funders" aria-label="Funders and partners">
          {funders.map((f) => (
            <FunderMark key={f.name} name={f.name} url={f.url ?? undefined} kind="Funder" />
          ))}
          {partners.map((p) => (
            <FunderMark key={p.name} name={p.name} url={p.url ?? undefined} kind="Partner" />
          ))}
        </div>
        <div className="footer-legal">
          <span>
            © {new Date().getFullYear()} LIRNEasia. Content licensed CC BY 4.0 unless stated.
          </span>
          <Link href="/prototype-notes">Prototype notes</Link>
          <Link href="/sign-in">Editor login</Link>
        </div>
      </div>
    </footer>
  )
}

/** Logo placeholder until the Client supplies brand assets and usage rules. */
function FunderMark({ name, url, kind }: { name: string; url?: string; kind: string }) {
  const inner = (
    <>
      <span>{name}</span>
      <small>{kind} · logo pending client asset</small>
    </>
  )
  return url ? (
    <a className="funder-mark" href={url} rel="noopener">
      {inner}
    </a>
  ) : (
    <span className="funder-mark">{inner}</span>
  )
}
