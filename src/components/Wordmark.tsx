import Link from '@/components/SmartLink'

/**
 * Typographic wordmark. Three offset squares echo LIRNEasia's node motif without copying it.
 * A final logo waits on Client sign-off (Section 3.1.1 d).
 */
export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="wordmark" aria-label="Asia AI4D Observatory, home">
      <svg className="wordmark__mark" viewBox="0 0 28 28" aria-hidden="true" focusable="false">
        <rect x="2" y="12" width="10" height="10" fill="#c8371f" />
        <rect x="9" y="6" width="10" height="10" fill="#3f6b4f" opacity="0.9" />
        <rect x="16" y="1" width="10" height="10" fill="currentColor" />
      </svg>
      <span className="wordmark__text">
        Asia AI4D Observatory
        {!compact && <small>Responsible AI, South and Southeast Asia</small>}
      </span>
    </Link>
  )
}
