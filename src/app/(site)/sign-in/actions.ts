'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { generatePayloadCookie } from 'payload/shared'
import { getPayloadClient } from '@/lib/payload'

export type SignInState = { error?: string }

export async function signInAction(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  if (!email.includes('@') || !password) {
    return { error: 'Enter the email and password for your editor account.' }
  }

  try {
    const payload = await getPayloadClient()
    const result = await payload.login({
      collection: 'users',
      data: { email, password },
    })
    const auth = payload.collections.users?.config.auth
    if (!result.token || !auth) {
      return { error: 'Sign-in did not start a session. Try again.' }
    }

    const cookie = generatePayloadCookie({
      collectionAuthConfig: auth,
      cookiePrefix: payload.config.cookiePrefix,
      returnCookieAsObject: true,
      token: result.token,
    })
    const sameSiteRaw = cookie.sameSite?.toLowerCase()
    const sameSite = sameSiteRaw === 'strict' || sameSiteRaw === 'none' || sameSiteRaw === 'lax' ? sameSiteRaw : 'lax'
    const store = await cookies()
    store.set({
      name: cookie.name,
      value: cookie.value ?? '',
      httpOnly: true,
      path: cookie.path || '/',
      secure: Boolean(cookie.secure) || Boolean(process.env.VERCEL),
      sameSite,
      expires: cookie.expires ? new Date(cookie.expires) : undefined,
    })
  } catch {
    return {
      error: 'Those details were not recognised. Check the email and password, or wait if the account is locked.',
    }
  }

  redirect('/admin')
}
