import type { ReactNode } from 'react'
import type { Where } from 'payload'
import { ActiveFilters, Filters, Item, ItemList, Pagination, ResultsHead } from './listing'
import { Breadcrumbs, Empty, PageHeader } from './ui'
import { getPayloadClient } from '@/lib/payload'
import { filterOptions, getSettings, listCollection } from '@/lib/site'
import type { FilterDef, SearchParams } from '@/lib/queries'
import type { ContentTypeKey } from '@/lib/content-types'

/**
 * One listing page implementation for every repository module.
 * The URL is the state. Filters, free text and page number are all query parameters,
 * so any filtered view can be shared, bookmarked and indexed.
 */
export async function ListingPage({
  collection,
  sp,
  defs,
  action,
  kicker,
  title,
  lede,
  noun,
  sort,
  extraWhere,
  extraControls,
  cover = false,
  renderItem,
  emptyTitle = 'Nothing matches these filters',
  intro,
  after,
}: {
  collection: ContentTypeKey
  sp: SearchParams
  defs: FilterDef[]
  action: string
  kicker: string
  title: string
  lede?: ReactNode
  noun: string
  sort?: string
  extraWhere?: Where
  extraControls?: ReactNode
  cover?: boolean
  renderItem?: (doc: Record<string, unknown> & { id: string | number }, show: boolean) => ReactNode
  emptyTitle?: string
  intro?: ReactNode
  after?: ReactNode
}) {
  const payload = await getPayloadClient()
  const [settings, options, result] = await Promise.all([
    getSettings(),
    filterOptions(payload, defs),
    listCollection<Record<string, unknown> & { id: string | number }>(payload, collection, sp, defs, { sort, extraWhere }),
  ])
  const show = Boolean(settings.showPrototypeNotices)
  return (
    <div className="container">
      <Breadcrumbs items={[{ label: title }]} />
      <PageHeader kicker={kicker} title={title} lede={lede} />
      {intro}
      <div className="layout-rail">
        <aside className="rail" aria-label="Filter results">
          <Filters defs={defs} options={options} sp={sp} action={action} extra={extraControls} />
        </aside>
        <div>
          <ResultsHead total={result.totalDocs} noun={noun} />
          <ActiveFilters defs={defs} options={options} sp={sp} action={action} />
          {result.docs.length === 0 ? (
            <Empty title={emptyTitle}>
              <p>Try removing a filter or searching with a different word.</p>
            </Empty>
          ) : (
            <ItemList>
              {result.docs.map((doc) => (
                <li key={String(doc.id)}>
                  {renderItem ? renderItem(doc, show) : <Item collection={collection} doc={doc} showNotices={show} cover={cover} />}
                </li>
              ))}
            </ItemList>
          )}
          <Pagination page={result.page} totalPages={result.totalPages} sp={sp} action={action} />
          {after}
        </div>
      </div>
    </div>
  )
}

export type PageProps = {
  params: Promise<Record<string, string>>
  searchParams: Promise<SearchParams>
}
