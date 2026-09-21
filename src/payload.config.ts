import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { buildConfig, type Plugin } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchPlugin } from '@payloadcms/plugin-search'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

import { Countries, Enablers, RaiDimensions, StakeholderTypes, Tags, Topics } from './collections/taxonomies'
import {
  Datasets,
  Events,
  LearningResources,
  News,
  Newsletters,
  OpEds,
  Opportunities,
  Organisations,
  Pages,
  People,
  Posts,
  Publications,
  UseCases,
} from './collections/content'
import { IndicatorValues, Indicators } from './collections/data'
import { DownloadRequests, EventRegistrations, Media, Subscribers, Users } from './collections/system'
import { Home, SiteSettings } from './globals'
import { formEndpoints } from './endpoints/forms'
import { searchBeforeSync, searchCollections, searchPriorities } from './hooks/search'
import { isEditor, isLoggedIn } from './access/roles'
import { purgeExpiredRecordsTask } from './jobs/retention'
import { createDatabaseAdapter } from './lib/database'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * One configuration file describes the whole content platform.
 * Database adapter, storage, search and localisation are switched by environment variables,
 * so the same code runs on a laptop, on the evaluation host and on the Client's server.
 */

const db = await createDatabaseAdapter()

const plugins: Plugin[] = [
  searchPlugin({
    collections: searchCollections,
    defaultPriorities: searchPriorities,
    beforeSync: searchBeforeSync,
    searchOverrides: {
      slug: 'search',
      admin: { group: 'Administration', description: 'Unified search index, maintained automatically on every save.' },
      access: { read: () => true, update: isEditor, delete: isEditor },
      fields: ({ defaultFields }) => [
        ...defaultFields,
        { name: 'excerpt', type: 'textarea' },
        { name: 'keywords', type: 'textarea', admin: { description: 'Taxonomy names and type label, used for matching.' } },
        { name: 'typeLabel', type: 'text' },
        { name: 'path', type: 'text' },
        { name: 'countries', type: 'text' },
        { name: 'topics', type: 'text' },
        { name: 'publishedAt', type: 'date' },
      ],
    },
  }),
  /**
   * CSV and JSON export from every list view (Section 2.1 "viewed and exported in a structured format",
   * Section 3.1.2 "view or export relevant download records"). Exports run synchronously, so they work
   * on a serverless host as well as on the Client's server. Import is switched off for the record
   * collections, which are only ever written by the public forms.
   */
  importExportPlugin({
    collections: [
      { slug: 'download-requests', export: { disableJobsQueue: true }, import: false },
      { slug: 'subscribers', export: { disableJobsQueue: true }, import: false },
      { slug: 'event-registrations', export: { disableJobsQueue: true }, import: false },
      ...(['use-cases', 'publications', 'datasets', 'posts', 'op-eds', 'news', 'people', 'organisations', 'events', 'learning-resources', 'opportunities', 'newsletters', 'indicators', 'indicator-values', 'pages', 'countries', 'topics', 'enablers', 'rai-dimensions', 'stakeholder-types', 'tags'] as const).map((slug) => ({
        slug,
        export: { disableJobsQueue: true },
        import: { disableJobsQueue: true },
      })),
    ],
    overrideExportCollection: ({ collection }) => ({
      ...collection,
      admin: { ...collection.admin, group: 'Records' },
      access: { ...collection.access, create: isEditor, read: isLoggedIn, update: isEditor, delete: isEditor },
    }),
    overrideImportCollection: ({ collection }) => ({
      ...collection,
      admin: { ...collection.admin, group: 'Records' },
      access: { ...collection.access, create: isEditor, read: isLoggedIn, update: isEditor, delete: isEditor },
    }),
  }),
]

/**
 * Always register the adapter so `payload generate:importmap` includes
 * `VercelBlobClientUploadHandler`. Leaving it out locally produced a blank
 * /admin on Vercel: getFromImportMap threw and RootPage rendered nothing.
 * Without a token the plugin disables itself and media stays on disk.
 */
plugins.push(
  vercelBlobStorage({
    collections: { media: true },
    enabled: process.env.MEDIA_STORAGE === 'vercel-blob',
    token: process.env.BLOB_READ_WRITE_TOKEN || '',
  }),
)

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default buildConfig({
  serverURL: siteUrl,
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' | Asia AI4D Observatory CMS',
    },
    dateFormat: 'd MMMM yyyy HH:mm',
  },
  collections: [
    // Repository
    UseCases,
    Publications,
    Datasets,
    // Data
    Indicators,
    IndicatorValues,
    // Commentary
    Posts,
    OpEds,
    News,
    // Directory
    People,
    Organisations,
    // Engage
    Events,
    LearningResources,
    Opportunities,
    Newsletters,
    // Site
    Pages,
    // Taxonomies
    Countries,
    Topics,
    Enablers,
    RaiDimensions,
    StakeholderTypes,
    Tags,
    // Records
    DownloadRequests,
    Subscribers,
    EventRegistrations,
    // Administration
    Users,
    Media,
  ],
  globals: [SiteSettings, Home],
  endpoints: formEndpoints,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db,
  sharp,
  /**
   * Multilingual readiness (Section 3.1.5 f). English is the only active locale.
   * Adding a language is one entry here plus per-field `localized: true` flags.
   */
  localization: {
    locales: [{ code: 'en', label: 'English' }],
    defaultLocale: 'en',
    fallback: true,
  },
  cors: [siteUrl],
  csrf: [siteUrl],
  upload: { limits: { fileSize: 50 * 1024 * 1024 } },
  /**
   * Scheduled publishing and the nightly retention purge are jobs; something has to run the queue.
   * On a long-running server the built-in runner checks every minute. Serverless hosts (Vercel) should
   * instead call GET /api/payload-jobs/run from a platform cron with the CRON_SECRET header, so the runner is off there.
   */
  jobs: {
    tasks: [purgeExpiredRecordsTask],
    autoRun: process.env.VERCEL || process.env.JOBS_AUTORUN === 'false' ? [] : [{ cron: '* * * * *', allQueues: true, limit: 10 }],
    access: {
      run: ({ req }) => {
        if (req.user) return true
        // An unset secret must not match "Bearer undefined".
        const secret = process.env.CRON_SECRET
        return Boolean(secret) && req.headers.get('authorization') === `Bearer ${secret}`
      },
    },
  },
  plugins,
})
