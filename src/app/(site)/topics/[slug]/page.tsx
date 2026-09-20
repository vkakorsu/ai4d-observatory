import type { Metadata } from 'next'
import { HubPage, hubMetadata, hubStaticParams } from '@/components/HubPage'

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 60

export const generateStaticParams = () => hubStaticParams('topics')

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return hubMetadata('topics', slug, '/topics')
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  return <HubPage kind="topics" slug={slug} />
}
