import type { Metadata } from 'next'
import Link from 'next/link'
import { ActiveFilters, Filters, Item, ItemList, Pagination, ResultsHead } from '@/components/listing'
import type { PageProps } from '@/components/ListingPage'
import { Breadcrumbs, Empty, PageHeader } from '@/components/ui'
import { Icon } from '@/components/Icon'
import { getPayloadClient } from '@/lib/payload'
import { filterOptions, getSettings, listCollection } from '@/lib/site'
import { commentaryFilters } from '@/lib/filters'
import { getParam } from '@/lib/queries'
import type { ContentTypeKey } from '@/lib/content-types'

export const metadata: Metadata = {
  title: 'Commentary. Blog, op-eds and news',
  description: 'Blog posts and commentary, op-eds and external publications, and news from the Asia AI4D Observatory.',
  alternates: { types: { 'application/rss+xml': '/feed/posts.xml' } },
}

const TYPES: Array<{ value: ContentTypeKey; label: string; lede: string }> = [
  { value: 'posts', label: 'Blog and commentary', lede: 'Reflections and analysis from the Observatory team, partners and guest contributors.' },
  { value: 'op-eds', label: 'Op-eds and external publications', lede: 'Writing by Observatory researchers published in newspapers, journals and partner outlets.' },
  { value: 'news', label: 'News', lede: 'Announcements and updates from the Observatory and the AI4D network.' },
]

export default async function CommentaryPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const typeParam = getParam(sp, 'type')
  const type = TYPES.find((t) => t.value === typeParam) ?? TYPES[0]
  const action = '/commentary'
  const payload = await getPayloadClient()
  const [settings, options, result] = await Promise.all([
    getSettings(),
    filterOptions(payload, commentaryFilters),
    listCollection<Record<string, unknown> & { id: string | number }>(payload, type.value, sp, commentaryFilters),
  ])
  const show = Boolean(settings.showPrototypeNotices)
  // Keep the type when filters change.
  const spWithType = { ...sp, type: type.value }

  return (
    <div className="container">
      <Breadcrumbs items={[{ label: 'Commentary' }]} />
      <PageHeader kicker="Commentary" title={type.label} lede={type.lede} />
      <nav className="tabs" aria-label="Commentary type">
        {TYPES.map((t) => (
          <Link key={t.value} href={`${action}?type=${t.value}`} aria-current={t.value === type.value ? 'page' : undefined}>
            {t.label}
          </Link>
        ))}
      </nav>
      <div className="layout-rail">
        <aside className="rail" aria-label="Filter results">
          <Filters
            defs={commentaryFilters}
            options={options}
            sp={spWithType}
            action={action}
            extra={<input type="hidden" name="type" value={type.value} />}
          />
        </aside>
        <div>
          <ResultsHead total={result.totalDocs} noun="item">
            <p>
              <a href="/feed.xml">
                <Icon name="rss" size={14} /> RSS
              </a>
            </p>
          </ResultsHead>
          <ActiveFilters defs={commentaryFilters} options={options} sp={spWithType} action={`${action}?type=${type.value}`} />
          {result.docs.length === 0 ? (
            <Empty title="Nothing here yet">
              <p>No {type.label.toLowerCase()} match these filters.</p>
            </Empty>
          ) : (
            <ItemList>
              {result.docs.map((doc) => (
                <li key={String(doc.id)}>
                  <Item
                    collection={type.value}
                    doc={doc}
                    showNotices={show}
                    meta={
                      type.value === 'op-eds' && typeof doc.outlet === 'string' ? (
                        <>
                          <Icon name="external" size={14} /> Published in {doc.outlet}
                        </>
                      ) : undefined
                    }
                  />
                </li>
              ))}
            </ItemList>
          )}
          <Pagination page={result.page} totalPages={result.totalPages} sp={spWithType} action={action} />
        </div>
      </div>
    </div>
  )
}
