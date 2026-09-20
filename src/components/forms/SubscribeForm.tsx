'use client'

import { useId, useState, type FormEvent } from 'react'
import { track } from '../Analytics'

type State = { status: 'idle' | 'busy' | 'done' | 'error'; message?: string; result?: string }

export function SubscribeForm({
  consentText,
  compact = false,
  source = 'page',
}: {
  consentText: string
  compact?: boolean
  source?: string
}) {
  const id = useId()
  const [state, setState] = useState<State>({ status: 'idle' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    const next: Record<string, string> = {}
    if (!String(data.email || '').includes('@')) next.email = 'Enter a valid email address.'
    if (!data.consent) next.consent = 'Tick the box to confirm you agree.'
    setErrors(next)
    if (Object.keys(next).length) return
    setState({ status: 'busy' })
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...data, consent: true, source }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || 'Something went wrong.')
      track('newsletter_subscribe', { source, provider: body.provider })
      setState({
        status: 'done',
        result: body.status,
        message:
          body.status === 'pending'
            ? 'Almost done. Check your inbox for a confirmation email.'
            : 'Thank you. You are on the list.',
      })
      form.reset()
    } catch (err) {
      setState({ status: 'error', message: err instanceof Error ? err.message : 'Something went wrong.' })
    }
  }

  if (state.status === 'done') {
    return (
      <p className="form__status" role="status">
        {state.message}
      </p>
    )
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate aria-describedby={`${id}-purpose`}>
      {!compact && (
        <p className="field__hint" id={`${id}-purpose`}>
          We use your address only to send the quarterly newsletter and occasional Observatory updates.
        </p>
      )}
      <div className={`field ${errors.email ? 'field--invalid' : ''}`}>
        <label htmlFor={`${id}-email`}>Email address</label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${id}-email-err` : undefined}
        />
        {errors.email && (
          <p className="field__error" id={`${id}-email-err`}>
            {errors.email}
          </p>
        )}
      </div>
      {!compact && (
        <div className="form__row">
          <div className="field">
            <label htmlFor={`${id}-name`}>Name (optional)</label>
            <input id={`${id}-name`} name="name" type="text" autoComplete="name" />
          </div>
          <div className="field">
            <label htmlFor={`${id}-org`}>Organisation (optional)</label>
            <input id={`${id}-org`} name="organisation" type="text" autoComplete="organization" />
          </div>
        </div>
      )}
      {/* Honeypot. Hidden from people, filled by bots. */}
      <div className="visually-hidden" aria-hidden="true">
        <label htmlFor={`${id}-web`}>Website</label>
        <input id={`${id}-web`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className={`field field--check ${errors.consent ? 'field--invalid' : ''}`}>
        <input
          id={`${id}-consent`}
          name="consent"
          type="checkbox"
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? `${id}-consent-err` : undefined}
        />
        <label htmlFor={`${id}-consent`}>{consentText}</label>
      </div>
      {errors.consent && (
        <p className="field__error" id={`${id}-consent-err`}>
          {errors.consent}
        </p>
      )}
      {state.status === 'error' && (
        <p className="form__status form__status--error" role="alert">
          {state.message}
        </p>
      )}
      {state.status === 'busy' && <div className="progress" aria-hidden="true" />}
      <div>
        <button className={`btn ${compact ? 'btn--small' : 'btn--primary'}`} type="submit" disabled={state.status === 'busy'}>
          {state.status === 'busy' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </div>
    </form>
  )
}
