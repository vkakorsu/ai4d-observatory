import type { Endpoint, PayloadRequest } from 'payload'
import { hashEmail, hashIp, isValidEmail, signGateToken } from '@/lib/gate'
import { selectProvider } from '@/lib/newsletter'

/*
 * Public form endpoints. Served under /api/* by Payload.
 * Each validates input, records a document (exportable as CSV in the admin) and returns JSON.
 * Rate limiting is applied per IP in memory here and at the reverse proxy in production.
 */

type Body = Record<string, unknown>

const readBody = async (req: PayloadRequest): Promise<Body> => {
  try {
    if (typeof req.json === 'function') return ((await req.json()) ?? {}) as Body
  } catch {
    /* fall through */
  }
  return {}
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } })

const clientIp = (req: PayloadRequest) =>
  req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || null

/** Simple sliding window limiter. 20 submissions per IP per 10 minutes per endpoint. */
const buckets = new Map<string, number[]>()
const limited = (key: string, limit = 20, windowMs = 10 * 60_000) => {
  const now = Date.now()
  const arr = (buckets.get(key) ?? []).filter((t) => now - t < windowMs)
  if (arr.length >= limit) return true
  arr.push(now)
  buckets.set(key, arr)
  return false
}

const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

const settings = async (req: PayloadRequest) =>
  req.payload.findGlobal({ slug: 'site-settings', depth: 0 })

/** POST /api/gate. Records the request and returns a short-lived download link. */
export const gateEndpoint: Endpoint = {
  path: '/gate',
  method: 'post',
  handler: async (req) => {
    const ip = clientIp(req)
    if (limited(`gate:${ip ?? 'anon'}`)) return json({ error: 'Too many requests. Please try again later.' }, 429)
    const body = await readBody(req)
    const email = str(body.email, 254)
    const fileId = str(body.fileId, 64)
    const consent = body.consent === true || body.consent === 'true' || body.consent === 'on'
    if (!isValidEmail(email)) return json({ error: 'Please enter a valid email address.' }, 400)
    if (!fileId) return json({ error: 'Missing file.' }, 400)
    if (!consent) return json({ error: 'Please confirm you agree to the stated use of your email address.' }, 400)

    const file = await req.payload.findByID({ collection: 'media', id: fileId, depth: 0 }).catch(() => null)
    if (!file) return json({ error: 'File not found.' }, 404)

    const s = await settings(req)
    const secret = req.payload.secret
    await req.payload.create({
      collection: 'download-requests',
      overrideAccess: true,
      data: {
        email,
        file: file.id,
        resourceTitle: str(body.resourceTitle, 300) || file.alt,
        resourceUrl: str(body.resourceUrl, 500),
        organisation: str(body.organisation, 200) || undefined,
        country: str(body.country, 120) || undefined,
        consentText: s.downloadConsentText,
        consentVersion: s.consentVersion,
        ipHash: hashIp(ip, secret),
        userAgent: str(req.headers.get('user-agent'), 300) || undefined,
      },
    })
    const token = signGateToken({ fileId: String(file.id), emailHash: hashEmail(email) }, secret)
    return json({ ok: true, url: `/download/${file.id}?t=${token}`, filename: file.filename })
  },
}

/** POST /api/subscribe. Stores the subscriber and calls the configured provider adapter. */
export const subscribeEndpoint: Endpoint = {
  path: '/subscribe',
  method: 'post',
  handler: async (req) => {
    const ip = clientIp(req)
    if (limited(`subscribe:${ip ?? 'anon'}`)) return json({ error: 'Too many requests. Please try again later.' }, 429)
    const body = await readBody(req)
    const email = str(body.email, 254)
    const consent = body.consent === true || body.consent === 'true' || body.consent === 'on'
    if (!isValidEmail(email)) return json({ error: 'Please enter a valid email address.' }, 400)
    if (!consent) return json({ error: 'Please confirm you agree to receive the newsletter.' }, 400)
    // Honeypot field for bots.
    if (str(body.website)) return json({ ok: true, status: 'subscribed' })

    const s = await settings(req)
    const provider = selectProvider()
    let result
    try {
      result = await provider.subscribe({
        email,
        name: str(body.name, 120) || undefined,
        organisation: str(body.organisation, 200) || undefined,
        source: str(body.source, 200) || undefined,
      })
    } catch (err) {
      req.payload.logger.error({ err }, 'Newsletter provider error')
      return json({ error: 'We could not reach the newsletter service. Please try again later.' }, 502)
    }

    const existing = await req.payload.find({
      collection: 'subscribers',
      where: { email: { equals: email } },
      limit: 1,
      overrideAccess: true,
    })
    const data = {
      email,
      name: str(body.name, 120) || undefined,
      organisation: str(body.organisation, 200) || undefined,
      status: result.status,
      provider: result.provider,
      providerId: result.providerId,
      consentText: s.newsletterConsentText,
      consentVersion: s.consentVersion,
      source: str(body.source, 200) || undefined,
    }
    if (existing.docs[0]) {
      await req.payload.update({ collection: 'subscribers', id: existing.docs[0].id, data, overrideAccess: true })
    } else {
      await req.payload.create({ collection: 'subscribers', data, overrideAccess: true })
    }
    return json({ ok: true, status: result.status, provider: result.provider })
  },
}

/** POST /api/register. On-site event registration with capacity and closing date checks. */
export const registerEndpoint: Endpoint = {
  path: '/register',
  method: 'post',
  handler: async (req) => {
    const ip = clientIp(req)
    if (limited(`register:${ip ?? 'anon'}`)) return json({ error: 'Too many requests. Please try again later.' }, 429)
    const body = await readBody(req)
    const email = str(body.email, 254)
    const name = str(body.name, 120)
    const eventId = str(body.eventId, 64)
    const consent = body.consent === true || body.consent === 'true' || body.consent === 'on'
    if (!name) return json({ error: 'Please enter your name.' }, 400)
    if (!isValidEmail(email)) return json({ error: 'Please enter a valid email address.' }, 400)
    if (!eventId) return json({ error: 'Missing event.' }, 400)
    if (!consent) return json({ error: 'Please confirm you agree to the stated use of your details.' }, 400)

    const event = await req.payload.findByID({ collection: 'events', id: eventId, depth: 0 }).catch(() => null)
    if (!event || event._status !== 'published') return json({ error: 'Event not found.' }, 404)
    if (event.registration?.mode !== 'form') return json({ error: 'This event does not take registrations here.' }, 400)
    if (event.registration?.closesAt && new Date(event.registration.closesAt).getTime() < Date.now())
      return json({ error: 'Registration for this event has closed.' }, 400)

    const dup = await req.payload.find({
      collection: 'event-registrations',
      where: { and: [{ event: { equals: event.id } }, { email: { equals: email } }] },
      limit: 1,
      overrideAccess: true,
    })
    if (dup.docs[0]) return json({ ok: true, status: dup.docs[0].status, duplicate: true })

    let status: 'registered' | 'waitlisted' = 'registered'
    if (event.registration?.capacity) {
      const count = await req.payload.count({
        collection: 'event-registrations',
        where: { and: [{ event: { equals: event.id } }, { status: { equals: 'registered' } }] },
        overrideAccess: true,
      })
      if (count.totalDocs >= event.registration.capacity) status = 'waitlisted'
    }

    const s = await settings(req)
    await req.payload.create({
      collection: 'event-registrations',
      overrideAccess: true,
      data: {
        event: event.id,
        name,
        email,
        organisation: str(body.organisation, 200) || undefined,
        country: str(body.country, 120) || undefined,
        accessibilityNeeds: str(body.accessibilityNeeds, 600) || undefined,
        consentText: s.registrationConsentText,
        consentVersion: s.consentVersion,
        status,
      },
    })
    return json({ ok: true, status, onlineUrl: status === 'registered' ? event.onlineUrl : undefined })
  },
}

export const formEndpoints: Endpoint[] = [gateEndpoint, subscribeEndpoint, registerEndpoint]
