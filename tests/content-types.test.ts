import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import config from '@payload-config'
import {
  CONTENT_TYPES,
  contentTypeList,
  FILESYSTEM_TOP_SLUGS,
  labelFor,
  pathFor,
  RFP_MODULES,
  searchableTypes,
} from '@/lib/content-types'

/**
 * Content type registry. Every module named in Section 3.1.2 of the RFP must have a collection,
 * a listing route and a detail route, and must be indexed for search and the sitemap.
 */

const siteDir = path.resolve(__dirname, '..', 'src', 'app', '(site)')
const routeFile = (...segments: string[]) =>
  path.join(siteDir, ...segments.filter(Boolean), 'page.tsx')
const pathname = (url: string) => url.split('?')[0]

describe('RFP module coverage', () => {
  it('maps every Section 3.1.2 module to at least one content type', () => {
    const covered = contentTypeList.flatMap((t) => t.rfpModule.split('. '))
    for (const rfpModule of RFP_MODULES)
      expect(covered, `module "${rfpModule}" has no content type`).toContain(rfpModule)
  })

  it('names fourteen modules, matching the RFP', () => {
    expect(RFP_MODULES).toHaveLength(14)
    expect(new Set(RFP_MODULES).size).toBe(RFP_MODULES.length)
  })
})

describe('registry consistency', () => {
  it('keys match the collection slug', () => {
    for (const [key, def] of Object.entries(CONTENT_TYPES)) expect(def.collection).toBe(key)
  })

  it('has a Payload collection for every type', async () => {
    const cfg = await config
    const slugs = cfg.collections.map((c) => c.slug)
    for (const def of contentTypeList)
      expect(slugs, `no collection "${def.collection}"`).toContain(def.collection)
  })

  it('has a detail route on disk for every type', () => {
    for (const def of contentTypeList) {
      const file =
        def.collection === 'pages'
          ? routeFile('[slug]')
          : routeFile(def.base.replace(/^\//, ''), '[slug]')
      expect(existsSync(file), `missing detail route ${file}`).toBe(true)
    }
  })

  it('has a listing route on disk for every type', () => {
    for (const def of contentTypeList) {
      const file = routeFile(pathname(def.listing).replace(/^\//, ''))
      expect(existsSync(file), `missing listing route ${file}`).toBe(true)
    }
  })

  it('includes every type in search and the sitemap', () => {
    for (const def of contentTypeList) {
      expect(def.inSearch, `${def.collection} not searchable`).toBe(true)
      expect(def.inSitemap, `${def.collection} not in sitemap`).toBe(true)
    }
    expect(searchableTypes).toEqual(contentTypeList.map((t) => t.collection))
  })

  it('gives each type a positive search priority and a title field', () => {
    for (const def of contentTypeList) {
      expect(def.searchPriority).toBeGreaterThan(0)
      expect(['title', 'name']).toContain(def.titleField)
    }
  })

  it('carries the four core taxonomies on repository types', () => {
    for (const key of ['use-cases', 'publications', 'learning-resources'] as const) {
      expect(CONTENT_TYPES[key].taxonomies).toEqual(
        expect.arrayContaining(['countries', 'topics', 'enablers', 'raiDimensions']),
      )
    }
  })
})

describe('pathFor and labelFor', () => {
  it('builds detail paths from the base', () => {
    expect(pathFor('use-cases', 'flood-warning')).toBe('/use-cases/flood-warning')
    expect(pathFor('posts', 'hello')).toBe('/blog/hello')
    expect(pathFor('indicators', 'internet-penetration')).toBe('/data/internet-penetration')
  })

  it('mounts CMS pages at the root', () => {
    expect(pathFor('pages', 'privacy')).toBe('/privacy')
  })

  it('falls back to the collection slug for unknown labels', () => {
    expect(labelFor('publications')).toBe('Publication')
    expect(labelFor('something-else')).toBe('something-else')
  })
})

describe('deploy ignore files', () => {
  it('keeps the App Router /data route out of ignore rules', () => {
    expect(FILESYSTEM_TOP_SLUGS.has('data')).toBe(true)
    const root = path.resolve(__dirname, '..')
    for (const file of ['.vercelignore', '.dockerignore']) {
      const patterns = readFileSync(path.join(root, file), 'utf8')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#'))
      expect(patterns, file).not.toContain('data')
      expect(patterns, file).not.toContain('media')
      expect(patterns, file).not.toContain('export')
      expect(
        patterns.some((pattern) => pattern === '/data' || pattern === '/data/'),
        `${file} must ignore only the root SQLite directory`,
      ).toBe(true)
    }
  })

  it('does not statically import the SQLite adapter', () => {
    const root = path.resolve(__dirname, '..')
    const payloadConfig = readFileSync(path.join(root, 'src/payload.config.ts'), 'utf8')
    const database = readFileSync(path.join(root, 'src/lib/database.ts'), 'utf8')
    expect(payloadConfig).not.toMatch(/@payloadcms\/db-sqlite/)
    expect(database).not.toMatch(/from ['"]@payloadcms\/db-sqlite['"]/)
    expect(database).toMatch(/await import\(['"]@payloadcms\/db-sqlite['"]\)/)
  })

  it('keeps the Vercel Blob upload handler in the Payload import map', () => {
    const root = path.resolve(__dirname, '..')
    const importMap = readFileSync(path.join(root, 'src/app/(payload)/admin/importMap.js'), 'utf8')
    expect(importMap).toMatch(
      /@payloadcms\/storage-vercel-blob\/client#VercelBlobClientUploadHandler/,
    )
  })
})
