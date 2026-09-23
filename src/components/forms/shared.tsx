'use client'

import { useEffect, useRef } from 'react'
import { track } from '../Analytics'

/** Hidden field that people never see and bots tend to fill. Submissions with a value are discarded. */
export function Honeypot({ id }: { id: string }) {
  return (
    <div className="visually-hidden" aria-hidden="true">
      <label htmlFor={`${id}-web`}>Leave this field empty</label>
      <input id={`${id}-web`} name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  )
}

/** Fire one analytics event when a form reaches its done state. */
export function useTrackOnce(done: boolean, event: string, data: Record<string, unknown>) {
  const fired = useRef(false)
  useEffect(() => {
    if (done && !fired.current) {
      fired.current = true
      track(event, data)
    }
  }, [done, event, data])
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p className="field__error" id={id}>
      {message}
    </p>
  )
}
