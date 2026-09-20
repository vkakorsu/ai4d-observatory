import { describe, expect, it, vi } from 'vitest'
import { brevoProvider, mailchimpProvider, PROVIDER_NAMES, selectProvider } from '@/lib/newsletter'

/** Newsletter adapter selection and validation. */

const jsonResponse = (status: number, body: unknown = {}) =>
  new Response(typeof body === 'string' ? body : JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

const fetchReturning = (res: Response) => vi.fn<typeof fetch>().mockResolvedValue(res)

describe('selectProvider', () => {
  it('defaults to the local store', () => {
    expect(selectProvider({}).name).toBe('local')
    expect(selectProvider({ NEWSLETTER_PROVIDER: undefined }).name).toBe('local')
  })

  it('falls back to local when the chosen provider lacks credentials', () => {
    expect(selectProvider({ NEWSLETTER_PROVIDER: 'brevo' }).name).toBe('local')
    expect(selectProvider({ NEWSLETTER_PROVIDER: 'brevo', BREVO_API_KEY: 'k' }).name).toBe('local')
    expect(selectProvider({ NEWSLETTER_PROVIDER: 'mailchimp', MAILCHIMP_API_KEY: 'k' }).name).toBe('local')
  })

  it('falls back to local for an unknown provider name', () => {
    expect(selectProvider({ NEWSLETTER_PROVIDER: 'sendgrid' }).name).toBe('local')
  })

  it('uses the configured provider when credentials are complete', () => {
    expect(selectProvider({ NEWSLETTER_PROVIDER: 'brevo', BREVO_API_KEY: 'k', BREVO_LIST_ID: '7' }).name).toBe('brevo')
    expect(
      selectProvider({
        NEWSLETTER_PROVIDER: 'mailchimp',
        MAILCHIMP_API_KEY: 'k',
        MAILCHIMP_SERVER_PREFIX: 'us21',
        MAILCHIMP_LIST_ID: 'abc',
      }).name,
    ).toBe('mailchimp')
  })

  it('lists every provider name exactly once', () => {
    expect(PROVIDER_NAMES).toEqual(['local', 'brevo', 'mailchimp'])
  })

  it('local subscribe succeeds without network access', async () => {
    const res = await selectProvider({}).subscribe({ email: 'a@example.org' })
    expect(res).toEqual({ provider: 'local', status: 'subscribed' })
  })
})

describe('brevoProvider', () => {
  const env = { BREVO_API_KEY: 'brevo-key', BREVO_LIST_ID: '12' }

  it('posts the contact with the list id and attributes', async () => {
    const fetchImpl = fetchReturning(jsonResponse(201, { id: 991 }))
    const result = await brevoProvider(env, fetchImpl).subscribe({ email: 'a@example.org', name: 'Ada', organisation: 'LIRNEasia' })

    expect(result).toEqual({ provider: 'brevo', status: 'subscribed', providerId: '991' })
    expect(fetchImpl).toHaveBeenCalledTimes(1)
    const [url, init] = fetchImpl.mock.calls[0]
    expect(url).toBe('https://api.brevo.com/v3/contacts')
    expect(init?.method).toBe('POST')
    expect((init?.headers as Record<string, string>)['api-key']).toBe('brevo-key')
    expect(JSON.parse(String(init?.body))).toEqual({
      email: 'a@example.org',
      updateEnabled: true,
      listIds: [12],
      attributes: { FIRSTNAME: 'Ada', ORGANISATION: 'LIRNEasia' },
    })
  })

  it('treats 204 (existing contact updated) as success', async () => {
    const fetchImpl = fetchReturning(new Response(null, { status: 204 }))
    const result = await brevoProvider(env, fetchImpl).subscribe({ email: 'a@example.org' })
    expect(result).toEqual({ provider: 'brevo', status: 'subscribed', providerId: undefined })
  })

  it('throws with the status on failure', async () => {
    const fetchImpl = fetchReturning(jsonResponse(401, { message: 'Key not found' }))
    await expect(brevoProvider(env, fetchImpl).subscribe({ email: 'a@example.org' })).rejects.toThrow(/401/)
  })
})

describe('mailchimpProvider', () => {
  const env = { MAILCHIMP_API_KEY: 'mc-key', MAILCHIMP_SERVER_PREFIX: 'us21', MAILCHIMP_LIST_ID: 'list1' }

  it('creates a pending member so Mailchimp sends its own confirmation', async () => {
    const fetchImpl = fetchReturning(jsonResponse(200, { id: 'm1' }))
    const result = await mailchimpProvider(env, fetchImpl).subscribe({ email: 'a@example.org', name: 'Ada' })

    expect(result).toEqual({ provider: 'mailchimp', status: 'pending', providerId: 'm1' })
    const [url, init] = fetchImpl.mock.calls[0]
    expect(url).toBe('https://us21.api.mailchimp.com/3.0/lists/list1/members')
    expect((init?.headers as Record<string, string>).authorization).toMatch(/^Basic /)
    expect(JSON.parse(String(init?.body))).toMatchObject({ email_address: 'a@example.org', status: 'pending' })
  })

  it('treats "Member Exists" as already subscribed', async () => {
    const fetchImpl = fetchReturning(jsonResponse(400, { title: 'Member Exists' }))
    const result = await mailchimpProvider(env, fetchImpl).subscribe({ email: 'a@example.org' })
    expect(result).toEqual({ provider: 'mailchimp', status: 'subscribed' })
  })

  it('throws on other errors', async () => {
    const fetchImpl = fetchReturning(jsonResponse(500, 'boom'))
    await expect(mailchimpProvider(env, fetchImpl).subscribe({ email: 'a@example.org' })).rejects.toThrow(/500/)
  })
})
