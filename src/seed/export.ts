import 'dotenv/config'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { getPayload, type CollectionSlug, type GlobalSlug, type Payload } from 'payload'
import config from '@payload-config'
import { toCsv } from '@/lib/stats'
import { plainText } from '@/lib/lexical'

/*
 * Export every collection and global as JSON and CSV (Section 3.1.8, portability).
 * Output goes to ./export/<timestamp>/. Relationships are exported as ids in CSV and as
 * populated documents (one level) in JSON, so the data can be re-imported or read elsewhere.
 *
 *   pnpm export
 *   pnpm export -- --out ./some/dir
 */

const CONTENT: CollectionSlug[] = [
  'use-cases', 'publications', 'datasets', 'indicators', 'indicator-values', 'posts', 'op-eds', 'news',
  'people', 'organisations', 'events', 'learning-resources', 'opportunities', 'newsletters', 'pages',
  'countries', 'topics', 'enablers', 'rai-dimensions', 'stakeholder-types', 'tags', 'media',
]

/** Records that contain personal data. Exported separately so they can be excluded from a public copy. */
const RECORDS: CollectionSlug[] = ['download-requests', 'subscribers', 'event-registrations']

const GLOBALS: GlobalSlug[] = ['site-settings', 'home']

type Row = Record<string, string | number | null | undefined>

/** Flatten one document to a CSV row. Rich text becomes plain text. Relationships become ids. */
const flatten = (doc: Record<string, unknown>): Row => {
  const row: Row = {}
  for (const [key, value] of Object.entries(doc)) {
    if (value === null || value === undefined) {
      row[key] = ''
    } else if (typeof value === 'string' || typeof value === 'number') {
      row[key] = value
    } else if (typeof value === 'boolean') {
      row[key] = value ? 'true' : 'false'
    } else if (Array.isArray(value)) {
      row[key] = value
        .map((v) => (v && typeof v === 'object' ? ((v as { id?: unknown; value?: { id?: unknown } | unknown }).id ?? (v as { value?: { id?: unknown } }).value?.id ?? JSON.stringify(v)) : v))
        .map(String)
        .join('; ')
    } else if (typeof value === 'object') {
      const v = value as Record<string, unknown>
      if ('root' in v) row[key] = plainText(v as never)
      else if ('id' in v) row[key] = String(v.id)
      else row[key] = JSON.stringify(v)
    }
  }
  return row
}

const dump = async (payload: Payload, collection: CollectionSlug, dir: string, depth: number) => {
  const res = await payload.find({ collection, limit: 0, pagination: false, depth, overrideAccess: true, draft: false })
  const docs = res.docs as unknown as Array<Record<string, unknown>>
  writeFileSync(path.join(dir, `${collection}.json`), JSON.stringify(docs, null, 2))
  writeFileSync(path.join(dir, `${collection}.csv`), toCsv(docs.map(flatten)))
  console.log(`  ${collection.padEnd(22)} ${String(docs.length).padStart(5)} rows`)
  return docs.length
}

const main = async () => {
  const argOut = process.argv.indexOf('--out')
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const out = path.resolve(argOut > -1 && process.argv[argOut + 1] ? process.argv[argOut + 1] : path.join('export', stamp))
  const recordsDir = path.join(out, 'records')
  mkdirSync(recordsDir, { recursive: true })

  const payload = await getPayload({ config })
  console.log(`Exporting to ${out}\n`)

  let total = 0
  console.log('Content and taxonomies')
  for (const c of CONTENT) total += await dump(payload, c, out, 1)

  console.log('\nRecords (personal data, kept in ./records)')
  for (const c of RECORDS) total += await dump(payload, c, recordsDir, 0)

  console.log('\nGlobals')
  for (const g of GLOBALS) {
    const doc = await payload.findGlobal({ slug: g, depth: 1, overrideAccess: true })
    writeFileSync(path.join(out, `${g}.json`), JSON.stringify(doc, null, 2))
    console.log(`  ${g}`)
  }

  const manifest = {
    exportedAt: new Date().toISOString(),
    site: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    collections: [...CONTENT, ...RECORDS],
    globals: GLOBALS,
    totalDocuments: total,
    note: 'Media files are in ./media (local storage) or the configured object store. JSON carries one level of populated relationships. CSV carries ids.',
  }
  writeFileSync(path.join(out, 'manifest.json'), JSON.stringify(manifest, null, 2))
  console.log(`\n${total} documents exported.`)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Export failed.')
    console.error(err)
    process.exit(1)
  })
