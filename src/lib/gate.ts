import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Email-gated downloads (Section 3.1.2).
 * After a valid form submission the server records the request and issues a short-lived signed link.
 * The link carries the file id, the email hash and an expiry. Nothing sensitive is in the URL.
 */

export type GateToken = {
  fileId: string
  emailHash: string
  exp: number
}

const b64url = (buf: Buffer) => buf.toString('base64url')

export const hashEmail = (email: string) =>
  createHash('sha256').update(email.trim().toLowerCase()).digest('hex').slice(0, 24)

export const hashIp = (ip: string | null | undefined, secret: string) =>
  ip ? createHmac('sha256', secret).update(ip).digest('hex').slice(0, 24) : undefined

export const signGateToken = (
  payload: Omit<GateToken, 'exp'>,
  secret: string,
  ttlMinutes = Number(process.env.GATE_TOKEN_TTL_MINUTES ?? 30),
  now = Date.now(),
): string => {
  const body: GateToken = { ...payload, exp: now + ttlMinutes * 60_000 }
  const json = b64url(Buffer.from(JSON.stringify(body)))
  const sig = b64url(createHmac('sha256', secret).update(json).digest())
  return `${json}.${sig}`
}

export const verifyGateToken = (
  token: string | null | undefined,
  secret: string,
  now = Date.now(),
): GateToken | null => {
  if (!token || typeof token !== 'string') return null
  const [json, sig] = token.split('.')
  if (!json || !sig) return null
  const expected = b64url(createHmac('sha256', secret).update(json).digest())
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  try {
    const parsed = JSON.parse(Buffer.from(json, 'base64url').toString()) as GateToken
    if (!parsed.fileId || !parsed.emailHash || typeof parsed.exp !== 'number') return null
    if (parsed.exp < now) return null
    return parsed
  } catch {
    return null
  }
}

export const isValidEmail = (email: unknown): email is string =>
  typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()) && email.length <= 254
