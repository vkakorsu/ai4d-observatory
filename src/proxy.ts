import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/**
 * Payload's unauthenticated admin views (login, forgot password) render blank on
 * Next.js 16 (payloadcms/payload#17545). Send signed-out editors to the Observatory
 * sign-in page. A valid session cookie still reaches /admin, which hydrates normally.
 */
export function proxy(request: NextRequest) {
  if (request.cookies.get('payload-token')?.value) {
    return NextResponse.next()
  }
  const url = request.nextUrl.clone()
  url.pathname = '/sign-in'
  url.search = ''
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
