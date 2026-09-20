export const formatDate = (value: string | Date | null | undefined, opts: Intl.DateTimeFormatOptions = {}) => {
  if (!value) return ''
  const d = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', ...opts }).format(d)
}

export const formatDateRange = (start?: string | null, end?: string | null) => {
  if (!start) return ''
  const s = new Date(start)
  if (!end) return formatDate(s)
  const e = new Date(end)
  if (s.toDateString() === e.toDateString()) return formatDate(s)
  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
    return `${s.getDate()} to ${formatDate(e)}`
  }
  return `${formatDate(s)} to ${formatDate(e)}`
}

export const isPast = (date?: string | null) => (date ? new Date(date).getTime() < Date.now() : false)

export const daysUntil = (date?: string | null) => {
  if (!date) return null
  const diff = new Date(date).getTime() - Date.now()
  return Math.ceil(diff / 86_400_000)
}

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`

export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

export const absoluteUrl = (path: string) => `${siteUrl()}${path.startsWith('/') ? path : `/${path}`}`

/** Convert a YouTube or Vimeo page URL into a privacy-friendly embed URL. Anything else is rendered as a link. */
export const embedUrl = (url: string): string | null => {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/)
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?dnt=1`
  return null
}

export const truncate = (s: string | null | undefined, n = 160) => {
  if (!s) return ''
  if (s.length <= n) return s
  return `${s.slice(0, n - 1).replace(/\s+\S*$/, '')}…`
}
