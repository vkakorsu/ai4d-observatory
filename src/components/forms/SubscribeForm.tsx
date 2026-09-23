'use client'

import { useActionState, useId } from 'react'
import Link from '@/components/SmartLink'
import { subscribeAction } from '@/app/(site)/actions'
import { FieldError, Honeypot, useTrackOnce } from './shared'

/** Newsletter sign-up. Works without JavaScript; the address travels in the POST body, never the URL. */
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
  const [state, action, pending] = useActionState(subscribeAction, { status: 'idle' })
  useTrackOnce(state.status === 'done', 'newsletter_subscribe', { source })

  if (state.status === 'done') {
    return (
      <p className="form__status" role="status">
        {state.result === 'pending'
          ? 'Almost done. Check your inbox for a confirmation email.'
          : 'Thank you. You are on the list for the next quarterly issue.'}
      </p>
    )
  }

  const err = state.status === 'error' ? state : null
  return (
    <form className="form" action={action} aria-describedby={compact ? undefined : `${id}-purpose`}>
      {!compact && (
        <p className="field__hint" id={`${id}-purpose`}>
          We use your address only to send the quarterly newsletter and occasional Observatory
          updates. <Link href="/privacy">Privacy notice</Link>.
        </p>
      )}
      <input type="hidden" name="source" value={source} />
      <div className={`field ${err?.field === 'email' ? 'field--invalid' : ''}`}>
        <label htmlFor={`${id}-email`}>Email address</label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={err?.field === 'email' || undefined}
          aria-describedby={err?.field === 'email' ? `${id}-email-err` : undefined}
        />
        <FieldError
          id={`${id}-email-err`}
          message={err?.field === 'email' ? err.message : undefined}
        />
      </div>
      {!compact && (
        <div className="form__row">
          <div className="field">
            <label htmlFor={`${id}-name`}>Name (optional)</label>
            <input id={`${id}-name`} name="name" type="text" autoComplete="name" maxLength={120} />
          </div>
          <div className="field">
            <label htmlFor={`${id}-org`}>Organisation (optional)</label>
            <input
              id={`${id}-org`}
              name="organisation"
              type="text"
              autoComplete="organization"
              maxLength={200}
            />
          </div>
        </div>
      )}
      <Honeypot id={id} />
      <div className={`field field--check ${err?.field === 'consent' ? 'field--invalid' : ''}`}>
        <input
          id={`${id}-consent`}
          name="consent"
          type="checkbox"
          required
          aria-invalid={err?.field === 'consent' || undefined}
          aria-describedby={err?.field === 'consent' ? `${id}-consent-err` : undefined}
        />
        <label htmlFor={`${id}-consent`}>{consentText}</label>
      </div>
      <FieldError
        id={`${id}-consent-err`}
        message={err?.field === 'consent' ? err.message : undefined}
      />
      {err && !err.field && (
        <p className="form__status form__status--error" role="alert">
          {err.message}
        </p>
      )}
      {pending && <div className="progress" aria-hidden="true" />}
      <div>
        <button
          className={`btn ${compact ? 'btn--small' : 'btn--primary'}`}
          type="submit"
          disabled={pending}
        >
          {pending ? 'Subscribing…' : 'Subscribe'}
        </button>
      </div>
    </form>
  )
}
