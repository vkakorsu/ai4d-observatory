'use client'

import { useState } from 'react'
import { Icon } from './Icon'
import { track } from './Analytics'

/**
 * Share and cite. Plain links to each platform's share URL, so nothing loads from a third party and nothing
 * tracks the reader until they choose to share. "Copy link" and "Copy citation" need JavaScript; the share
 * links do not.
 */
export function ShareBar({
  url,
  title,
  citation,
}: {
  url: string
  title: string
  citation?: string | null
}) {
  const [copied, setCopied] = useState<'link' | 'cite' | null>(null)
  const enc = encodeURIComponent
  const copy = async (text: string, what: 'link' | 'cite') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(what)
      track(what === 'cite' ? 'copy_citation' : 'copy_link', { title })
      setTimeout(() => setCopied(null), 2500)
    } catch {
      /* Clipboard blocked. The URL is still in the address bar. */
    }
  }
  const links = [
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { label: 'X', href: `https://x.com/intent/post?url=${enc(url)}&text=${enc(title)}` },
    { label: 'WhatsApp', href: `https://wa.me/?text=${enc(`${title} ${url}`)}` },
    { label: 'Email', href: `mailto:?subject=${enc(title)}&body=${enc(url)}` },
  ]
  return (
    <div className="share-bar" aria-label="Share and cite">
      <span className="label">Share</span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          className="share-bar__link"
          rel="noopener noreferrer"
          target={l.label === 'Email' ? undefined : '_blank'}
          onClick={() => track('share', { network: l.label, title })}
        >
          {l.label}
          {l.label !== 'Email' && <span className="visually-hidden"> (opens in a new tab)</span>}
        </a>
      ))}
      <button type="button" className="share-bar__link" onClick={() => copy(url, 'link')}>
        <Icon name="link" size={13} /> {copied === 'link' ? 'Link copied' : 'Copy link'}
      </button>
      {citation && (
        <button type="button" className="share-bar__link" onClick={() => copy(citation, 'cite')}>
          <Icon name="quote" size={13} /> {copied === 'cite' ? 'Citation copied' : 'Copy citation'}
        </button>
      )}
      <span className="visually-hidden" role="status" aria-live="polite">
        {copied === 'link'
          ? 'Link copied to clipboard'
          : copied === 'cite'
            ? 'Citation copied to clipboard'
            : ''}
      </span>
    </div>
  )
}
