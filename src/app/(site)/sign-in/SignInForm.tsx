'use client'

import { useActionState, useId } from 'react'
import { signInAction, type SignInState } from './actions'

const initial: SignInState = {}

export function SignInForm() {
  const id = useId()
  const [state, action, pending] = useActionState(signInAction, initial)

  return (
    <form className="form" action={action} noValidate>
      <p className="field__hint" id={`${id}-purpose`}>
        Use the editor account you were given. Sessions last eight hours. After five failed attempts the account locks
        for ten minutes.
      </p>
      {state.error && (
        <p className="form__status form__status--error" role="alert">
          {state.error}
        </p>
      )}
      <div className="field">
        <label htmlFor={`${id}-email`}>Email address</label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="username"
          required
          aria-describedby={`${id}-purpose`}
        />
      </div>
      <div className="field">
        <label htmlFor={`${id}-password`}>Password</label>
        <input id={`${id}-password`} name="password" type="password" autoComplete="current-password" required />
      </div>
      <button className="btn btn--primary" type="submit" disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
