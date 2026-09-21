/* Payload-generated admin route. `connection()` forces a request-time render so
 * the session cookie is read. Next.js 16 still ships a blank unauthenticated
 * admin shell (payloadcms/payload#17545); /sign-in is the working login. */
import type { Metadata } from 'next'
import { connection } from 'next/server'

import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const dynamic = 'force-dynamic'

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const Page = async ({ params, searchParams }: Args) => {
  await connection()
  return RootPage({ config, params, searchParams, importMap })
}

export default Page
