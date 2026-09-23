'use client'

import { useActionState, useId } from 'react'
import Link from '@/components/SmartLink'
import { gateAction } from '@/app/(site)/actions'
import { Icon } from '../Icon'
import { track } from '../Analytics'
import { FieldError, Honeypot, useTrackOnce } from './shared'
import { formatFileSize } from '@/lib/format'

/**
 * Email-gated download (Section 3.1.2). Collects an email address and consent, records the request server-side,
 * and receives a short-lived signed link. The file itself is never linked directly in the page.
 * Works without JavaScript: the server action re-renders this box with the link.
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
  const [state, action, pending] = useActionState(gateAction, { status: 'idle' })
  useTrackOnce(state.status === 'done', 'gated_download_unlocked', { resource: resourceTitle })
  const sizeLabel = formatFileSize(size)
  const err = state.status === 'error' ? state : null

  return (
    <div className="download-box">
      <h2>
        <Icon name="lock" size={16} /> Download
      </h2>
      <p className="filemeta">
        {filename ?? 'File'}
        {sizeLabel ? ` · ${sizeLabel}` : ''} · email required
      </p>
      {state.status === 'done' ? (
        <div className="flow">
          <p className="form__status" role="status">
            Thank you. Your link is ready and stays valid for {state.ttlMinutes} minutes.
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
        <form className="form" action={action}>
          <p className="field__hint">
            {purpose} <Link href="/privacy">Privacy notice</Link>.
          </p>
          <input type="hidden" name="fileId" value={fileId} />
          <input type="hidden" name="resourceTitle" value={resourceTitle} />
          <input type="hidden" name="resourceUrl" value={resourceUrl} />
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
            <button className="btn btn--primary" type="submit" disabled={pending}>
              {pending ? 'Preparing link…' : 'Get download link'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
