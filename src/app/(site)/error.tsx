'use client'

import Link from '@/components/SmartLink'
import { useEffect } from 'react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Server logs carry the full error. The digest lets support match a user report to a log line.
    console.error(error)
  }, [error])
  return (
    <div className="container">
      <div className="notfound">
        <p className="code">Error</p>
        <h1>Something went wrong on our side</h1>
        <p className="lede" style={{ fontSize: 'var(--step-2)' }}>
          The page could not be shown. You can try again, or go back to the home page. If this keeps
          happening, please tell us and quote the reference below.
        </p>
        {error.digest && <p className="mono small muted">Reference. {error.digest}</p>}
        <div className="cluster" style={{ marginTop: 'var(--s-5)' }}>
          <button className="btn btn--primary" onClick={() => reset()}>
            Try again
          </button>
          <Link className="btn" href="/">
            Home page
          </Link>
        </div>
      </div>
    </div>
  )
}
