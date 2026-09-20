import type { Metadata } from 'next'
import { ListingPage, type PageProps } from '@/components/ListingPage'
import { useCaseFilters } from '@/lib/filters'

export const metadata: Metadata = {
  title: 'Responsible AI use cases',
  description:
    'A searchable repository of responsible AI use cases and innovations across South and Southeast Asia, filterable by country, sector, ecosystem enabler and responsible AI dimension.',
  alternates: { types: { 'application/rss+xml': '/feed/use-cases.xml' } },
}

export default async function UseCasesPage({ searchParams }: PageProps) {
  const sp = await searchParams
  return (
    <ListingPage
      collection="use-cases"
      sp={sp}
      defs={useCaseFilters}
      action="/use-cases"
      kicker="Repository"
      title="Responsible AI use cases"
      lede="How AI is being designed, governed and scaled for development across the region. Each entry records the problem, the responsible AI practices applied, the organisations involved and what is known about impact."
      noun="use case"
      cover
    />
  )
}
