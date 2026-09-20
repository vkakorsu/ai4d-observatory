import type { Metadata } from 'next'
import { ListingPage, type PageProps } from '@/components/ListingPage'
import { datasetFilters } from '@/lib/filters'

export const metadata: Metadata = {
  title: 'Datasets',
  description:
    'Datasets behind the Observatory’s benchmarking and mapping work, with metadata, methods, licence terms and download or access links.',
  alternates: { types: { 'application/rss+xml': '/feed/datasets.xml' } },
}

export default async function DatasetsPage({ searchParams }: PageProps) {
  const sp = await searchParams
  return (
    <ListingPage
      collection="datasets"
      sp={sp}
      defs={datasetFilters}
      action="/datasets"
      kicker="Repository"
      title="Datasets"
      lede="Each dataset has a landing page with its source, method notes, coverage, licence and access links, and is connected to the indicators, publications and use cases that draw on it."
      noun="dataset"
      cover
    />
  )
}
