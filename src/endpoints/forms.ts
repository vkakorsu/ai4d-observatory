import type { Endpoint, PayloadRequest } from 'payload'
import {
  submitGate,
  submitRegistration,
  submitSubscribe,
  type FormResult,
  type RequestMeta,
} from '@/lib/forms'

/*
 * Public JSON endpoints, served under /api/* by Payload, for integrations and scripted use.
 * The site's own forms post to server actions (src/app/(site)/actions.ts) that call the same functions,
 * so validation, rate limiting and record keeping are identical on both paths.
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

export const requestMeta = (headers: Headers): RequestMeta => ({
  ip: headers.get('x-forwarded-for')?.split(',')[0]?.trim() || headers.get('x-real-ip') || null,
  userAgent: headers.get('user-agent'),
})

const respond = (result: FormResult) => {
  const { ok, ...rest } = result
  const body = ok ? { ok, ...rest } : { error: (rest as { error: string }).error }
  const status = ok ? 200 : (rest as { status: number }).status
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

/** POST /api/gate. Records the request and returns a short-lived download link. */
export const gateEndpoint: Endpoint = {
  path: '/gate',
  method: 'post',
  handler: async (req) =>
    respond(await submitGate(req.payload, await readBody(req), requestMeta(req.headers))),
}

/** POST /api/subscribe. Stores the subscriber and calls the configured provider adapter. */
export const subscribeEndpoint: Endpoint = {
  path: '/subscribe',
  method: 'post',
  handler: async (req) =>
    respond(await submitSubscribe(req.payload, await readBody(req), requestMeta(req.headers))),
}

/** POST /api/register. On-site event registration with capacity and closing date checks. */
export const registerEndpoint: Endpoint = {
  path: '/register',
  method: 'post',
  handler: async (req) =>
    respond(await submitRegistration(req.payload, await readBody(req), requestMeta(req.headers))),
}

export const formEndpoints: Endpoint[] = [gateEndpoint, subscribeEndpoint, registerEndpoint]
