import 'dotenv/config'
import { mkdirSync } from 'node:fs'
import { getPayload, type CollectionSlug, type Payload, type Where } from 'payload'
import config from '@payload-config'
import { slugify } from '@/lib/slugify'
import { plainText } from '@/lib/lexical'
import { sampleCsv, samplePdf, sampleSvg } from './files'
import * as tax from './taxonomies'
import * as content from './content'

/*
 * Seed. Creates demo users, taxonomies, sample media and representative content, then wires the
 * relationships and the home page. Safe to run repeatedly. Every record is matched by slug (or by
 * email, filename, or indicator+country+year) and updated in place, so editors' changes to other
 * fields survive a re-seed only where the seed does not set them.
 *
 *   pnpm seed
 *
 * Every content item created here is marked with its provenance. Sample items are labelled in the
 * interface while `site-settings.showPrototypeNotices` is on.
 */

/** Both adapters (SQLite and PostgreSQL) use integer ids in this project. */
type Id = number
type Doc = Record<string, unknown>
type SeedRecord = Readonly<Record<string, unknown>>

const log = (msg: string) => console.log(`  ${msg}`)
const heading = (msg: string) => console.log(`\n${msg}`)

/** slug -> id per collection, filled as records are created. */
class Registry {
  private map = new Map<string, Id>()
  set(collection: string, slug: string, id: Id) {
    this.map.set(`${collection}:${slug}`, id)
  }
  get(collection: string, slug: string): Id {
    const id = this.map.get(`${collection}:${slug}`)
    if (id === undefined) throw new Error(`Seed references ${collection} "${slug}" which does not exist. Check src/seed/content.ts.`)
    return id
  }
  has(collection: string, slug: string) {
    return this.map.has(`${collection}:${slug}`)
  }
  many(collection: string, slugs: unknown): Id[] {
    if (!Array.isArray(slugs)) return []
    return slugs.map((s) => this.get(collection, String(s)))
  }
  one(collection: string, slug: unknown): Id | undefined {
    return typeof slug === 'string' && slug ? this.get(collection, slug) : undefined
  }
}

const reg = new Registry()

/** Find one document by a where clause, or null. */
const findOne = async (payload: Payload, collection: CollectionSlug, where: Where) => {
  const res = await payload.find({ collection, where, limit: 1, depth: 0, overrideAccess: true, pagination: false, draft: true })
  return (res.docs[0] as unknown as Doc | undefined) ?? null
}

/** Create or update by slug. Returns the id. */
const upsertBySlug = async (payload: Payload, collection: CollectionSlug, slug: string, data: Doc): Promise<Id> => {
  const existing = await findOne(payload, collection, { slug: { equals: slug } })
  const doc = existing
    ? await payload.update({ collection, id: existing.id as Id, data: data as never, depth: 0, overrideAccess: true })
    : await payload.create({ collection, data: { ...data, slug } as never, depth: 0, overrideAccess: true })
  const id = (doc as unknown as Doc).id as Id
  reg.set(collection, slug, id)
  return id
}

const published = (data: Doc): Doc => ({ ...data, _status: 'published' })

/** Standard taxonomy relationships shared by most content types. */
const taxonomies = (r: SeedRecord): Doc => ({
  countries: reg.many('countries', r.countries),
  topics: reg.many('topics', r.topics),
  enablers: reg.many('enablers', r.enablers),
  raiDimensions: reg.many('rai-dimensions', r.raiDimensions),
  tags: reg.many('tags', r.tags),
})

/** Explicit related-content picks, resolved after every content item exists. */
type Related = { useCases?: readonly string[]; publications?: readonly string[]; datasets?: readonly string[]; events?: readonly string[]; learning?: readonly string[] }
const relatedFields = (rel: Related | undefined): Doc =>
  rel
    ? {
        relatedUseCases: reg.many('use-cases', rel.useCases),
        relatedPublications: reg.many('publications', rel.publications),
        relatedDatasets: reg.many('datasets', rel.datasets),
        relatedEvents: reg.many('events', rel.events),
        relatedLearning: reg.many('learning-resources', rel.learning),
      }
    : {}

/* ---------------------------------------------------------------- users */

const seedUsers = async (payload: Payload) => {
  heading('Users')
  const users = [
    { email: process.env.SEED_ADMIN_EMAIL || 'admin@example.org', password: process.env.SEED_ADMIN_PASSWORD || 'ObservatoryAdmin2026!', name: 'Demo administrator', role: 'admin' },
    { email: process.env.SEED_EDITOR_EMAIL || 'editor@example.org', password: process.env.SEED_EDITOR_PASSWORD || 'ObservatoryEditor2026!', name: 'Demo editor', role: 'editor' },
  ]
  for (const u of users) {
    const existing = await findOne(payload, 'users', { email: { equals: u.email } })
    if (existing) {
      await payload.update({ collection: 'users', id: existing.id as Id, data: { name: u.name, role: u.role as 'admin' | 'editor', password: u.password }, overrideAccess: true })
      log(`updated ${u.email} (${u.role})`)
    } else {
      await payload.create({ collection: 'users', data: { email: u.email, password: u.password, name: u.name, role: u.role as 'admin' | 'editor' }, overrideAccess: true })
      log(`created ${u.email} (${u.role})`)
    }
  }
}

/* ----------------------------------------------------------- taxonomies */

const seedTaxonomy = async (payload: Payload, collection: CollectionSlug, items: readonly SeedRecord[]) => {
  let n = 0
  for (const item of items) {
    const { name, ...rest } = item
    const label = String(name)
    await upsertBySlug(payload, collection, slugify(label), { name: label, ...rest })
    n++
  }
  log(`${collection}: ${n}`)
}

const seedTaxonomies = async (payload: Payload) => {
  heading('Taxonomies')
  await seedTaxonomy(payload, 'countries', tax.countries)
  await seedTaxonomy(payload, 'topics', tax.topics)
  await seedTaxonomy(payload, 'enablers', tax.enablers)
  await seedTaxonomy(payload, 'rai-dimensions', tax.raiDimensions)
  await seedTaxonomy(payload, 'stakeholder-types', tax.stakeholderTypes)
  await seedTaxonomy(payload, 'tags', tax.tags)
}

/* ---------------------------------------------------------------- media */

type FileSpec = { name: string; gated?: boolean; title: string; kind?: 'pdf' | 'csv' }

const mimeFor = (name: string) => (name.endsWith('.csv') ? 'text/csv' : name.endsWith('.svg') ? 'image/svg+xml' : 'application/pdf')

/** Upload a generated sample file unless a media item with this filename already exists. */
const upsertFile = async (payload: Payload, spec: FileSpec, lines: string[] = []): Promise<Id> => {
  if (reg.has('media', spec.name)) return reg.get('media', spec.name)
  const existing = await findOne(payload, 'media', { filename: { equals: spec.name } })
  const data = {
    alt: spec.title,
    access: spec.gated ? ('gated' as const) : ('open' as const),
    caption: 'Sample document generated for the prototype. Not an Observatory output.',
  }
  if (existing) {
    await payload.update({ collection: 'media', id: existing.id as Id, data, overrideAccess: true })
    reg.set('media', spec.name, existing.id as Id)
    return existing.id as Id
  }
  const buffer =
    spec.kind === 'csv' || spec.name.endsWith('.csv')
      ? sampleCsv(['indicator', 'country', 'iso3', 'year', 'value'], lines.map((l) => l.split(',')))
      : samplePdf(spec.title, lines)
  const doc = await payload.create({
    collection: 'media',
    data,
    file: { data: buffer, mimetype: mimeFor(spec.name), name: spec.name, size: buffer.byteLength },
    overrideAccess: true,
  })
  reg.set('media', spec.name, doc.id)
  return doc.id
}

/** Typographic cover image for an item without a photograph. */
const upsertCover = async (payload: Payload, slug: string, label: string, title: string, fill?: string): Promise<Id> => {
  const name = `cover-${slug}.svg`
  if (reg.has('media', name)) return reg.get('media', name)
  const existing = await findOne(payload, 'media', { filename: { equals: name } })
  const data = { alt: `${label}. ${title}`, access: 'open' as const, caption: 'Sample image pending client asset.' }
  if (existing) {
    reg.set('media', name, existing.id as Id)
    return existing.id as Id
  }
  const buffer = sampleSvg(label, fill)
  const doc = await payload.create({
    collection: 'media',
    data,
    file: { data: buffer, mimetype: 'image/svg+xml', name, size: buffer.byteLength },
    overrideAccess: true,
  })
  reg.set('media', name, doc.id)
  return doc.id
}

/* -------------------------------------------------------------- directory */

const seedOrganisations = async (payload: Payload) => {
  heading('Organisations')
  for (const o of content.organisations as readonly SeedRecord[]) {
    await upsertBySlug(
      payload,
      'organisations',
      String(o.slug),
      published({
        name: o.name,
        acronym: o.acronym,
        stakeholderType: reg.get('stakeholder-types', String(o.stakeholderType)),
        observatoryRole: o.observatoryRole ?? 'profiled',
        summary: o.summary,
        description: o.description,
        website: o.website,
        provenance: o.provenance ?? 'sample',
        ...taxonomies(o),
      }),
    )
  }
  log(`${content.organisations.length} organisations`)
}

const seedPeople = async (payload: Payload) => {
  heading('People')
  for (const p of content.people as readonly SeedRecord[]) {
    await upsertBySlug(
      payload,
      'people',
      String(p.slug),
      published({
        name: p.name,
        role: p.role,
        organisation: reg.one('organisations', p.organisation),
        affiliation: p.affiliation,
        summary: p.summary,
        bio: p.bio,
        expertise: reg.many('topics', p.expertise),
        countries: reg.many('countries', p.countries),
        enablers: reg.many('enablers', p.enablers),
        tags: reg.many('tags', p.tags),
        provenance: p.provenance ?? 'sample',
      }),
    )
  }
  log(`${content.people.length} people`)
}

/* ------------------------------------------------------------------- data */

const seedIndicators = async (payload: Payload) => {
  heading('Indicators')
  for (const i of content.indicators as readonly SeedRecord[]) {
    await upsertBySlug(payload, 'indicators', String(i.slug), {
      name: i.name,
      definition: i.definition,
      unit: i.unit,
      valueType: i.valueType,
      min: i.min,
      max: i.max,
      higherIsBetter: i.higherIsBetter ?? true,
      statusLabels: i.statusLabels,
      enabler: reg.one('enablers', i.enabler),
      topics: reg.many('topics', i.topics),
      source: i.source,
      methodology: i.methodology,
      featured: i.featured ?? false,
      order: i.order,
      provenance: 'sample',
      // `dataset` is linked after datasets exist.
    })
  }
  log(`${content.indicators.length} indicators`)
}

const seedIndicatorValues = async (payload: Payload) => {
  heading('Indicator values')
  const countriesByIso = new Map<string, Id>()
  for (const c of tax.countries) countriesByIso.set(c.iso3, reg.get('countries', slugify(c.name)))
  let created = 0
  let updated = 0
  for (const [indicatorSlug, byCountry] of Object.entries(content.indicatorValues)) {
    const indicator = reg.get('indicators', indicatorSlug)
    for (const [iso3, series] of Object.entries(byCountry)) {
      const country = countriesByIso.get(iso3)
      if (!country) throw new Error(`Indicator values reference unknown country ${iso3}`)
      for (const [year, value] of series) {
        const where: Where = { and: [{ indicator: { equals: indicator } }, { country: { equals: country } }, { year: { equals: year } }] }
        const existing = await findOne(payload, 'indicator-values', where)
        const data = { indicator, country, year, value, provenance: 'sample' as const }
        if (existing) {
          await payload.update({ collection: 'indicator-values', id: existing.id as Id, data, overrideAccess: true, depth: 0 })
          updated++
        } else {
          await payload.create({ collection: 'indicator-values', data, overrideAccess: true, depth: 0 })
          created++
        }
      }
    }
  }
  log(`${created} created, ${updated} updated`)
}

/* -------------------------------------------------------------- repository */

const seedUseCases = async (payload: Payload) => {
  heading('Use cases')
  for (const u of content.useCases as readonly SeedRecord[]) {
    const image = await upsertCover(payload, String(u.slug), 'Use case', String(u.title))
    await upsertBySlug(
      payload,
      'use-cases',
      String(u.slug),
      published({
        title: u.title,
        summary: u.summary,
        stage: u.stage,
        yearStarted: u.yearStarted,
        problem: u.problem,
        responsibleAiPractices: u.responsibleAiPractices,
        evidenceOfImpact: u.evidenceOfImpact,
        organisations: reg.many('organisations', u.organisations),
        people: reg.many('people', u.people),
        links: u.links,
        image,
        publishedAt: u.publishedAt,
        provenance: u.provenance ?? 'sample',
        ...taxonomies(u),
      }),
    )
  }
  log(`${content.useCases.length} use cases`)
}

const pdfLines = (r: SeedRecord) => [String(r.summary ?? ''), '', plainText(r.abstract as never).split('\n')[0] ?? ''].filter((l) => l !== undefined)

const seedPublications = async (payload: Payload) => {
  heading('Publications')
  for (const p of content.publications as readonly SeedRecord[]) {
    const spec = p.file as FileSpec | undefined
    const file = spec ? await upsertFile(payload, spec, pdfLines(p)) : undefined
    const cover = await upsertCover(payload, String(p.slug), String(p.type).replace(/-/g, ' '), String(p.title), '#95bda9')
    await upsertBySlug(
      payload,
      'publications',
      String(p.slug),
      published({
        title: p.title,
        type: p.type,
        summary: p.summary,
        abstract: p.abstract,
        authors: reg.many('people', p.authors),
        authorText: p.authorText,
        organisations: reg.many('organisations', p.organisations),
        file,
        cover,
        citation: p.citation,
        pages: p.pages,
        publishedAt: p.publishedAt,
        provenance: p.provenance ?? 'sample',
        ...taxonomies(p),
      }),
    )
  }
  log(`${content.publications.length} publications`)
}

/** CSV rows for the indicator dataset, taken from the seeded indicator values. */
const indicatorCsvLines = (): string[] => {
  const lines: string[] = []
  const nameFor = new Map<string, string>(content.indicators.map((i) => [i.slug, i.name]))
  const countryFor = new Map<string, string>(tax.countries.map((c) => [c.iso3, c.name]))
  for (const [ind, byCountry] of Object.entries(content.indicatorValues))
    for (const [iso3, series] of Object.entries(byCountry))
      for (const [year, value] of series) lines.push([nameFor.get(ind), countryFor.get(iso3), iso3, year, value].join(','))
  return lines
}

const seedDatasets = async (payload: Payload) => {
  heading('Datasets')
  for (const d of content.datasets as readonly SeedRecord[]) {
    const fileSpecs = (d.files ?? []) as Array<{ label: string; name: string; kind?: 'pdf' | 'csv' }>
    const files = []
    for (const f of fileSpecs) {
      const lines = f.name === 'regional-indicators.csv' ? indicatorCsvLines() : ['facility_id,district,connectivity,devices,readiness_score', 'F001,Sample district,4G,tablets,62', 'F002,Sample district,3G,none,31']
      const id = await upsertFile(payload, { name: f.name, title: `${d.title}. ${f.label}`, kind: f.kind }, lines)
      files.push({ label: f.label, file: id })
    }
    await upsertBySlug(
      payload,
      'datasets',
      String(d.slug),
      published({
        title: d.title,
        summary: d.summary,
        description: d.description,
        source: d.source,
        methodNotes: d.methodNotes,
        temporalCoverage: d.temporalCoverage,
        updateFrequency: d.updateFrequency,
        licence: d.licence,
        files,
        accessLinks: d.accessLinks,
        indicators: reg.many('indicators', d.indicators),
        publishedAt: d.publishedAt,
        provenance: d.provenance ?? 'sample',
        ...taxonomies(d),
      }),
    )
  }
  // Back-link indicators to their dataset.
  for (const i of content.indicators as readonly SeedRecord[]) {
    if (!i.dataset) continue
    await payload.update({
      collection: 'indicators',
      id: reg.get('indicators', String(i.slug)),
      data: { dataset: reg.get('datasets', String(i.dataset)) },
      overrideAccess: true,
      depth: 0,
    })
  }
  log(`${content.datasets.length} datasets`)
}

/* -------------------------------------------------------------- commentary */

const seedArticles = async (payload: Payload, collection: 'posts' | 'op-eds' | 'news', items: readonly SeedRecord[], label: string) => {
  for (const a of items) {
    const image = collection === 'posts' ? await upsertCover(payload, String(a.slug), 'Blog', String(a.title), '#c3d9cc') : undefined
    await upsertBySlug(
      payload,
      collection,
      String(a.slug),
      published({
        title: a.title,
        summary: a.summary,
        body: a.body,
        outlet: a.outlet,
        externalUrl: a.externalUrl,
        authors: reg.many('people', a.authors),
        authorText: a.authorText,
        image,
        publishedAt: a.publishedAt,
        provenance: a.provenance ?? 'sample',
        ...taxonomies(a),
      }),
    )
  }
  log(`${items.length} ${label}`)
}

/* ------------------------------------------------------------------ engage */

const seedEvents = async (payload: Payload) => {
  heading('Events')
  for (const e of content.events as readonly SeedRecord[]) {
    await upsertBySlug(
      payload,
      'events',
      String(e.slug),
      published({
        title: e.title,
        summary: e.summary,
        description: e.description,
        startDate: e.startDate,
        endDate: e.endDate,
        format: e.format,
        eventType: e.eventType,
        venue: e.venue,
        onlineUrl: e.onlineUrl,
        registration: e.registration ?? { mode: 'none' },
        organisations: reg.many('organisations', e.organisations),
        speakers: reg.many('people', e.speakers),
        recordingUrl: e.recordingUrl,
        publishedAt: e.publishedAt,
        provenance: e.provenance ?? 'sample',
        ...taxonomies(e),
      }),
    )
  }
  log(`${content.events.length} events`)
}

const seedLearningResources = async (payload: Payload) => {
  heading('Learning resources')
  for (const l of content.learningResources as readonly SeedRecord[]) {
    const spec = l.file as FileSpec | undefined
    const file = spec ? await upsertFile(payload, spec, [String(l.summary ?? '')]) : undefined
    await upsertBySlug(
      payload,
      'learning-resources',
      String(l.slug),
      published({
        title: l.title,
        summary: l.summary,
        description: l.description,
        resourceType: l.resourceType,
        level: l.level,
        duration: l.duration,
        provider: l.provider,
        providerOrganisation: reg.one('organisations', l.providerOrganisation),
        externalUrl: l.externalUrl,
        file,
        videoEmbedUrl: l.videoEmbedUrl,
        language: l.language ?? 'English',
        publishedAt: l.publishedAt,
        provenance: l.provenance ?? 'sample',
        ...taxonomies(l),
      }),
    )
  }
  log(`${content.learningResources.length} learning resources`)
}

const seedOpportunities = async (payload: Payload) => {
  heading('Opportunities')
  for (const o of content.opportunities as readonly SeedRecord[]) {
    await upsertBySlug(
      payload,
      'opportunities',
      String(o.slug),
      published({
        title: o.title,
        summary: o.summary,
        description: o.description,
        opportunityType: o.opportunityType,
        deadline: o.deadline,
        rolling: o.rolling ?? false,
        provider: o.provider,
        eligibility: o.eligibility,
        externalUrl: o.externalUrl,
        publishedAt: o.publishedAt,
        provenance: o.provenance ?? 'sample',
        ...taxonomies(o),
      }),
    )
  }
  log(`${content.opportunities.length} opportunities`)
}

type PolyRef = { relationTo: string; slug: string }
const poly = (refs: readonly PolyRef[] | undefined) => (refs ?? []).map((r) => ({ relationTo: r.relationTo, value: reg.get(r.relationTo, r.slug) }))

const seedNewsletters = async (payload: Payload) => {
  heading('Newsletters')
  for (const n of content.newsletters as readonly SeedRecord[]) {
    const spec = n.file as FileSpec | undefined
    const pdf = spec ? await upsertFile(payload, spec, [String(n.summary ?? '')]) : undefined
    await upsertBySlug(
      payload,
      'newsletters',
      String(n.slug),
      published({
        title: n.title,
        issueNumber: n.issueNumber,
        summary: n.summary,
        body: n.body,
        pdf,
        featured: poly(n.featured as readonly PolyRef[] | undefined),
        publishedAt: n.publishedAt,
        provenance: n.provenance ?? 'sample',
      }),
    )
  }
  log(`${content.newsletters.length} newsletter issues`)
}

const seedPages = async (payload: Payload) => {
  heading('Pages')
  for (const p of content.pages as readonly SeedRecord[]) {
    await upsertBySlug(
      payload,
      'pages',
      String(p.slug),
      published({ title: p.title, summary: p.summary, body: p.body, provenance: p.provenance ?? 'sample', publishedAt: new Date().toISOString() }),
    )
  }
  log(`${content.pages.length} pages`)
}

/* --------------------------------------------------- related content pass */

const seedRelated = async (payload: Payload) => {
  heading('Related content')
  const groups: Array<[CollectionSlug, readonly SeedRecord[]]> = [
    ['use-cases', content.useCases],
    ['publications', content.publications],
    ['datasets', content.datasets],
    ['events', content.events],
    ['posts', content.posts],
    ['news', content.news],
    ['learning-resources', content.learningResources],
  ]
  let n = 0
  for (const [collection, items] of groups) {
    for (const item of items) {
      const rel = item.related as Related | undefined
      if (!rel) continue
      await payload.update({ collection, id: reg.get(collection, String(item.slug)), data: relatedFields(rel) as never, overrideAccess: true, depth: 0 })
      n++
    }
  }
  log(`${n} items linked`)
}

/* ----------------------------------------------------------------- globals */

const seedGlobals = async (payload: Payload) => {
  heading('Globals')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      funders: content.siteConfig.funders.map((f) => ({ ...f })),
      partners: content.siteConfig.partners.map((p) => ({ ...p })),
      programmeNote: content.siteConfig.programmeNote,
      showPrototypeNotices: true,
    },
    overrideAccess: true,
    depth: 0,
  })
  log('site-settings')
  const h = content.homeConfig
  await payload.updateGlobal({
    slug: 'home',
    data: {
      headline: h.headline,
      intro: h.intro,
      featured: poly(h.featured) as never,
      featuredIndicator: reg.get('indicators', h.featuredIndicator),
      audienceEntries: h.audienceEntries.map((a) => ({ ...a })),
    },
    overrideAccess: true,
    depth: 0,
  })
  log('home')
}

/* -------------------------------------------------------------------- main */

const summary = async (payload: Payload) => {
  heading('Summary')
  const collections: CollectionSlug[] = [
    'use-cases', 'publications', 'datasets', 'indicators', 'indicator-values', 'posts', 'op-eds', 'news',
    'people', 'organisations', 'events', 'learning-resources', 'opportunities', 'newsletters', 'pages', 'media', 'search',
  ]
  for (const c of collections) {
    const res = await payload.count({ collection: c, overrideAccess: true })
    log(`${c.padEnd(20)} ${res.totalDocs}`)
  }
}

const main = async () => {
  const started = Date.now()
  mkdirSync('data', { recursive: true })
  mkdirSync('media', { recursive: true })
  const payload = await getPayload({ config })
  console.log(`Seeding ${process.env.DATABASE_URI || 'file:./data/ai4d.db'}`)

  await seedUsers(payload)
  await seedTaxonomies(payload)
  await seedOrganisations(payload)
  await seedPeople(payload)
  await seedIndicators(payload)
  await seedIndicatorValues(payload)
  await seedUseCases(payload)
  await seedPublications(payload)
  await seedDatasets(payload)
  heading('Commentary')
  await seedArticles(payload, 'posts', content.posts, 'blog posts')
  await seedArticles(payload, 'op-eds', content.opEds, 'op-eds')
  await seedArticles(payload, 'news', content.news, 'news items')
  await seedEvents(payload)
  await seedLearningResources(payload)
  await seedOpportunities(payload)
  await seedNewsletters(payload)
  await seedPages(payload)
  await seedRelated(payload)
  await seedGlobals(payload)
  await summary(payload)

  console.log(`\nDone in ${((Date.now() - started) / 1000).toFixed(1)}s.`)
  console.log(`Admin: ${process.env.SEED_ADMIN_EMAIL || 'admin@example.org'}  Editor: ${process.env.SEED_EDITOR_EMAIL || 'editor@example.org'}`)
  console.log('Passwords are in .env (SEED_ADMIN_PASSWORD, SEED_EDITOR_PASSWORD). Change them before any public deployment.')
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\nSeed failed.')
    console.error(err)
    process.exit(1)
  })
