import { describe, expect, it, vi } from 'vitest'
import type { BeforeSync } from '@payloadcms/plugin-search/types'
import { buildSearchText, searchBeforeSync, searchCollections, searchPriorities } from '@/hooks/search'
import { CONTENT_TYPES } from '@/lib/content-types'

/** Search index text assembly. */

type SyncArgs = Parameters<BeforeSync>[0]

const fakePayload = (docsByCollection: Record<string, Array<{ id: number; name: string }>> = {}) => {
  const find = vi.fn(async ({ collection }: { collection: string }) => ({ docs: docsByCollection[collection] ?? [] }))
  return { payload: { find } as unknown as SyncArgs['payload'], find }
}

const searchDoc = (relationTo: string, value: number, title = ''): SyncArgs['searchDoc'] =>
  ({ title, doc: { relationTo, value } }) as unknown as SyncArgs['searchDoc']

describe('buildSearchText', () => {
  it('joins the descriptive fields in a stable order and trims them', () => {
    const text = buildSearchText({
      summary: '  Early warning for floods.  ',
      problem: 'Late alerts cost lives.',
      authorText: 'A. Author',
      irrelevant: 'ignored',
    })
    expect(text).toBe('Early warning for floods. Late alerts cost lives. A. Author')
  })

  it('skips empty and non-string values', () => {
    expect(buildSearchText({ summary: '', problem: null, outlet: 42, role: '   ' })).toBe('')
  })

  it('caps the excerpt at 1200 characters', () => {
    expect(buildSearchText({ summary: 'x'.repeat(2000) })).toHaveLength(1200)
  })
})

describe('searchBeforeSync', () => {
  it('uses populated taxonomy names without a database round trip', async () => {
    const { payload, find } = fakePayload()
    const out = await searchBeforeSync({
      originalDoc: {
        id: 1,
        title: 'Flood early warning in the Mahaweli basin',
        slug: 'flood-early-warning-mahaweli',
        summary: 'Community alerts from river gauges.',
        publishedAt: '2026-03-01T00:00:00.000Z',
        countries: [{ id: 1, name: 'Sri Lanka' }],
        topics: [{ id: 2, name: 'Climate and disaster risk' }],
        enablers: [{ id: 3, name: 'Data' }],
        raiDimensions: [{ id: 4, name: 'Safety' }],
        tags: [],
      },
      searchDoc: searchDoc('use-cases', 1),
      payload,
    } as unknown as SyncArgs)

    expect(find).not.toHaveBeenCalled()
    expect(out).toMatchObject({
      title: 'Flood early warning in the Mahaweli basin',
      excerpt: 'Community alerts from river gauges.',
      typeLabel: 'Use case',
      path: '/use-cases/flood-early-warning-mahaweli',
      countries: 'Sri Lanka',
      topics: 'Climate and disaster risk',
      publishedAt: '2026-03-01T00:00:00.000Z',
    })
    expect(out.keywords).toBe('Use case Sri Lanka Climate and disaster risk Data Safety')
  })

  it('looks up names when relationships are bare ids', async () => {
    const { payload, find } = fakePayload({
      countries: [{ id: 1, name: 'Sri Lanka' }, { id: 5, name: 'India' }],
    })
    const out = await searchBeforeSync({
      originalDoc: { id: 7, title: 'Regional AI readiness', slug: 'regional-ai-readiness', countries: [1, 5] },
      searchDoc: searchDoc('publications', 7),
      payload,
    } as unknown as SyncArgs)

    expect(find).toHaveBeenCalledWith(expect.objectContaining({ collection: 'countries', where: { id: { in: [1, 5] } } }))
    expect(out.countries).toBe('Sri Lanka, India')
  })

  it('labels publications by their type and people by name', async () => {
    const { payload } = fakePayload()
    const pub = await searchBeforeSync({
      originalDoc: { id: 2, title: 'Brief', slug: 'brief', type: 'policy-brief' },
      searchDoc: searchDoc('publications', 2),
      payload,
    } as unknown as SyncArgs)
    expect(pub.typeLabel).toBe('Policy brief')
    expect(pub.keywords.startsWith('Policy brief')).toBe(true)

    const person = await searchBeforeSync({
      originalDoc: { id: 3, name: 'Ada Perera', slug: 'ada-perera', role: 'Research fellow', expertise: [{ id: 9, name: 'Health' }] },
      searchDoc: searchDoc('people', 3),
      payload,
    } as unknown as SyncArgs)
    expect(person.title).toBe('Ada Perera')
    expect(person.excerpt).toBe('Research fellow')
    expect(person.topics).toBe('Health')
    expect(person.path).toBe('/people/ada-perera')
  })

  it('falls back to the listing path when a document has no slug', async () => {
    const { payload } = fakePayload()
    const out = await searchBeforeSync({
      originalDoc: { id: 4, title: 'Untitled' },
      searchDoc: searchDoc('events', 4),
      payload,
    } as unknown as SyncArgs)
    expect(out.path).toBe('/events')
    expect(out.publishedAt).toBeUndefined()
  })
})

describe('search plugin configuration', () => {
  it('indexes every registered content type with its priority', () => {
    for (const def of Object.values(CONTENT_TYPES)) {
      expect(searchCollections).toContain(def.collection)
      expect(searchPriorities[def.collection]).toBe(def.searchPriority)
    }
  })

  it('ranks primary evidence above commentary and pages', () => {
    expect(searchPriorities['use-cases']).toBeGreaterThan(searchPriorities.posts)
    expect(searchPriorities.publications).toBeGreaterThan(searchPriorities.news)
    expect(searchPriorities.pages).toBeLessThan(searchPriorities.newsletters)
  })
})
