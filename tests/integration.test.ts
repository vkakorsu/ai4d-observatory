import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { getPayload, type Payload } from 'payload'
import config from '@payload-config'
import { useCaseFilters } from '@/lib/filters'
import { listCollection } from '@/lib/site'
import { purgeExpiredRecords, retentionCutoff } from '@/jobs/retention'
import type { Search, UseCase } from '@/payload-types'
import { submitGate, submitRegistration } from '@/lib/forms'
import { verifyGateToken } from '@/lib/gate'
import { runSearch } from '@/lib/search'
import { readStoredFile } from '@/lib/media-files'
import { samplePdf } from '@/seed/files'

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
      summary:
        'Farmers in the dry zone receive pest alerts derived from field photos and weather data.',
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
    const res = await payload.find({
      collection: 'countries',
      where: { slug: { equals: 'sri-lanka' } },
    })
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
    expect(
      (await listCollection(payload, 'use-cases', { q: 'planthopper' }, useCaseFilters)).totalDocs,
    ).toBe(0)
    expect(
      (await listCollection(payload, 'use-cases', { q: 'pest alerts' }, useCaseFilters)).totalDocs,
    ).toBe(1)
    expect(
      (await listCollection(payload, 'use-cases', { q: 'Paddy' }, useCaseFilters)).totalDocs,
    ).toBe(1)
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
      data: {
        name: 'Casey Contributor',
        email: 'casey@example.org',
        password: 'a-long-test-password-1',
        role: 'contributor',
      },
    })
    const base = {
      title: 'Contributor draft',
      summary: 'Written by a contributor.',
      stage: 'concept' as const,
    }

    const draft = await payload.create({
      collection: 'use-cases',
      data: { ...base, _status: 'draft' },
      user: contributor,
      overrideAccess: false,
    })
    expect(draft._status).toBe('draft')

    await expect(
      payload.update({
        collection: 'use-cases',
        id: draft.id,
        data: { _status: 'published' },
        user: contributor,
        overrideAccess: false,
      }),
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
      data: {
        name: 'Erin Editor',
        email: 'erin@example.org',
        password: 'a-long-test-password-2',
        role: 'editor',
      },
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
    expect(retentionCutoff(24, new Date('2026-09-20T00:00:00Z')).toISOString()).toBe(
      '2024-09-20T00:00:00.000Z',
    )
    expect(retentionCutoff(1, new Date('2026-03-31T12:00:00Z')).toISOString()).toBe(
      '2026-03-03T12:00:00.000Z',
    )
  })

  it('deletes download and registration records older than the period and keeps newer ones', async () => {
    const file = (await payload.find({ collection: 'media', limit: 1 })).docs[0]
    const fileId =
      file?.id ??
      (
        await payload.create({
          collection: 'media',
          data: { alt: 'Retention test file', access: 'gated' },
          file: {
            data: Buffer.from('country,value\nLKA,1\n'),
            name: 'retention.csv',
            mimetype: 'text/csv',
            size: 20,
          },
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
    const res = await payload.find({
      collection: 'search',
      where: { title: { like: 'Paddy' } },
      depth: 0,
    })
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
    const res = await payload.find({
      collection: 'search',
      where: { title: { like: 'Draft only' } },
    })
    expect(res.totalDocs).toBe(0)
  })

  it('removes the entry when the use case is unpublished', async () => {
    const doc = (
      await payload.find({
        collection: 'use-cases',
        where: { slug: { equals: 'paddy-pest-advisory-by-sms' } },
      })
    ).docs[0]
    await payload.update({ collection: 'use-cases', id: doc.id, data: { _status: 'draft' } })
    const gone = await payload.find({ collection: 'search', where: { title: { like: 'Paddy' } } })
    expect(gone.totalDocs).toBe(0)

    await payload.update({ collection: 'use-cases', id: doc.id, data: { _status: 'published' } })
    const back = await payload.find({ collection: 'search', where: { title: { like: 'Paddy' } } })
    expect(back.totalDocs).toBe(1)
  })
})

describe('ranked search', () => {
  it('finds the use case, counts it by type, and suggests a spelling for a typo', async () => {
    const hit = await runSearch(payload, 'paddy pest')
    expect(hit.total).toBe(1)
    expect(hit.counts['use-cases']).toBe(1)
    const typo = await runSearch(payload, 'agricultre')
    expect(typo.total).toBe(0)
    expect(typo.suggestion).toBe('agriculture')
  })
})

describe('archive (trash)', () => {
  it('removes an archived item from public listings and search, and restoring brings it back', async () => {
    const doc = (
      await payload.find({
        collection: 'use-cases',
        where: { slug: { equals: 'paddy-pest-advisory-by-sms' } },
      })
    ).docs[0]
    await payload.update({
      collection: 'use-cases',
      id: doc.id,
      data: { deletedAt: new Date().toISOString() },
      trash: true,
    })
    expect(
      (await listCollection<UseCase>(payload, 'use-cases', {}, useCaseFilters)).totalDocs,
    ).toBe(0)
    expect((await runSearch(payload, 'paddy')).total).toBe(0)

    await payload.update({
      collection: 'use-cases',
      id: doc.id,
      data: { deletedAt: null },
      trash: true,
    })
    expect(
      (await listCollection<UseCase>(payload, 'use-cases', {}, useCaseFilters)).totalDocs,
    ).toBe(1)
  })
})

describe('event join links', () => {
  it('are hidden from anonymous API readers but returned to a confirmed registrant', async () => {
    const event = await payload.create({
      collection: 'events',
      data: {
        title: 'Join link test webinar',
        summary: 'Test event.',
        startDate: new Date(Date.now() + 7 * 86_400_000).toISOString(),
        format: 'online',
        onlineUrl: 'https://meet.example.org/secret-room',
        registration: { mode: 'form' },
        _status: 'published',
      },
    })
    const anon = await payload.find({
      collection: 'events',
      where: { id: { equals: event.id } },
      overrideAccess: false,
    })
    expect(anon.docs[0]?.title).toBe('Join link test webinar')
    expect(anon.docs[0]?.onlineUrl).toBeUndefined()

    const reg = await submitRegistration(
      payload,
      { name: 'Test Person', email: 'reg@example.org', eventId: String(event.id), consent: 'on' },
      { ip: '203.0.113.9', userAgent: 'vitest' },
    )
    expect(reg.ok && reg.onlineUrl).toBe('https://meet.example.org/secret-room')
  })
})

describe('gated downloads', () => {
  let gatedFileId: number | string
  afterAll(async () => {
    // Remove the uploaded test file from disk as well as the database.
    if (gatedFileId)
      await payload
        .delete({ collection: 'media', id: gatedFileId, overrideAccess: true })
        .catch(() => null)
  })

  it('record the request with consent and return a signed link bound to the file', async () => {
    const pdf = samplePdf('Gated test brief', ['Test'])
    const file = await payload.create({
      collection: 'media',
      data: { alt: 'Gated test brief', access: 'gated' },
      file: {
        data: pdf,
        name: 'gated-test.pdf',
        mimetype: 'application/pdf',
        size: pdf.byteLength,
      },
    })
    gatedFileId = file.id
    const res = await submitGate(
      payload,
      { email: 'reader@example.org', fileId: String(file.id), consent: 'on' },
      { ip: '203.0.113.10', userAgent: 'vitest' },
    )
    expect(res.ok).toBe(true)
    if (!res.ok) return
    const token = new URL(res.url, 'http://x').searchParams.get('t')
    expect(verifyGateToken(token, payload.secret)?.fileId).toBe(String(file.id))
    expect(res.url).not.toContain('reader@example.org')

    const records = await payload.find({
      collection: 'download-requests',
      where: { email: { equals: 'reader@example.org' } },
      overrideAccess: true,
    })
    expect(records.totalDocs).toBe(1)
    expect(records.docs[0].consentVersion).toBeTruthy()
  })

  it('refuses without consent and never reads outside the media directory', async () => {
    const res = await submitGate(
      payload,
      { email: 'reader@example.org', fileId: '1' },
      { ip: '203.0.113.11', userAgent: 'vitest' },
    )
    expect(res.ok).toBe(false)
    expect(await readStoredFile('../package.json')).toBeNull()
    expect(await readStoredFile('..\package.json')).toBeNull()
  })

  it('neutralises spreadsheet formulas in free-text fields before they reach CSV exports', async () => {
    const file = { id: gatedFileId }
    await submitGate(
      payload,
      {
        email: 'csv@example.org',
        fileId: String(file.id),
        consent: 'on',
        organisation: '=HYPERLINK("http://evil")',
      },
      { ip: '203.0.113.12', userAgent: 'vitest' },
    )
    const rec = (
      await payload.find({
        collection: 'download-requests',
        where: { email: { equals: 'csv@example.org' } },
        overrideAccess: true,
      })
    ).docs[0]
    expect(rec.organisation?.startsWith("'=")).toBe(true)
  })
})
