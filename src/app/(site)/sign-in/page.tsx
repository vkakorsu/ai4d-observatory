import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Breadcrumbs, PageHeader } from '@/components/ui'
import { SignInForm } from './SignInForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Editor sign-in',
  description: 'Sign in to the Asia AI4D Observatory CMS.',
  robots: { index: false, follow: false },
}

export default async function SignInPage() {
  const token = (await cookies()).get('payload-token')?.value
  if (token) redirect('/admin')

  return (
    <div className="container">
      <Breadcrumbs items={[{ label: 'Editor sign-in' }]} />
      <PageHeader
        kicker="CMS"
        title="Editor sign-in"
        lede="Sign in to draft, review and publish Observatory content. The administrative dashboard opens after a successful sign-in."
      />
      <div style={{ maxWidth: '28rem', paddingBottom: 'var(--s-8)' }}>
        <SignInForm />
      </div>
    </div>
  )
}
