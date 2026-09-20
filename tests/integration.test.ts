import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { getPayload, type Payload } from 'payload'
import config from '@payload-config'
import { useCaseFilters } from '@/lib/filters'
import { listCollection } from '@/lib/site'
import { purgeExpiredRecords, retentionCutoff } from '@/jobs/retention'
import type { Search, UseCase } from '@/payload-types'

/**
 * Boots Payload against the test database (in-memory SQLite by default, see tests/setup.ts),
 * creates taxonomy terms and a use case, and asserts that filtering and unified search return it.
 */

let payload: Payload
let ids: { lk: number; in: number; agri: number; data: number; safety: number }

beforeAll(async () => {
  payload = await getPayload({ config })

  const lk = await payload.create({
    collection: 'countries',
    data: { name: 'Sri Lanka', iso3: 'LKA', isoNumeric: '144', subregion: 'south-asia' },
  })
  const ind = await payload.create({
    collection: 'countries',
    data: { name: 'India', iso3: 'IND', isoNumeric: '356', subregion: 'south-asia' },
  })
  const agri = await payload.create({ collection: 'topics', data: { name: 'Agriculture' } })
  const data = await payload.create({ collection: 'enablers', data: { name: 'Data' } })
  const safety = await payload.create({ collection: 'rai-dimensions', data: { name: 'Safety' } })
  ids = { lk: lk.id, in: ind.id, agri: agri.id, data: data.id, safety: safety.id }

  await payload.create({
    collection: 'use-cases',
    data: {
      title: 'Paddy pest advisory by SMS',
      summary: 'Farmers in the dry zone receive pest alerts derived from field photos and weather data.',
      stage: 'pilot',
      problem: 'Late detection of brown planthopper outbreaks.',
      countries: [ids.lk],
      topics: [ids.agri],
      enablers: [ids.data],
      raiDimensions: [ids.safety],
      _status: 'published',
    },
  })

  await payload.create({
    collection: 'use-cases',
    data: {
      title: 'Draft only, never public',
      summary: 'A draft that must not appear in listings or search.',
      stage: 'concept',
      countries: [ids.in],
      _status: 'draft',
    },
  })
})

afterAll(async () => {
  await payload?.db?.destroy?.()
})

describe('taxonomy terms', () => {
  it('generate slugs from names', async () => {
    const res = await payload.find({ collection: 'countries', where: { slug: { equals: 'sri-lanka' } } })
    expect(res.totalDocs).toBe(1)
    expect(res.docs[0].iso3).toBe('LKA')
  })
})

describe('use case listing', () => {
  it('returns the published use case and not the draft', async () => {
    const res = await listCollection<UseCase>(payload, 'use-cases', {}, useCaseFilters)
    expect(res.totalDocs).toBe(1)
    expect(res.docs[0].slug).toBe('paddy-pest-advisory-by-sms')
  })

  it('filters by country, sector, enabler and dimension slugs from the URL', async () => {
    for (const sp of [
      { country: 'sri-lanka' },
      { topic: 'agriculture' },
      { enabler: 'data' },
      { dimension: 'safety' },
      { country: 'sri-lanka', topic: 'agriculture', stage: 'pilot' },
    ]) {
      const res = await listCollection<UseCase>(payload, 'use-cases', sp, useCaseFilters)
      expect(res.totalDocs, JSON.stringify(sp)).toBe(1)
    }
  })

  it('returns nothing for a non-matching or unknown filter value', async () => {
    for (const sp of [{ country: 'india' }, { country: 'atlantis' }, { stage: 'scaled' }]) {
      const res = await listCollection<UseCase>(payload, 'use-cases', sp, useCaseFilters)
      expect(res.totalDocs, JSON.stringify(sp)).toBe(0)
    }
  })

  it('matches free text on title and summary', async () => {
    expect((await listCollection(payload, 'use-cases', { q: 'planthopper' }, useCaseFilters)).totalDocs).toBe(0)
    expect((await listCollection(payload, 'use-cases', { q: 'pest alerts' }, useCaseFilters)).totalDocs).toBe(1)
    expect((await listCollection(payload, 'use-cases', { q: 'Paddy' }, useCaseFilters)).totalDocs).toBe(1)
  })

  it('paginates', async () => {
    const res = await listCollection(payload, 'use-cases', { page: '2' }, useCaseFilters)
    expect(res.page).toBe(2)
    expect(res.docs).toHaveLength(0)
    expect(res.hasPrev).toBe(true)
    expect(res.hasNext).toBe(false)
  })
})

describe('roles', () => {
  it('lets a contributor draft but not publish', async () => {
    const contributor = await payload.create({
      collection: 'users',
      data: { name: 'Casey Contributor', email: 'casey@example.org', password: 'a-long-test-password-1', role: 'contributor' },
    })
    const base = { title: 'Contributor draft', summary: 'Written by a contributor.', stage: 'concept' as const }

    const draft = await payload.create({
      collection: 'use-cases',
      data: { ...base, _status: 'draft' },
      user: contributor,
      overrideAccess: false,
    })
    expect(draft._status).toBe('draft')

    await expect(
      payload.update({ collection: 'use-cases', id: draft.id, data: { _status: 'published' }, user: contributor, overrideAccess: false }),
    ).rejects.toThrow(/not publish/)

    await expect(
      payload.create({
        collection: 'use-cases',
        data: { ...base, title: 'Contributor publish attempt', _status: 'published' },
        user: contributor,
        overrideAccess: false,
      }),
    ).rejects.toThrow(/not publish/)

    const editor = await payload.create({
      collection: 'users',
      data: { name: 'Erin Editor', email: 'erin@example.org', password: 'a-long-test-password-2', role: 'editor' },
    })
    const published = await payload.update({
      collection: 'use-cases',
      id: draft.id,
      data: { _status: 'published' },
      user: editor,
      overrideAccess: false,
    })
    expect(published._status).toBe('published')
    await payload.delete({ collection: 'use-cases', id: draft.id })
  })

  it('hides drafts from anonymous readers', async () => {
    const anonymous = await payload.find({ collection: 'use-cases', overrideAccess: false })
    expect(anonymous.docs.every((d) => d._status === 'published')).toBe(true)
    expect(anonymous.totalDocs).toBe(1)
  })
})

describe('data retention', () => {
  it('computes the cutoff from the retention period', () => {
    expect(retentionCutoff(24, new Date('2026-09-20T00:00:00Z')).toISOString()).toBe('2024-09-20T00:00:00.000Z')
    expect(retentionCutoff(1, new Date('2026-03-31T12:00:00Z')).toISOString()).toBe('2026-03-03T12:00:00.000Z')
  })

  it('deletes download and registration records older than the period and keeps newer ones', async () => {
    const file = (await payload.find({ collection: 'media', limit: 1 })).docs[0]
    const fileId =
      file?.id ??
      (
        await payload.create({
          collection: 'media',
          data: { alt: 'Retention test file', access: 'gated' },
          file: { data: Buffer.from('country,value\nLKA,1\n'), name: 'retention.csv', mimetype: 'text/csv', size: 20 },
        })
      ).id
    const consent = { consentText: 'I agree', consentVersion: 'test' }
    const old = await payload.create({
      collection: 'download-requests',
      data: { email: 'old@example.org', file: fileId, ...consent },
      overrideAccess: true,
    })
    const recent = await payload.create({
      collection: 'download-requests',
      data: { email: 'recent@example.org', file: fileId, ...consent },
      overrideAccess: true,
    })
    // Back-date the old record. The API refuses to write createdAt, so go through the database adapter.
    await payload.db.updateOne({
      collection: 'download-requests',
      id: old.id,
      data: { createdAt: new Date('2020-01-01T00:00:00Z').toISOString() },
    })

    const result = await purgeExpiredRecords(payload)
    expect(result.months).toBe(24)
    expect(result.deleted['download-requests']).toBe(1)

    const remaining = await payload.find({ collection: 'download-requests', overrideAccess: true })
    expect(remaining.docs.map((d) => d.id)).toEqual([recent.id])
  })
})

describe('unified search index', () => {
  it('indexes the published use case with its path, type and taxonomy names', async () => {
    const res = await payload.find({ collection: 'search', where: { title: { like: 'Paddy' } }, depth: 0 })
    expect(res.totalDocs).toBe(1)
    const hit = res.docs[0] as Search
    expect(hit.path).toBe('/use-cases/paddy-pest-advisory-by-sms')
    expect(hit.typeLabel).toBe('Use case')
    expect(hit.countries).toBe('Sri Lanka')
    expect(hit.topics).toBe('Agriculture')
    expect(hit.keywords).toContain('Safety')
    expect(hit.excerpt).toContain('pest alerts')
  })

  it('finds it through keywords and excerpt, the fields the search page queries', async () => {
    const res = await payload.find({
      collection: 'search',
      where: { or: [{ keywords: { like: 'Agriculture' } }, { excerpt: { like: 'Agriculture' } }] },
    })
    expect(res.totalDocs).toBe(1)
  })

  it('does not index drafts', async () => {
    const res = await payload.find({ collection: 'search', where: { title: { like: 'Draft only' } } })
    expect(res.totalDocs).toBe(0)
  })

  it('removes the entry when the use case is unpublished', async () => {
    const doc = (await payload.find({ collection: 'use-cases', where: { slug: { equals: 'paddy-pest-advisory-by-sms' } } })).docs[0]
    await payload.update({ collection: 'use-cases', id: doc.id, data: { _status: 'draft' } })
    const gone = await payload.find({ collection: 'search', where: { title: { like: 'Paddy' } } })
    expect(gone.totalDocs).toBe(0)

    await payload.update({ collection: 'use-cases', id: doc.id, data: { _status: 'published' } })
    const back = await payload.find({ collection: 'search', where: { title: { like: 'Paddy' } } })
    expect(back.totalDocs).toBe(1)
  })
})
