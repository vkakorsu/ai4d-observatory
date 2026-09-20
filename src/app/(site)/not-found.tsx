import Link from 'next/link'
import { Icon } from '@/components/Icon'

export default function NotFound() {
  return (
    <div className="container">
      <div className="notfound">
        <p className="code">404</p>
        <h1>This page is not in the repository</h1>
        <p className="lede" style={{ fontSize: 'var(--step-2)' }}>
          The address may be mistyped, or the item may have been archived. Archived items are kept in the CMS and can be restored by an editor.
        </p>
        <form className="search-form" role="search" method="get" action="/search" style={{ marginTop: 'var(--s-5)' }}>
          <label htmlFor="nf-q" className="visually-hidden">
            Search
          </label>
          <input id="nf-q" type="search" name="q" placeholder="Search the Observatory" />
          <button className="btn btn--primary" type="submit">
            <Icon name="search" size={16} /> Search
          </button>
        </form>
        <p className="small" style={{ marginTop: 'var(--s-5)' }}>
          Or start from <Link href="/use-cases">use cases</Link>, <Link href="/publications">publications</Link>, <Link href="/data">data and maps</Link> or the{' '}
          <Link href="/">home page</Link>.
        </p>
      </div>
    </div>
  )
}
