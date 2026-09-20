'use client'

import { useId, useState, type FormEvent } from 'react'
import { Icon } from '../Icon'
import { track } from '../Analytics'

type State =
  | { status: 'idle' }
  | { status: 'busy' }
  | { status: 'ready'; url: string; filename?: string }
  | { status: 'error'; message: string }

/**
 * Email-gated download (Section 3.1.2). Collects an email address and consent, records the request server-side,
 * and receives a short-lived signed link. The file itself is never linked directly in the page.
 */
export function GateForm({
  fileId,
  resourceTitle,
  resourceUrl,
  purpose,
  consentText,
  filename,
  size,
}: {
  fileId: string
  resourceTitle: string
  resourceUrl: string
  purpose: string
  consentText: string
  filename?: string | null
  size?: number | null
}) {
  const id = useId()
  const [state, setState] = useState<State>({ status: 'idle' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget).entries())
    const next: Record<string, string> = {}
    if (!String(data.email || '').includes('@')) next.email = 'Enter a valid email address.'
    if (!data.consent) next.consent = 'Tick the box to confirm you agree.'
    setErrors(next)
    if (Object.keys(next).length) return
    setState({ status: 'busy' })
    try {
      const res = await fetch('/api/gate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...data, consent: true, fileId, resourceTitle, resourceUrl }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || 'Something went wrong.')
      track('gated_download_unlocked', { resource: resourceTitle })
      setState({ status: 'ready', url: body.url, filename: body.filename })
    } catch (err) {
      setState({ status: 'error', message: err instanceof Error ? err.message : 'Something went wrong.' })
    }
  }

  const sizeLabel = size ? `${(size / 1024 / 1024).toFixed(1)} MB` : null

  return (
    <div className="download-box">
      <h2>
        <Icon name="lock" size={16} /> Download
      </h2>
      <p className="filemeta">
        {filename ?? 'File'}
        {sizeLabel ? ` · ${sizeLabel}` : ''} · email required
      </p>
      {state.status === 'ready' ? (
        <div className="flow">
          <p className="form__status" role="status">
            Thank you. Your link is ready and stays valid for 30 minutes.
          </p>
          <a
            className="btn btn--primary"
            href={state.url}
            onClick={() => track('download', { resource: resourceTitle, gated: true })}
          >
            <Icon name="download" size={16} /> Download {state.filename ?? 'file'}
          </a>
        </div>
      ) : (
        <form className="form" onSubmit={onSubmit} noValidate>
          <p className="field__hint">{purpose}</p>
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
              {state.status === 'busy' ? 'Preparing link…' : 'Get download link'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
