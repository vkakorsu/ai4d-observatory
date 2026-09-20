/**
 * Registry of public content types.
 * One place that maps RFP modules (Section 3.1.2) to collections, routes and labels.
 * Used by search results, listings, hub pages, sitemaps, feeds and the tests.
 */

export type ContentTypeKey =
  | 'use-cases'
  | 'publications'
  | 'datasets'
  | 'posts'
  | 'op-eds'
  | 'news'
  | 'people'
  | 'organisations'
  | 'events'
  | 'learning-resources'
  | 'opportunities'
  | 'newsletters'
  | 'indicators'
  | 'pages'

export type ContentTypeDef = {
  collection: ContentTypeKey
  label: string
  plural: string
  /** Base path of detail pages. */
  base: string
  /** RFP module in Section 3.1.2 this type serves. */
  rfpModule: string
  /** Weight in unified search. Higher ranks first on ties. */
  searchPriority: number
  titleField: 'title' | 'name'
  /** Taxonomies this type carries, which drive hub pages and filters. */
  taxonomies: Array<'countries' | 'topics' | 'enablers' | 'raiDimensions' | 'tags'>
  /** Listing route (may be shared across types). */
  listing: string
  inSearch: boolean
  inSitemap: boolean
}

export const CONTENT_TYPES: Record<ContentTypeKey, ContentTypeDef> = {
  'use-cases': {
    collection: 'use-cases',
    label: 'Use case',
    plural: 'Use cases',
    base: '/use-cases',
    listing: '/use-cases',
    rfpModule: 'Responsible AI use-case / innovation repository',
    searchPriority: 50,
    titleField: 'title',
    taxonomies: ['countries', 'topics', 'enablers', 'raiDimensions', 'tags'],
    inSearch: true,
    inSitemap: true,
  },
  publications: {
    collection: 'publications',
    label: 'Publication',
    plural: 'Publications',
    base: '/publications',
    listing: '/publications',
    rfpModule: 'Reports and mapping studies. Research briefs / policy briefs / innovation briefs',
    searchPriority: 45,
    titleField: 'title',
    taxonomies: ['countries', 'topics', 'enablers', 'raiDimensions', 'tags'],
    inSearch: true,
    inSitemap: true,
  },
  datasets: {
    collection: 'datasets',
    label: 'Dataset',
    plural: 'Datasets',
    base: '/datasets',
    listing: '/datasets',
    rfpModule: 'Datasets',
    searchPriority: 40,
    titleField: 'title',
    taxonomies: ['countries', 'topics', 'enablers', 'tags'],
    inSearch: true,
    inSitemap: true,
  },
  posts: {
    collection: 'posts',
    label: 'Blog',
    plural: 'Blog and commentary',
    base: '/blog',
    listing: '/commentary',
    rfpModule: 'Blogs and commentary',
    searchPriority: 30,
    titleField: 'title',
    taxonomies: ['countries', 'topics', 'enablers', 'tags'],
    inSearch: true,
    inSitemap: true,
  },
  'op-eds': {
    collection: 'op-eds',
    label: 'Op-ed',
    plural: 'Op-eds and external publications',
    base: '/op-eds',
    listing: '/commentary?type=op-eds',
    rfpModule: 'Op-eds / external publications',
    searchPriority: 25,
    titleField: 'title',
    taxonomies: ['countries', 'topics', 'enablers', 'tags'],
    inSearch: true,
    inSitemap: true,
  },
  news: {
    collection: 'news',
    label: 'News',
    plural: 'News',
    base: '/news',
    listing: '/commentary?type=news',
    rfpModule: 'News',
    searchPriority: 20,
    titleField: 'title',
    taxonomies: ['countries', 'topics', 'enablers', 'tags'],
    inSearch: true,
    inSitemap: true,
  },
  people: {
    collection: 'people',
    label: 'Person',
    plural: 'People',
    base: '/people',
    listing: '/directory',
    rfpModule: 'People and organisations',
    searchPriority: 35,
    titleField: 'name',
    taxonomies: ['countries', 'enablers', 'tags'],
    inSearch: true,
    inSitemap: true,
  },
  organisations: {
    collection: 'organisations',
    label: 'Organisation',
    plural: 'Organisations',
    base: '/organisations',
    listing: '/directory?view=organisations',
    rfpModule: 'People and organisations',
    searchPriority: 35,
    titleField: 'name',
    taxonomies: ['countries', 'topics', 'enablers', 'tags'],
    inSearch: true,
    inSitemap: true,
  },
  events: {
    collection: 'events',
    label: 'Event',
    plural: 'Events',
    base: '/events',
    listing: '/events',
    rfpModule: 'Events',
    searchPriority: 30,
    titleField: 'title',
    taxonomies: ['countries', 'topics', 'enablers', 'tags'],
    inSearch: true,
    inSitemap: true,
  },
  'learning-resources': {
    collection: 'learning-resources',
    label: 'Learning resource',
    plural: 'Learning resources',
    base: '/learning',
    listing: '/learning',
    rfpModule: 'Learning Resources',
    searchPriority: 30,
    titleField: 'title',
    taxonomies: ['countries', 'topics', 'enablers', 'raiDimensions', 'tags'],
    inSearch: true,
    inSitemap: true,
  },
  opportunities: {
    collection: 'opportunities',
    label: 'Opportunity',
    plural: 'Opportunities',
    base: '/opportunities',
    listing: '/opportunities',
    rfpModule: 'Opportunities',
    searchPriority: 30,
    titleField: 'title',
    taxonomies: ['countries', 'topics', 'enablers', 'tags'],
    inSearch: true,
    inSitemap: true,
  },
  newsletters: {
    collection: 'newsletters',
    label: 'Newsletter',
    plural: 'Newsletter',
    base: '/newsletter',
    listing: '/newsletter',
    rfpModule: 'Newsletter',
    searchPriority: 15,
    titleField: 'title',
    taxonomies: [],
    inSearch: true,
    inSitemap: true,
  },
  indicators: {
    collection: 'indicators',
    label: 'Indicator',
    plural: 'Data and maps',
    base: '/data',
    listing: '/data',
    rfpModule: 'Interactive maps and data',
    searchPriority: 40,
    titleField: 'name',
    taxonomies: [],
    inSearch: true,
    inSitemap: true,
  },
  pages: {
    collection: 'pages',
    label: 'Page',
    plural: 'Pages',
    base: '',
    listing: '/about',
    rfpModule: 'Home / About',
    searchPriority: 10,
    titleField: 'title',
    taxonomies: [],
    inSearch: true,
    inSitemap: true,
  },
}

/** The fourteen modules named in Section 3.1.2 of the RFP, for the coverage test. */
export const RFP_MODULES = [
  'Home / About',
  'Responsible AI use-case / innovation repository',
  'Interactive maps and data',
  'Reports and mapping studies',
  'Research briefs / policy briefs / innovation briefs',
  'Blogs and commentary',
  'Op-eds / external publications',
  'Datasets',
  'People and organisations',
  'Events',
  'News',
  'Learning Resources',
  'Newsletter',
  'Opportunities',
] as const

export const contentTypeList = Object.values(CONTENT_TYPES)

export const searchableTypes = contentTypeList.filter((t) => t.inSearch).map((t) => t.collection)

export const pathFor = (collection: ContentTypeKey, slug: string): string => {
  const def = CONTENT_TYPES[collection]
  if (collection === 'pages') return `/${slug}`
  return `${def.base}/${slug}`
}

export const labelFor = (collection: string): string =>
  (CONTENT_TYPES as Record<string, ContentTypeDef>)[collection]?.label ?? collection
