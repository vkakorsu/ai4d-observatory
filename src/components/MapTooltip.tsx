'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Progressive enhancement for the server-rendered map. Shows the country and its value beside the pointer,
 * or beside the country when it receives keyboard focus. The same text is already each link's accessible
 * name and native tooltip, so the map is complete without this; the tooltip is visual convenience only.
 */
export function MapTooltip() {
  const ref = useRef<HTMLDivElement>(null)
  const [tip, setTip] = useState<{ text: string; x: number; y: number } | null>(null)

  useEffect(() => {
    const figure = ref.current?.closest('.map-figure') as HTMLElement | null
    if (!figure) return
    const linkFrom = (t: EventTarget | null) =>
      t instanceof Element ? (t.closest('a.country-link') as SVGAElement | null) : null
    const place = (text: string, clientX: number, clientY: number) => {
      const box = figure.getBoundingClientRect()
      setTip({ text, x: clientX - box.left, y: clientY - box.top })
    }
    const onMove = (e: PointerEvent) => {
      const a = linkFrom(e.target)
      if (!a) return setTip(null)
      place(a.getAttribute('aria-label') ?? '', e.clientX, e.clientY)
    }
    const onFocus = (e: FocusEvent) => {
      const a = linkFrom(e.target)
      if (!a) return
      const r = a.getBoundingClientRect()
      place(a.getAttribute('aria-label') ?? '', r.left + r.width / 2, r.top + r.height / 2)
    }
    const hide = () => setTip(null)
    figure.addEventListener('pointermove', onMove)
    figure.addEventListener('pointerleave', hide)
    figure.addEventListener('focusin', onFocus)
    figure.addEventListener('focusout', hide)
    return () => {
      figure.removeEventListener('pointermove', onMove)
      figure.removeEventListener('pointerleave', hide)
      figure.removeEventListener('focusin', onFocus)
      figure.removeEventListener('focusout', hide)
    }
  }, [])

  const [name, ...rest] = (tip?.text ?? '').split('. ')
  return (
    <div
      ref={ref}
      className="map-tip"
      aria-hidden="true"
      style={
        tip
          ? { transform: `translate(${tip.x + 14}px, ${tip.y + 14}px)`, opacity: 1 }
          : { opacity: 0 }
      }
    >
      <strong>{name}</strong>
      {rest.length > 0 && <span>{rest.join('. ')}</span>}
    </div>
  )
}
