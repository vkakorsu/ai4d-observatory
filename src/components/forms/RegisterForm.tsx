'use client'

import { useActionState, useId } from 'react'
import { registerAction } from '@/app/(site)/actions'
import { FieldError, Honeypot, useTrackOnce } from './shared'

/** On-site event registration. Records are exportable from the CMS (Section 2.1 of the RFP). Works without JavaScript. */
export function RegisterForm({
  eventId,
  eventTitle,
  consentText,
}: {
  eventId: string
  eventTitle: string
  consentText: string
}) {
  const id = useId()
  const [state, action, pending] = useActionState(registerAction, { status: 'idle' })
  useTrackOnce(state.status === 'done', 'event_register', { event: eventTitle })

  if (state.status === 'done') {
    return (
      <div className="form__status" role="status">
        {state.result === 'waitlisted' ? (
          <p style={{ margin: 0 }}>
            {state.duplicate
              ? 'You are already on the waiting list. '
              : 'The event is full. You are on the waiting list. '}
            We will email you if a place opens.
          </p>
        ) : (
          <p style={{ margin: 0 }}>
            {state.duplicate
              ? 'You are already registered for this event with that email address. '
              : 'You are registered. '}
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

  const err = state.status === 'error' ? state : null
  const fieldProps = (name: string) => ({
    'aria-invalid': err?.field === name || undefined,
    'aria-describedby': err?.field === name ? `${id}-${name}-err` : undefined,
  })
  return (
    <form className="form" action={action}>
      <input type="hidden" name="eventId" value={eventId} />
      <div className={`field ${err?.field === 'name' ? 'field--invalid' : ''}`}>
        <label htmlFor={`${id}-name`}>Name</label>
        <input
          id={`${id}-name`}
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={120}
          {...fieldProps('name')}
        />
        <FieldError
          id={`${id}-name-err`}
          message={err?.field === 'name' ? err.message : undefined}
        />
      </div>
      <div className={`field ${err?.field === 'email' ? 'field--invalid' : ''}`}>
        <label htmlFor={`${id}-email`}>Email address</label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          {...fieldProps('email')}
        />
        <FieldError
          id={`${id}-email-err`}
          message={err?.field === 'email' ? err.message : undefined}
        />
      </div>
      <div className="form__row">
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
        <div className="field">
          <label htmlFor={`${id}-country`}>Country (optional)</label>
          <input
            id={`${id}-country`}
            name="country"
            type="text"
            autoComplete="country-name"
            maxLength={120}
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor={`${id}-access`}>Accessibility requirements (optional)</label>
        <textarea
          id={`${id}-access`}
          name="accessibilityNeeds"
          rows={2}
          maxLength={600}
          aria-describedby={`${id}-access-hint`}
        />
        <p className="field__hint" id={`${id}-access-hint`}>
          For example captioning, sign language interpretation or step-free access.
        </p>
      </div>
      <Honeypot id={id} />
      <div className={`field field--check ${err?.field === 'consent' ? 'field--invalid' : ''}`}>
        <input
          id={`${id}-consent`}
          name="consent"
          type="checkbox"
          required
          {...fieldProps('consent')}
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
        <button className="btn btn--primary" type="submit" disabled={pending}>
          {pending ? 'Registering…' : 'Register'}
        </button>
      </div>
    </form>
  )
}
