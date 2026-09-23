'use client'

import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { forwardRef, useRef, type ComponentProps } from 'react'

type Props = ComponentProps<typeof NextLink>

const saveData = () =>
  typeof navigator !== 'undefined' &&
  Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)

/**
 * Link with intent-based prefetch (Section 3.1.5 c, lower-bandwidth access).
 *
 * Next.js prefetches every link that scrolls into view. On a phone that meant hundreds of kilobytes of
 * pages nobody opened (every country on a map, every row of a listing). This link prefetches only when the
 * reader shows intent, on hover, keyboard focus or the start of a touch, and never when the browser asks
 * to save data. Navigation still feels instant; idle scrolling costs nothing.
 */
const SmartLink = forwardRef<HTMLAnchorElement, Props>(function SmartLink(
  { prefetch, onMouseEnter, onFocus, onTouchStart, href, ...rest },
  ref,
) {
  const router = useRouter()
  const done = useRef(false)
  const intent = () => {
    if (done.current || prefetch === false || saveData()) return
    const url = typeof href === 'string' ? href : href.pathname
    if (!url || /^(https?:|mailto:|tel:|#)/.test(url)) return
    done.current = true
    router.prefetch(url)
  }
  return (
    <NextLink
      ref={ref}
      href={href}
      prefetch={false}
      onMouseEnter={(e) => {
        intent()
        onMouseEnter?.(e)
      }}
      onFocus={(e) => {
        intent()
        onFocus?.(e)
      }}
      onTouchStart={(e) => {
        intent()
        onTouchStart?.(e)
      }}
      {...rest}
    />
  )
})

export default SmartLink
