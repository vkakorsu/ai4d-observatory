import type { SVGProps } from 'react'

/** One consistent icon set. 20 px grid, 1.5 px stroke, rounded caps. Decorative by default. */
export type IconName =
  | 'search'
  | 'arrow'
  | 'download'
  | 'external'
  | 'calendar'
  | 'map'
  | 'file'
  | 'people'
  | 'lock'
  | 'info'
  | 'menu'
  | 'rss'
  | 'mail'
  | 'check'
  | 'filter'
  | 'data'
  | 'globe'
  | 'pin'
  | 'video'
  | 'book'
  | 'link'
  | 'quote'

const paths: Record<IconName, React.ReactNode> = {
  search: (
    <>
      <circle cx="9" cy="9" r="5.5" />
      <path d="M13 13l4.5 4.5" />
    </>
  ),
  arrow: <path d="M4 10h12M11 5l5 5-5 5" />,
  link: (
    <path d="M8.5 11.5a3 3 0 004.2 0l2.6-2.6a3 3 0 00-4.2-4.2l-1 1M11.5 8.5a3 3 0 00-4.2 0l-2.6 2.6a3 3 0 004.2 4.2l1-1" />
  ),
  quote: (
    <path d="M4 15v-3.5C4 8.5 5.5 6 8 5M11 15v-3.5c0-3 1.5-5.5 4-6.5M4 11.5h3.5V15H4M11 11.5h3.5V15H11" />
  ),
  download: <path d="M10 3v10M6 9l4 4 4-4M4 16h12" />,
  external: <path d="M8 4H4v12h12v-4M11 3h6v6M17 3l-8 8" />,
  calendar: (
    <>
      <rect x="3" y="4.5" width="14" height="12" rx="1" />
      <path d="M3 8.5h14M7 2.5v4M13 2.5v4" />
    </>
  ),
  map: <path d="M3 5l5-2 4 2 5-2v12l-5 2-4-2-5 2zM8 3v12M12 5v12" />,
  file: <path d="M5 2.5h6.5L16 7v10.5H5zM11.5 2.5V7H16M7.5 11h5M7.5 14h5" />,
  people: (
    <>
      <circle cx="7.5" cy="7" r="2.75" />
      <circle cx="14" cy="8.5" r="2.25" />
      <path d="M2.5 16.5c0-3 2.2-5 5-5s5 2 5 5M12.5 16.5c0-2.4 1.5-4 3.5-4s3 1.6 3 4" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="9" width="11" height="8" rx="1" />
      <path d="M7 9V6.5a3 3 0 016 0V9" />
    </>
  ),
  info: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 9v5M10 6.2v.3" />
    </>
  ),
  menu: <path d="M3 6h14M3 10h14M3 14h14" />,
  rss: (
    <>
      <path d="M4 4a12 12 0 0112 12M4 9a7 7 0 017 7" />
      <circle cx="5" cy="15" r="1.25" fill="currentColor" stroke="none" />
    </>
  ),
  mail: (
    <>
      <rect x="2.5" y="4.5" width="15" height="11" rx="1" />
      <path d="M3 5.5l7 5.5 7-5.5" />
    </>
  ),
  check: <path d="M4 10.5l4 4 8-9" />,
  filter: <path d="M3 5h14M6 10h8M8.5 15h3" />,
  data: <path d="M3 16h14M5.5 13V8M9.5 13V5M13.5 13v-3M17 3l-3.5 3" />,
  globe: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M2.5 10h15M10 2.5c2.8 2.6 2.8 12.4 0 15M10 2.5c-2.8 2.6-2.8 12.4 0 15" />
    </>
  ),
  pin: (
    <>
      <path d="M10 17.5s-5.5-5-5.5-9a5.5 5.5 0 0111 0c0 4-5.5 9-5.5 9z" />
      <circle cx="10" cy="8.5" r="1.75" />
    </>
  ),
  video: (
    <>
      <rect x="2.5" y="5" width="11" height="10" rx="1" />
      <path d="M13.5 8.5l4-2.5v8l-4-2.5" />
    </>
  ),
  book: <path d="M3 4.5h6v12H3zM11 4.5h6v12h-6zM9 6.5c1 1 1 8 0 9M11 6.5c-1 1-1 8 0 9" />,
}

export function Icon({
  name,
  size = 20,
  label,
  className,
  ...rest
}: { name: IconName; size?: number; label?: string } & Omit<SVGProps<SVGSVGElement>, 'name'>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      focusable="false"
      className={['icon', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {paths[name]}
    </svg>
  )
}
