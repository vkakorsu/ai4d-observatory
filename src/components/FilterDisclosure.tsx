'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * The filter panel. Collapsed on phones so results come first; open on wider screens and whenever a filter is
 * active. A native <details>, so it works without JavaScript.
 *
 * The open state is set once for the first render and then managed here, on every navigation. React must not
 * own the `open` attribute: after a client-side move from a filtered view back to "All", it would re-apply the
 * server's "closed" and the panel would vanish on desktop.
 */
export function FilterDisclosure({
  active,
  signature,
  children,
}: {
  /** True while any filter or search is applied. */
  active: boolean
  /** Changes whenever the URL's filters change, so the panel re-evaluates after client-side navigation. */
  signature: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDetailsElement>(null)
  const [initialOpen] = useState(active)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (active || window.matchMedia('(min-width: 64em)').matches) d.open = true
  }, [active, signature])

  return (
    <details ref={ref} className="filters" open={initialOpen || undefined} suppressHydrationWarning>
      {children}
    </details>
  )
}
