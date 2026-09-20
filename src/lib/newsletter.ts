/**
 * Newsletter provider adapters (Section 3.1.2, "integration with the Client's selected email/newsletter service").
 * The Client has not yet selected a service, so the integration is an interface with three implementations.
 * Subscribers are always stored in the CMS as well, so the provider can be changed without losing the list.
 */

export type SubscribeInput = {
  email: string
  name?: string
  organisation?: string
  source?: string
}

export type SubscribeResult = {
  provider: ProviderName
  status: 'subscribed' | 'pending'
  providerId?: string
}

export type NewsletterProvider = {
  name: ProviderName
  /** True when the provider has the credentials it needs. */
  configured: () => boolean
  subscribe: (input: SubscribeInput) => Promise<SubscribeResult>
}

export type ProviderName = 'local' | 'brevo' | 'mailchimp'

export const PROVIDER_NAMES: ProviderName[] = ['local', 'brevo', 'mailchimp']

type Env = Record<string, string | undefined>

/** Local store only. Production default until the Client's account exists. */
export const localProvider = (): NewsletterProvider => ({
  name: 'local',
  configured: () => true,
  subscribe: async () => ({ provider: 'local', status: 'subscribed' }),
})

/** Brevo (formerly Sendinblue). Contacts API v3. Double opt-in is configured in the Brevo account. */
export const brevoProvider = (env: Env = process.env, fetchImpl: typeof fetch = fetch): NewsletterProvider => ({
  name: 'brevo',
  configured: () => Boolean(env.BREVO_API_KEY && env.BREVO_LIST_ID),
  subscribe: async ({ email, name, organisation }) => {
    const res = await fetchImpl('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: { 'api-key': env.BREVO_API_KEY as string, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        email,
        updateEnabled: true,
        listIds: [Number(env.BREVO_LIST_ID)],
        attributes: { FIRSTNAME: name ?? '', ORGANISATION: organisation ?? '' },
      }),
    })
    if (!res.ok && res.status !== 204) {
      const text = await res.text().catch(() => '')
      throw new Error(`Brevo responded ${res.status}. ${text.slice(0, 200)}`)
    }
    const data = res.status === 204 ? {} : ((await res.json().catch(() => ({}))) as { id?: number })
    return { provider: 'brevo', status: 'subscribed', providerId: data.id ? String(data.id) : undefined }
  },
})

/** Mailchimp Marketing API. Uses "pending" so Mailchimp sends its own confirmation email. */
export const mailchimpProvider = (env: Env = process.env, fetchImpl: typeof fetch = fetch): NewsletterProvider => ({
  name: 'mailchimp',
  configured: () => Boolean(env.MAILCHIMP_API_KEY && env.MAILCHIMP_SERVER_PREFIX && env.MAILCHIMP_LIST_ID),
  subscribe: async ({ email, name, organisation }) => {
    const url = `https://${env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${env.MAILCHIMP_LIST_ID}/members`
    const auth = Buffer.from(`anystring:${env.MAILCHIMP_API_KEY}`).toString('base64')
    const res = await fetchImpl(url, {
      method: 'POST',
      headers: { authorization: `Basic ${auth}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        email_address: email,
        status: 'pending',
        merge_fields: { FNAME: name ?? '', ORG: organisation ?? '' },
      }),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      // Mailchimp returns 400 "Member Exists" for duplicates. Treat as success.
      if (res.status === 400 && /exists/i.test(text)) return { provider: 'mailchimp', status: 'subscribed' }
      throw new Error(`Mailchimp responded ${res.status}. ${text.slice(0, 200)}`)
    }
    const data = (await res.json().catch(() => ({}))) as { id?: string }
    return { provider: 'mailchimp', status: 'pending', providerId: data.id }
  },
})

/** Pick the provider from configuration. Falls back to local if the chosen provider lacks credentials. */
export const selectProvider = (env: Env = process.env, fetchImpl: typeof fetch = fetch): NewsletterProvider => {
  const wanted = (env.NEWSLETTER_PROVIDER ?? 'local') as ProviderName
  const candidates: Record<ProviderName, NewsletterProvider> = {
    local: localProvider(),
    brevo: brevoProvider(env, fetchImpl),
    mailchimp: mailchimpProvider(env, fetchImpl),
  }
  const chosen = candidates[wanted] ?? candidates.local
  return chosen.configured() ? chosen : candidates.local
}
