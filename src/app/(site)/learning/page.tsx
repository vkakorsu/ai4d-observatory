import type { Metadata } from 'next'
import { ListingPage, type PageProps } from '@/components/ListingPage'
import { Item } from '@/components/listing'
import { Icon } from '@/components/Icon'
import { learningFilters } from '@/lib/filters'

export const metadata: Metadata = {
  title: 'Learning resources',
  description: 'Courses, videos, toolkits, guides, frameworks and reading lists on responsible AI for development, curated for the region.',
  alternates: { types: { 'application/rss+xml': '/feed/learning-resources.xml' } },
}

const LEVEL: Record<string, string> = { introductory: 'Introductory', intermediate: 'Intermediate', advanced: 'Advanced' }

export default async function LearningPage({ searchParams }: PageProps) {
  const sp = await searchParams
  return (
    <ListingPage
      collection="learning-resources"
      sp={sp}
      defs={learningFilters}
      action="/learning"
      kicker="Engage"
      title="Learning resources"
      lede="Curated material for policymakers, researchers, civil society and innovators who want to build responsible AI capacity. Each resource records its provider, level, duration and language."
      noun="resource"
      renderItem={(doc, show) => (
        <Item
          collection="learning-resources"
          doc={doc}
          showNotices={show}
          meta={
            <>
              {typeof doc.level === 'string' && <span>{LEVEL[doc.level] ?? doc.level}</span>}
              {typeof doc.duration === 'string' && doc.duration && (
                <>
                  <span aria-hidden="true">·</span> <span>{doc.duration}</span>
                </>
              )}
              {typeof doc.provider === 'string' && doc.provider && (
                <>
                  <span aria-hidden="true">·</span> <span>{doc.provider}</span>
                </>
              )}
              {typeof doc.language === 'string' && doc.language && doc.language !== 'English' && (
                <>
                  <span aria-hidden="true">·</span> <Icon name="globe" size={14} /> {doc.language}
                </>
              )}
            </>
          }
        />
      )}
    />
  )
}
