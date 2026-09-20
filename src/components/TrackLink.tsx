'use client'

import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { track } from './Analytics'

/** Anchor that fires an analytics event on click. Used for downloads, external registration and dataset access links. */
export function TrackLink({
  event,
  data,
  children,
  ...rest
}: { event: string; data?: Record<string, unknown>; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a {...rest} onClick={() => track(event, data)}>
      {children}
    </a>
  )
}
