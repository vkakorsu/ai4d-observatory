import { redirect } from 'next/navigation'

/** Editors sign in on the CMS's own login at /admin. This address stays so older links keep working. */
export default function SignIn() {
  redirect('/admin')
}
