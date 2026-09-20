import { createHmac } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { hashEmail, hashIp, isValidEmail, signGateToken, verifyGateToken } from '@/lib/gate'

/** Gated download token signing and verification, including expiry and tampering. */

const secret = 'a-test-secret-long-enough-to-be-realistic-0123456789'
const now = Date.parse('2026-09-20T10:00:00Z')

describe('signGateToken and verifyGateToken', () => {
  it('round-trips a token', () => {
    const token = signGateToken({ fileId: '42', emailHash: hashEmail('a@example.org') }, secret, 30, now)
    const parsed = verifyGateToken(token, secret, now + 60_000)
    expect(parsed).toEqual({ fileId: '42', emailHash: hashEmail('a@example.org'), exp: now + 30 * 60_000 })
  })

  it('has two base64url parts and puts no email address in the URL', () => {
    const token = signGateToken({ fileId: '42', emailHash: hashEmail('a@example.org') }, secret, 30, now)
    expect(token.split('.')).toHaveLength(2)
    expect(token).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/)
    expect(Buffer.from(token.split('.')[0], 'base64url').toString()).not.toContain('a@example.org')
  })

  it('rejects an expired token', () => {
    const token = signGateToken({ fileId: '42', emailHash: 'x'.repeat(24) }, secret, 30, now)
    expect(verifyGateToken(token, secret, now + 30 * 60_000 - 1)).not.toBeNull()
    expect(verifyGateToken(token, secret, now + 30 * 60_000 + 1)).toBeNull()
  })

  it('rejects a token signed with another secret', () => {
    const token = signGateToken({ fileId: '42', emailHash: 'x'.repeat(24) }, 'other-secret', 30, now)
    expect(verifyGateToken(token, secret, now)).toBeNull()
  })

  it('rejects a tampered body', () => {
    const token = signGateToken({ fileId: '42', emailHash: 'x'.repeat(24) }, secret, 30, now)
    const [json, sig] = token.split('.')
    const body = JSON.parse(Buffer.from(json, 'base64url').toString()) as Record<string, unknown>
    const forged = Buffer.from(JSON.stringify({ ...body, fileId: '43' })).toString('base64url')
    expect(verifyGateToken(`${forged}.${sig}`, secret, now)).toBeNull()
  })

  it('rejects a tampered or truncated signature', () => {
    const token = signGateToken({ fileId: '42', emailHash: 'x'.repeat(24) }, secret, 30, now)
    const [json, sig] = token.split('.')
    const flipped = (sig[0] === 'A' ? 'B' : 'A') + sig.slice(1)
    expect(verifyGateToken(`${json}.${flipped}`, secret, now)).toBeNull()
    expect(verifyGateToken(`${json}.${sig.slice(0, -2)}`, secret, now)).toBeNull()
  })

  it('rejects malformed input', () => {
    expect(verifyGateToken(null, secret)).toBeNull()
    expect(verifyGateToken(undefined, secret)).toBeNull()
    expect(verifyGateToken('', secret)).toBeNull()
    expect(verifyGateToken('nodot', secret)).toBeNull()
    expect(verifyGateToken('a.b.c', secret)).toBeNull()
    const sig = signGateToken({ fileId: '1', emailHash: 'x' }, secret, 1, now).split('.')[1]
    expect(verifyGateToken(`not-json.${sig}`, secret, now)).toBeNull()
  })

  it('rejects a validly signed body that lacks the required claims', () => {
    // Sign an arbitrary body with the same scheme to prove claim validation happens after signature validation.
    const json = Buffer.from(JSON.stringify({ fileId: '42' })).toString('base64url')
    const sig = createHmac('sha256', secret).update(json).digest().toString('base64url')
    expect(verifyGateToken(`${json}.${sig}`, secret, now)).toBeNull()
  })

  it('reads the default lifetime from GATE_TOKEN_TTL_MINUTES', () => {
    const previous = process.env.GATE_TOKEN_TTL_MINUTES
    process.env.GATE_TOKEN_TTL_MINUTES = '5'
    try {
      const token = signGateToken({ fileId: '1', emailHash: 'x'.repeat(24) }, secret, undefined, now)
      expect(verifyGateToken(token, secret, now)?.exp).toBe(now + 5 * 60_000)
    } finally {
      if (previous === undefined) delete process.env.GATE_TOKEN_TTL_MINUTES
      else process.env.GATE_TOKEN_TTL_MINUTES = previous
    }
  })
})

describe('hashEmail and hashIp', () => {
  it('normalises case and whitespace so one person gets one hash', () => {
    expect(hashEmail('  Ada@Example.ORG ')).toBe(hashEmail('ada@example.org'))
    expect(hashEmail('ada@example.org')).not.toBe(hashEmail('bob@example.org'))
    expect(hashEmail('ada@example.org')).toHaveLength(24)
  })

  it('keys the IP hash on the secret and tolerates a missing address', () => {
    expect(hashIp('203.0.113.9', secret)).toHaveLength(24)
    expect(hashIp('203.0.113.9', secret)).not.toBe(hashIp('203.0.113.9', 'other'))
    expect(hashIp(null, secret)).toBeUndefined()
    expect(hashIp('', secret)).toBeUndefined()
  })
})

describe('isValidEmail', () => {
  it('accepts ordinary addresses', () => {
    expect(isValidEmail('ada@example.org')).toBe(true)
    expect(isValidEmail('first.last+tag@sub.example.co.uk')).toBe(true)
  })

  it('rejects obvious junk', () => {
    expect(isValidEmail('ada')).toBe(false)
    expect(isValidEmail('ada@')).toBe(false)
    expect(isValidEmail('ada@example')).toBe(false)
    expect(isValidEmail('a da@example.org')).toBe(false)
    expect(isValidEmail(`${'a'.repeat(250)}@example.org`)).toBe(false)
    expect(isValidEmail(42)).toBe(false)
    expect(isValidEmail(null)).toBe(false)
  })
})
