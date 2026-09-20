'use client'

import { useId, useState, type FormEvent } from 'react'
import { track } from '../Analytics'

type State =
  | { status: 'idle' }
  | { status: 'busy' }
  | { status: 'done'; result: 'registered' | 'waitlisted'; onlineUrl?: string; duplicate?: boolean }
  | { status: 'error'; message: string }

/** On-site event registration. Records are exportable from the CMS (Section 2.1 of the RFP). */
export function RegisterForm({ eventId, eventTitle, consentText }: { eventId: string; eventTitle: string; consentText: string }) {
  const id = useId()
  const [state, setState] = useState<State>({ status: 'idle' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget).entries())
    const next: Record<string, string> = {}
    if (!String(data.name || '').trim()) next.name = 'Enter your name.'
    if (!String(data.email || '').includes('@')) next.email = 'Enter a valid email address.'
    if (!data.consent) next.consent = 'Tick the box to confirm you agree.'
    setErrors(next)
    if (Object.keys(next).length) return
    setState({ status: 'busy' })
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...data, consent: true, eventId }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || 'Something went wrong.')
      track('event_register', { event: eventTitle, status: body.status })
      setState({ status: 'done', result: body.status, onlineUrl: body.onlineUrl, duplicate: body.duplicate })
    } catch (err) {
      setState({ status: 'error', message: err instanceof Error ? err.message : 'Something went wrong.' })
    }
  }

  if (state.status === 'done') {
    return (
      <div className="form__status" role="status">
        {state.duplicate ? (
          <p style={{ margin: 0 }}>You are already registered for this event with that email address.</p>
        ) : state.result === 'waitlisted' ? (
          <p style={{ margin: 0 }}>The event is full. You are on the waiting list and we will email you if a place opens.</p>
        ) : (
          <p style={{ margin: 0 }}>
            You are registered.{' '}
            {state.onlineUrl ? (
              <>
                Join link. <a href={state.onlineUrl}>{state.onlineUrl}</a>
              </>
            ) : (
              'Details will follow by email.'
            )}
          </p>
        )}
      </div>
    )
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className={`field ${errors.name ? 'field--invalid' : ''}`}>
        <label htmlFor={`${id}-name`}>Name</label>
        <input id={`${id}-name`} name="name" type="text" autoComplete="name" required aria-invalid={Boolean(errors.name)} />
        {errors.name && <p className="field__error">{errors.name}</p>}
      </div>
      <div className={`field ${errors.email ? 'field--invalid' : ''}`}>
        <label htmlFor={`${id}-email`}>Email address</label>
        <input id={`${id}-email`} name="email" type="email" autoComplete="email" required aria-invalid={Boolean(errors.email)} />
        {errors.email && <p className="field__error">{errors.email}</p>}
      </div>
      <div className="form__row">
        <div className="field">
          <label htmlFor={`${id}-org`}>Organisation (optional)</label>
          <input id={`${id}-org`} name="organisation" type="text" autoComplete="organization" />
        </div>
        <div className="field">
          <label htmlFor={`${id}-country`}>Country (optional)</label>
          <input id={`${id}-country`} name="country" type="text" autoComplete="country-name" />
        </div>
      </div>
      <div className="field">
        <label htmlFor={`${id}-access`}>Accessibility requirements (optional)</label>
        <textarea id={`${id}-access`} name="accessibilityNeeds" rows={2} />
        <p className="field__hint">For example captioning, sign language interpretation or step-free access.</p>
      </div>
      <div className={`field field--check ${errors.consent ? 'field--invalid' : ''}`}>
        <input id={`${id}-consent`} name="consent" type="checkbox" aria-invalid={Boolean(errors.consent)} />
        <label htmlFor={`${id}-consent`}>{consentText}</label>
      </div>
      {errors.consent && <p className="field__error">{errors.consent}</p>}
      {state.status === 'error' && (
        <p className="form__status form__status--error" role="alert">
          {state.message}
        </p>
      )}
      {state.status === 'busy' && <div className="progress" aria-hidden="true" />}
      <div>
        <button className="btn btn--primary" type="submit" disabled={state.status === 'busy'}>
          {state.status === 'busy' ? 'Registering…' : 'Register'}
        </button>
      </div>
    </form>
  )
}
