export default function Loading() {
  return (
    <div className="container" aria-busy="true">
      <div className="page-header">
        <p className="kicker" style={{ color: 'var(--ink-32)' }}>
          Loading
        </p>
        <div className="progress" aria-hidden="true" style={{ maxWidth: '24rem' }} />
        <p className="visually-hidden" role="status">
          Loading content
        </p>
      </div>
    </div>
  )
}
