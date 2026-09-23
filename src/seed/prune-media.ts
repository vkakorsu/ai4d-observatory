import 'dotenv/config'
import { getPayload, type CollectionSlug } from 'payload'
import config from '../payload.config'

/**
 * Lists, and with --apply deletes, duplicate seed uploads that nothing refers to.
 *
 * Before the seed matched renamed files (`cover-x-1.svg`), each re-seed on a host uploaded another copy.
 * A media item is removed only if all of these hold:
 *   - its name differs from another media item's only by a numeric suffix (a duplicate, not a unique upload),
 *   - no content, global or record refers to it (upload and relationship fields are scanned from the config),
 * and deleting it through Payload also removes the file from storage.
 *
 *   pnpm media:prune            dry run, prints what would be deleted
 *   pnpm media:prune --apply    deletes
 */

const apply = process.argv.includes('--apply')
const payload = await getPayload({ config })

type FieldLike = {
  type?: string
  name?: string
  relationTo?: string | string[]
  fields?: FieldLike[]
  tabs?: FieldLike[]
  blocks?: FieldLike[]
}

/** Every value in a document that could be a media id, found by walking the field config. */
const collectRefs = (fields: FieldLike[], data: unknown, out: Set<string>) => {
  if (!data || typeof data !== 'object') return
  const obj = data as Record<string, unknown>
  for (const f of fields) {
    if (f.type === 'tabs' && f.tabs) {
      for (const t of f.tabs) collectRefs(t.fields ?? [], t.name ? obj[t.name] : obj, out)
      continue
    }
    if ((f.type === 'row' || f.type === 'collapsible') && f.fields) {
      collectRefs(f.fields, obj, out)
      continue
    }
    if (!f.name) continue
    const v = obj[f.name]
    const targets = Array.isArray(f.relationTo) ? f.relationTo : f.relationTo ? [f.relationTo] : []
    if ((f.type === 'upload' || f.type === 'relationship') && targets.includes('media')) {
      for (const item of Array.isArray(v) ? v : [v]) {
        if (item === null || item === undefined) continue
        if (typeof item === 'object') {
          const rel = item as { relationTo?: string; value?: unknown; id?: unknown }
          if (rel.relationTo === 'media')
            out.add(String((rel.value as { id?: unknown })?.id ?? rel.value))
          else if (rel.id !== undefined) out.add(String(rel.id))
        } else out.add(String(item))
      }
    } else if ((f.type === 'group' || f.type === 'array') && f.fields) {
      for (const row of Array.isArray(v) ? v : [v]) collectRefs(f.fields, row, out)
    }
  }
}

const referenced = new Set<string>()
for (const c of payload.config.collections) {
  if (c.slug === 'media' || c.slug.startsWith('payload-')) continue
  const res = await payload.find({
    collection: c.slug as CollectionSlug,
    limit: 10000,
    depth: 0,
    pagination: false,
    overrideAccess: true,
    draft: true,
    trash: true,
  })
  for (const d of res.docs) collectRefs(c.fields as FieldLike[], d, referenced)
}
for (const g of payload.config.globals) {
  const doc = await payload.findGlobal({ slug: g.slug as never, depth: 0, overrideAccess: true })
  collectRefs(g.fields as FieldLike[], doc, referenced)
}

const media = await payload.find({
  collection: 'media',
  limit: 10000,
  depth: 0,
  pagination: false,
  overrideAccess: true,
})
const base = (name: string) => name.replace(/-\d+(\.[a-z0-9]+)$/i, '$1')
const groups = new Map<string, typeof media.docs>()
for (const m of media.docs) {
  const key = base(String(m.filename ?? ''))
  groups.set(key, [...(groups.get(key) ?? []), m])
}

const doomed = media.docs.filter(
  (m) =>
    (groups.get(base(String(m.filename ?? '')))?.length ?? 0) > 1 && !referenced.has(String(m.id)),
)
console.log(
  `${media.docs.length} media items, ${referenced.size} referenced, ${doomed.length} unreferenced duplicates`,
)
for (const m of doomed)
  console.log(`  ${apply ? 'deleting' : 'would delete'} ${m.id} ${m.filename}`)
if (apply) {
  for (const m of doomed)
    await payload.delete({ collection: 'media', id: m.id, overrideAccess: true })
  console.log('Done.')
} else if (doomed.length) {
  console.log('Dry run. Re-run with --apply to delete these files from the database and storage.')
}
process.exit(0)
