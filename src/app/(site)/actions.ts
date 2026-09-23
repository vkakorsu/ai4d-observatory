'use server'

import { headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import {
  submitGate,
  submitRegistration,
  submitSubscribe,
  type FormResult,
  type RequestMeta,
} from '@/lib/forms'

/*
 * Server actions behind the public forms. A form posts here with or without JavaScript
 * (React progressive enhancement), so personal data travels in the request body and never in the URL.
 */

export type ActionState<T extends object = object> =
  | { status: 'idle' }
  | ({ status: 'done' } & T)
  | { status: 'error'; message: string; field?: string }

const meta = async (): Promise<RequestMeta> => {
  const h = await headers()
  return {
    ip: h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || null,
    userAgent: h.get('user-agent'),
  }
}

const toState = <T extends object>(r: FormResult<T>): ActionState<T> => {
  if (r.ok) return { ...(r as T), status: 'done' } as ActionState<T>
  return { status: 'error', message: r.error, field: r.field }
}

const input = (fd: FormData) => Object.fromEntries(fd.entries()) as Record<string, unknown>

export type GateDone = { url: string; filename?: string | null; ttlMinutes: number }
export async function gateAction(
  _prev: ActionState<GateDone>,
  fd: FormData,
): Promise<ActionState<GateDone>> {
  return toState(await submitGate(await getPayloadClient(), input(fd), await meta()))
}

export type SubscribeDone = { status: 'subscribed' | 'pending'; provider: string }
export async function subscribeAction(
  _prev: ActionState<{ result: SubscribeDone['status']; provider: string }>,
  fd: FormData,
): Promise<ActionState<{ result: SubscribeDone['status']; provider: string }>> {
  const r = await submitSubscribe(await getPayloadClient(), input(fd), await meta())
  return r.ok
    ? { status: 'done', result: r.status, provider: r.provider }
    : { status: 'error', message: r.error, field: r.field }
}

export type RegisterDone = {
  result: 'registered' | 'waitlisted' | 'cancelled'
  onlineUrl?: string | null
  duplicate?: boolean
}
export async function registerAction(
  _prev: ActionState<RegisterDone>,
  fd: FormData,
): Promise<ActionState<RegisterDone>> {
  const r = await submitRegistration(await getPayloadClient(), input(fd), await meta())
  return r.ok
    ? { status: 'done', result: r.status, onlineUrl: r.onlineUrl, duplicate: r.duplicate }
    : { status: 'error', message: r.error, field: r.field }
}
