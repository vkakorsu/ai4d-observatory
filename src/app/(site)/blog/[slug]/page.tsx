import type { Metadata } from 'next'
import { ArticlePage, articleMetadata, articleStaticParams } from '@/components/ArticlePage'

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 60

export const generateStaticParams = () => articleStaticParams('posts')

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return articleMetadata('posts', slug)
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  return <ArticlePage collection="posts" slug={slug} />
}
