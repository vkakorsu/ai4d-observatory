import type { Payload } from 'payload'
import { hashEmail, hashIp, isValidEmail, signGateToken } from './gate'
import { selectProvider } from './newsletter'

/*
 * Public form logic, shared by the JSON endpoints (/api/gate, /api/subscribe, /api/register) and the
 * server actions the site's forms post to. Server actions keep every form working without JavaScript
 * and keep personal data in the request body, never in the URL (Section 3.1.6 c).
 */

export type FormInput = Record<string, unknown>
export type RequestMeta = { ip: string | null; userAgent: string | null }

export type FormResult<T extends object = object> =
  ({ ok: true } & T) | { ok: false; status: number; error: string; field?: string }

/** Trimmed, length-capped string. Leading spreadsheet formula characters are neutralised for CSV exports. */
export const clean = (v: unknown, max = 200): string => {
  if (typeof v !== 'string') return ''
  const s = v.trim().slice(0, max)
  return /^[=+\-@\t\r]/.test(s) ? `'${s}` : s
}

const consentGiven = (v: unknown) => v === true || v === 'true' || v === 'on'

/** Sliding window limiter. 20 submissions per key per 10 minutes. Per process; the reverse proxy adds a shared limit. */
const buckets = new Map<string, number[]>()
export const rateLimited = (key: string, limit = 20, windowMs = 10 * 60_000, now = Date.now()) => {
  const arr = (buckets.get(key) ?? []).filter((t) => now - t < windowMs)
  if (arr.length >= limit) {
    buckets.set(key, arr)
    return true
  }
  arr.push(now)
  buckets.set(key, arr)
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k)
  }
  return false
}

const tooMany = {
  ok: false as const,
  status: 429,
  error: 'Too many requests. Please try again in a few minutes.',
}

const settings = (payload: Payload) => payload.findGlobal({ slug: 'site-settings', depth: 0 })

export const gateTtlMinutes = () => Number(process.env.GATE_TOKEN_TTL_MINUTES ?? 30)

/** Record a gated download request and return a short-lived signed link. */
export async function submitGate(
  payload: Payload,
  input: FormInput,
  meta: RequestMeta,
): Promise<FormResult<{ url: string; filename?: string | null; ttlMinutes: number }>> {
  if (rateLimited(`gate:${meta.ip ?? 'anon'}`)) return tooMany
  const email = clean(input.email, 254)
  const fileId = clean(input.fileId, 64)
  if (clean(input.website)) return { ok: false, status: 400, error: 'Please try again.' }
  if (!isValidEmail(email))
    return { ok: false, status: 400, error: 'Please enter a valid email address.', field: 'email' }
  if (!fileId) return { ok: false, status: 400, error: 'Missing file.' }
  if (!consentGiven(input.consent))
    return {
      ok: false,
      status: 400,
      error: 'Please confirm you agree to the stated use of your email address.',
      field: 'consent',
    }

  const file = await payload
    .findByID({ collection: 'media', id: fileId, depth: 0 })
    .catch(() => null)
  if (!file) return { ok: false, status: 404, error: 'File not found.' }

  const s = await settings(payload)
  await payload.create({
    collection: 'download-requests',
    overrideAccess: true,
    data: {
      email,
      file: file.id,
      resourceTitle: clean(input.resourceTitle, 300) || file.alt,
      resourceUrl: clean(input.resourceUrl, 500),
      organisation: clean(input.organisation, 200) || undefined,
      country: clean(input.country, 120) || undefined,
      consentText: s.downloadConsentText,
      consentVersion: s.consentVersion,
      ipHash: hashIp(meta.ip, payload.secret),
      userAgent: clean(meta.userAgent, 300) || undefined,
    },
  })
  const ttl = gateTtlMinutes()
  const token = signGateToken(
    { fileId: String(file.id), emailHash: hashEmail(email) },
    payload.secret,
    ttl,
  )
  return {
    ok: true,
    url: `/download/${file.id}?t=${token}`,
    filename: file.filename,
    ttlMinutes: ttl,
  }
}

/** Store the subscriber in the CMS and pass them to the configured newsletter provider. */
export async function submitSubscribe(
  payload: Payload,
  input: FormInput,
  meta: RequestMeta,
): Promise<FormResult<{ status: 'subscribed' | 'pending'; provider: string }>> {
  if (rateLimited(`subscribe:${meta.ip ?? 'anon'}`)) return tooMany
  const email = clean(input.email, 254)
  if (!isValidEmail(email))
    return { ok: false, status: 400, error: 'Please enter a valid email address.', field: 'email' }
  if (!consentGiven(input.consent))
    return {
      ok: false,
      status: 400,
      error: 'Please confirm you agree to receive the newsletter.',
      field: 'consent',
    }
  // Honeypot. Bots fill hidden fields; answer as if it worked and store nothing.
  if (clean(input.website)) return { ok: true, status: 'subscribed', provider: 'local' }

  const s = await settings(payload)
  const name = clean(input.name, 120) || undefined
  const organisation = clean(input.organisation, 200) || undefined
  const source = clean(input.source, 200) || undefined
  let result
  try {
    result = await selectProvider().subscribe({ email, name, organisation, source })
  } catch (err) {
    payload.logger.error({ err }, 'Newsletter provider error')
    return {
      ok: false,
      status: 502,
      error: 'We could not reach the newsletter service. Please try again later.',
    }
  }

  const existing = await payload.find({
    collection: 'subscribers',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  })
  const data = {
    email,
    name,
    organisation,
    status: result.status,
    provider: result.provider,
    providerId: result.providerId,
    consentText: s.newsletterConsentText,
    consentVersion: s.consentVersion,
    source,
  }
  if (existing.docs[0]) {
    await payload.update({
      collection: 'subscribers',
      id: existing.docs[0].id,
      data,
      overrideAccess: true,
    })
  } else {
    await payload.create({ collection: 'subscribers', data, overrideAccess: true })
  }
  return { ok: true, status: result.status, provider: result.provider }
}

/** On-site event registration with capacity, waitlist and closing date checks. */
export async function submitRegistration(
  payload: Payload,
  input: FormInput,
  meta: RequestMeta,
): Promise<
  FormResult<{
    status: 'registered' | 'waitlisted' | 'cancelled'
    onlineUrl?: string | null
    duplicate?: boolean
  }>
> {
  if (rateLimited(`register:${meta.ip ?? 'anon'}`)) return tooMany
  const email = clean(input.email, 254)
  const name = clean(input.name, 120)
  const eventId = clean(input.eventId, 64)
  if (clean(input.website)) return { ok: false, status: 400, error: 'Please try again.' }
  if (!name) return { ok: false, status: 400, error: 'Please enter your name.', field: 'name' }
  if (!isValidEmail(email))
    return { ok: false, status: 400, error: 'Please enter a valid email address.', field: 'email' }
  if (!eventId) return { ok: false, status: 400, error: 'Missing event.' }
  if (!consentGiven(input.consent))
    return {
      ok: false,
      status: 400,
      error: 'Please confirm you agree to the stated use of your details.',
      field: 'consent',
    }

  // Local API with access control off, so the staff-only join link is available to confirmed registrants.
  const event = await payload
    .findByID({ collection: 'events', id: eventId, depth: 0 })
    .catch(() => null)
  if (!event || event._status !== 'published')
    return { ok: false, status: 404, error: 'Event not found.' }
  if (event.registration?.mode !== 'form')
    return { ok: false, status: 400, error: 'This event does not take registrations here.' }
  if (event.registration?.closesAt && new Date(event.registration.closesAt).getTime() < Date.now())
    return { ok: false, status: 400, error: 'Registration for this event has closed.' }

  const dup = await payload.find({
    collection: 'event-registrations',
    where: { and: [{ event: { equals: event.id } }, { email: { equals: email } }] },
    limit: 1,
    overrideAccess: true,
  })
  const existing = dup.docs[0]
  if (existing) {
    const status = (existing.status ?? 'registered') as 'registered' | 'waitlisted' | 'cancelled'
    return {
      ok: true,
      status,
      duplicate: true,
      onlineUrl: status === 'registered' ? event.onlineUrl : undefined,
    }
  }

  let status: 'registered' | 'waitlisted' = 'registered'
  if (event.registration?.capacity) {
    const count = await payload.count({
      collection: 'event-registrations',
      where: { and: [{ event: { equals: event.id } }, { status: { equals: 'registered' } }] },
      overrideAccess: true,
    })
    if (count.totalDocs >= event.registration.capacity) status = 'waitlisted'
  }

  const s = await settings(payload)
  await payload.create({
    collection: 'event-registrations',
    overrideAccess: true,
    data: {
      event: event.id,
      name,
      email,
      organisation: clean(input.organisation, 200) || undefined,
      country: clean(input.country, 120) || undefined,
      accessibilityNeeds: clean(input.accessibilityNeeds, 600) || undefined,
      consentText: s.registrationConsentText,
      consentVersion: s.consentVersion,
      status,
    },
  })
  return { ok: true, status, onlineUrl: status === 'registered' ? event.onlineUrl : undefined }
}
