'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from './Icon'

export const NAV = [
  { href: '/use-cases', label: 'Use cases' },
  { href: '/data', label: 'Data and maps' },
  { href: '/publications', label: 'Publications' },
  { href: '/commentary', label: 'Commentary' },
  { href: '/directory', label: 'Directory' },
  { href: '/events', label: 'Engage', match: ['/events', '/learning', '/opportunities', '/newsletter'] },
  { href: '/about', label: 'About' },
]

const isActive = (pathname: string, item: (typeof NAV)[number]) =>
  (item.match ?? [item.href]).some((m) => pathname === m || pathname.startsWith(`${m}/`))

export function NavLinks({ variant }: { variant: 'bar' | 'panel' }) {
  const pathname = usePathname() || '/'
  return (
    <ul>
      {NAV.map((item) => (
        <li key={item.href}>
          <Link href={item.href} aria-current={isActive(pathname, item) ? 'page' : undefined}>
            {item.label}
          </Link>
        </li>
      ))}
      <li>
        <Link
          href="/search"
          className={variant === 'bar' ? 'is-search' : undefined}
          aria-current={pathname.startsWith('/search') ? 'page' : undefined}
        >
          <Icon name="search" size={16} />
          Search
        </Link>
      </li>
    </ul>
  )
}
