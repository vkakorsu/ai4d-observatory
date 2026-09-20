import { daysUntil, formatDate } from '@/lib/format'

export function Deadline({ deadline, rolling }: { deadline?: string | null; rolling?: boolean | null }) {
  if (rolling) return <span className="deadline">Rolling deadline</span>
  if (!deadline) return null
  const d = daysUntil(deadline)
  if (d === null) return null
  if (d < 0) return <span className="deadline deadline--closed">Closed {formatDate(deadline)}</span>
  if (d <= 14)
    return (
      <span className="deadline deadline--soon">
        Closes {formatDate(deadline)} ({d === 0 ? 'today' : `${d} day${d === 1 ? '' : 's'} left`})
      </span>
    )
  return <span className="deadline">Closes {formatDate(deadline)}</span>
}
