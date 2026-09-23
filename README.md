# Asia AI4D Observatory. Website prototype

Prototype and seed of the production platform proposed to LIRNEasia for the Asia Observatory on AI for Development. One Next.js application with Payload CMS embedded, a relational database (SQLite locally, PostgreSQL in production), server-rendered pages, a working administrative dashboard at `/admin`, and every module named in Section 3.1.2 of the RFP implemented as a structured content type with listings, detail pages, filters, unified search, relationships and records.

It is not a mock-up. If the bid is successful this codebase is refined, restyled after design sign-off and deployed to the Client's infrastructure. Proposal and prototype describe one architecture.

- **What it proves** is in [section 2](#2-what-it-proves).
- **What waits on the Client** is in [section 5](#5-what-waits-on-the-client).
- **Deployment** is in [DEPLOY.md](DEPLOY.md). **Design decisions** are in [DESIGN.md](DESIGN.md). **Content model** is in [docs/CONTENT_MODEL.md](docs/CONTENT_MODEL.md). **Editor guide (draft)** is in [docs/EDITOR_GUIDE.md](docs/EDITOR_GUIDE.md). **Third-party register** is in [docs/THIRD_PARTY_REGISTER.md](docs/THIRD_PARTY_REGISTER.md).

## 1. Run it locally

Requirements: Node.js 22 (20.9 or later works), pnpm 10.

```bash
pnpm install
cp .env.example .env        # defaults work as they are
pnpm seed                   # demo users, taxonomies, sample files and content, about one minute
pnpm dev                    # http://localhost:3000, admin at /admin
```

Demo credentials are printed at the end of `pnpm seed` and set in `.env` (`SEED_ADMIN_*`, `SEED_EDITOR_*`). Change them before any public deployment.

| Command | Purpose |
|---|---|
| `pnpm dev` | Development server with hot reload |
| `pnpm build` then `pnpm start` | Production build and server |
| `pnpm seed` | Idempotent. Creates or updates the labelled sample content. Safe to run again after editing `src/seed/content.ts` |
| `pnpm export [--out dir]` | Writes every collection as JSON and CSV plus globals and a manifest to `export/<timestamp>/`. Personal data lands in `records/` |
| `pnpm test` | Vitest. Unit tests plus an integration test that boots Payload against in-memory SQLite |
| `pnpm a11y [-- --base URL]` | axe-core over every page type of a running server (default `http://localhost:3000`). Exits non-zero on any violation |
| `pnpm retention` | Runs the retention purge once (the same task runs nightly through the jobs runner) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm generate:types` | Regenerate `src/payload-types.ts` after changing a collection |

## 2. What it proves

| RFP requirement | How the prototype demonstrates it |
|---|---|
| 3.1.2 all fourteen modules | Each module is a collection with a listing route and a detail route. `tests/content-types.test.ts` asserts the mapping. See [section 3](#3-modules-and-routes) |
| 3.1.3 (a) to (f) CMS | Payload admin with three roles (admin, editor, contributor), drafts, autosave, scheduled publishing, unpublish (revert to draft), archive (soft delete to a restorable Trash, `trash: true`), versions with restore, media library with required alt text, taxonomies editable without a developer |
| 2.1 and 3.1.2 export of records | Every list view has an Export button (`@payloadcms/plugin-import-export`): CSV or JSON, chosen columns, filtered set. Download requests, subscribers and registrations are export-only; content and taxonomies can also be imported |
| 3.1.4 (a) site-wide search | `/search` queries one index maintained on every save, covering all content types, filterable by type, country and topic. Results carry type label, excerpt and highlighted matches |
| 3.1.4 (b) filtering | Every listing filters by the taxonomies relevant to it through URL parameters, so filtered views are shareable, bookmarkable and indexable |
| 3.1.4 (c) relationships | Relationship fields between use cases, publications, datasets, people, organisations, events and learning resources. Hub pages per country, sector, enabler and responsible AI dimension collect everything tagged with the term |
| 3.1.4 (d) CMS-updatable interactive features | Indicator values are records. The map, chart and table on `/data` and `/data/[indicator]` render from them, server-side, as SVG |
| 3.1.4 (e) accessible alternatives | Every visualisation ships with a plain-language summary, a sortable table and a CSV download (`/data/[indicator]/csv`) |
| 3.1.2 email-gated downloads | Per-file `open` or `gated` switch on media. Form with purpose statement and consent. Requests stored in `download-requests` and exportable. Time-limited HMAC-signed link, no personal data in the URL |
| 2.1 newsletter and sign-ups | Subscription form with a provider adapter (local store, Brevo, Mailchimp). Newsletter archive with web and PDF versions. Event registration with capacity, waitlist and export |
| 3.1.6 (a) WCAG 2.2 AA | Skip link, landmarks, visible focus, keyboard-operable filters and forms, labelled inputs, contrast-checked palette, reduced-motion support, SVG maps with titles, descriptions and table equivalents. `pnpm a11y` runs axe-core over 34 page types; 33 report zero violations and the 404 page's pre-hydration HTML lacks `lang` (framework error shell, correct once loaded) |
| 3.1.6 (c) privacy | Purpose statement beside every form, consent text and version stored with each record, hashed IPs only, `retentionMonths` in Site settings enforced by a nightly purge task (`src/jobs/retention.ts`), draft privacy notice and accessibility statement as CMS pages |
| 3.1.6 (d) analytics | Adapter that fires page views and events (download, gated unlock, subscribe, register, dataset access, opportunity open) to Umami or GA4 when configured. Provider `none` by default |
| 3.1.6 (e) SEO | Clean URLs, per-page metadata overrides, canonical URLs, generated Open Graph image, XML sitemap, RSS feeds (site-wide `/feed.xml` and per type `/feed/<type>.xml`), JSON-LD (WebSite, Article, Report, Dataset, Event, Person, Organization, BreadcrumbList), correct 404 status codes, `robots.txt` with a no-index switch for staging |
| 3.1.6 (b) security | HTTPS and HSTS at the proxy, Content Security Policy and other security headers from `next.config.ts`, role-based access enforced server-side, salted PBKDF2 password hashing (Payload built-in) with lockout after five failed logins, HMAC-signed time-limited download links, rate-limited and honeypot-protected forms, hashed IPs only |
| 3.1.5 (c) low bandwidth | Server-rendered HTML that reads and filters without JavaScript, five self-hosted subsetted font files (about 200 KB, cached a year), inline SVG maps from the 1:110m Natural Earth atlas with one-decimal path precision. Measured on the production build: a content page is about 200 KB compressed before fonts on a first visit and 10 to 40 KB on later visits |
| 3.1.5 (f) multilingual readiness | Localisation is enabled in `src/payload.config.ts` with `en` as the only active locale. Adding a locale is one config entry plus `localized: true` on the fields to translate |
| 3.1.8 portability | MIT-licensed code, standard SQL database, `pnpm export` produces JSON and CSV of all content, Docker Compose file for any host |

## 3. Modules and routes

Top navigation: Home, Use cases, Data and maps, Publications, Commentary, Directory, Engage, About, Search.

| RFP module (3.1.2) | Collection | Listing | Detail |
|---|---|---|---|
| Home / About | `pages`, `home` global, `site-settings` global | `/`, `/about`, `/about/partners` | `/[slug]` for CMS pages such as `/privacy` and `/accessibility` |
| Responsible AI use-case / innovation repository | `use-cases` | `/use-cases` | `/use-cases/[slug]` |
| Interactive maps and data | `indicators`, `indicator-values` | `/data` | `/data/[slug]`, `/data/[slug]/csv` |
| Reports and mapping studies | `publications` (type report, mapping-study, annual-report) | `/publications` | `/publications/[slug]` |
| Research / policy / innovation briefs | `publications` (type research-brief, policy-brief, innovation-brief, toolkit, comparative-analysis) | `/publications?type=…` | `/publications/[slug]` |
| Blogs and commentary | `posts` | `/commentary` | `/blog/[slug]` |
| Op-eds / external publications | `op-eds` | `/commentary?type=op-eds` | `/op-eds/[slug]` |
| Datasets | `datasets` | `/datasets` | `/datasets/[slug]` |
| People and organisations | `people`, `organisations` | `/directory` | `/people/[slug]`, `/organisations/[slug]` |
| Events | `events`, `event-registrations` | `/events`, `/events?when=past` | `/events/[slug]` |
| News | `news` | `/commentary?type=news` | `/news/[slug]` |
| Learning resources | `learning-resources` | `/learning` | `/learning/[slug]` |
| Newsletter | `newsletters`, `subscribers` | `/newsletter` | `/newsletter/[slug]` |
| Opportunities | `opportunities` | `/opportunities` | `/opportunities/[slug]` |

Cross-cutting routes: `/countries/[slug]`, `/topics/[slug]`, `/enablers/[slug]`, `/dimensions/[slug]` (hub pages), `/search`, `/download/[id]` (open or token-checked file delivery), `/prototype-notes` (what is illustrative, what is functional, what is pending), `/sitemap.xml`, `/robots.txt`, `/feed.xml`, `/feed/[type].xml` (per-type RSS, for example `/feed/publications.xml`), `/opengraph-image`, `/admin`.

Form endpoints (Payload custom endpoints, JSON): `POST /api/gate`, `POST /api/subscribe`, `POST /api/register`. Payload's REST and GraphQL APIs are available under `/api` and `/api/graphql` with the same access rules as the admin.

## 4. Illustrative versus functional

| Element | Prototype | Final |
|---|---|---|
| Pages, listings, detail templates for all modules | Functional | Functional, restyled after sign-off |
| Content types, taxonomies, relationships, roles, versions | Functional | Functional, terms confirmed in week 1 |
| Search, filters, hubs | Functional (SQLite `like` matching) | Functional, PostgreSQL full-text ranking added |
| Map, chart, table, CSV | Functional from CMS data | Functional with Client indicators |
| Gated downloads, subscriptions, registrations, exports | Functional (local store) | Functional, provider connected |
| Analytics adapter | Functional, provider `none` | Connected to Client property |
| Sample content, people, organisations, indicator values | Illustrative, labelled | Replaced by Client content |
| Visual language | Proposed direction | Finalised at design sign-off |
| Six enablers, five RAI dimensions, country list | Illustrative seed from the public Observatory description | Confirmed in week 1 |
| Funder and partner logos | Text placeholders labelled as pending | Client assets |
| Hosting, domain, TLS | Temporary | Client infrastructure |

Every sample item carries `provenance: sample` and is labelled "Sample content pending client input" on the site while `site-settings.showPrototypeNotices` is on. Nothing is presented as real Observatory output. There is no lorem ipsum.

## 5. What waits on the Client

1. **Priority audiences and journeys.** The home page offers "Start from what you need" entry points covering the audiences in Section 2.2 of the RFP (policymakers and regulators; researchers and academics; civil society; innovators and private sector; funders and development partners; international and regional organisations; media and the public). Set and order are editable in the `home` global and shown as pending on `/prototype-notes`.
2. **Final taxonomy.** Six enablers, five responsible AI dimensions, ten sectors, six stakeholder types and twenty countries are seeded. Hub pages carry a "seed taxonomy, pending confirmation" badge while prototype notices are on.
3. **Branding sign-off.** The identity is a proposed direction, see [DESIGN.md](DESIGN.md). The logo is a typographic wordmark.
4. **Real content.** All sample content is replaced or re-labelled through the admin; `provenance` changes to `client`.
5. **Integrations needing credentials.** Newsletter provider, analytics property, object storage, SMTP. Each has a documented environment variable and a working default (local store, none, local disk, console).
6. **Hosting and domain.** Runs anywhere with Node.js 22 and SQLite or PostgreSQL. [DEPLOY.md](DEPLOY.md) covers Docker Compose and pushing to GitHub.

## 6. Repository structure

```
ai4d-prototype/
  README.md                  this file
  DEPLOY.md                  deployment and GitHub publishing, step by step
  DESIGN.md                  type, colour, grid, iconography decisions and references
  docs/CONTENT_MODEL.md      collections, fields, relationships, access rules
  docs/EDITOR_GUIDE.md       draft CMS/editor guide (Documentation Package, Section 3.2)
  docs/THIRD_PARTY_REGISTER.md  licences, services, costs and lock-in (Sections 3.1.5 e, 3.1.8 b)
  LICENSE                    MIT
  vercel.json                daily jobs cron on Vercel (retention, scheduled publishing)
  .github/workflows/ci.yml   typecheck and tests on every push
  scripts/a11y.mjs           axe-core sweep over every page type
  Dockerfile                 multi-stage production image
  docker-compose.yml         app, PostgreSQL, Caddy (TLS), optional Umami, seed and export tools
  deploy/                    Caddyfile, PostgreSQL init script
  .env.example               every variable with its default
  src/
    payload.config.ts        collections, globals, plugins, localisation, database adapter switch
    collections/             content.ts (public types), data.ts (indicators), taxonomies.ts, system.ts (users, media, records)
    globals/                 site-settings, home
    fields/                  shared fields: slug, provenance, summary, SEO, taxonomy relationships, drafts defaults
    access/                  role helpers
    hooks/                   search index enrichment
    endpoints/               gate, subscribe, register
    jobs/                    retention purge task and its command-line runner
    lib/                     queries, filters, gating tokens, newsletter adapters, geo, stats, seo, feeds, format
    seed/                    run.ts (seed), export.ts, content.ts and taxonomies.ts (sample data), files.ts
    app/
      (payload)/             admin UI and REST/GraphQL routes
      (site)/                public site
      robots.ts
    components/              layout, listings, detail pages, filters, forms, map, chart, table, rich text
    styles/                  tokens, base, components
  tests/                     vitest unit and integration tests
```

## 7. Technology

Next.js 16.3 (App Router, server components, server actions for public forms; 16.3.6 carries the May, August and September 2026 security fixes), Payload CMS 3 (embedded, Lexical rich text, search plugin, import/export plugin, versions, drafts and trash), TypeScript, SQLite via libSQL for development and the evaluation prototype, PostgreSQL adapter for production, d3-geo and Natural Earth boundaries (`world-atlas`) for server-rendered SVG maps, sharp for WebP renditions generated at upload, Satori (`next/og`) for per-item share cards, Vitest for tests. No client-side data fetching on content pages. Licence: MIT.

## 8. Tests

`pnpm test` runs nine files, 115 tests:

- Filter query builder from URL parameters, including the unknown-slug case that must return nothing rather than everything.
- Search index text assembly and the `beforeSync` enrichment, with a fake Payload.
- Gated download token signing and verification: expiry, wrong secret, tampered body, tampered signature, malformed input.
- Newsletter adapter selection and the Brevo and Mailchimp request shapes, with a fake `fetch`.
- Indicator statistics, choropleth scale (equal-interval and quantile, monotonic), text summary, CSV escaping.
- Content type registry: every Section 3.1.2 module has a collection, a listing route and a detail route on disk.
- Slug generation.
- Search ranking: tokenising, accent folding, field weighting, phrase bonus, edit distance and spelling suggestions.
- Integration: boots Payload against in-memory SQLite, creates taxonomy terms and a use case, asserts that listing filters and the unified search index return it, that drafts stay out of both, that a contributor can draft but not publish, that the retention purge deletes expired download records and keeps recent ones, that archiving removes an item from listings and search and restoring brings it back, that event join links are hidden from anonymous API readers but returned to registrants, that gated downloads record consent and sign links without the address in the URL, that stored filenames cannot escape the media directory, and that spreadsheet formulas typed into forms are neutralised before CSV export.

`pnpm a11y` is the accessibility sweep. It fetches the server-rendered HTML of every page type (listings, detail pages, hubs, search, policies, the 404 page) and runs axe-core on each. It exits non-zero on any violation and is meant to run in CI against a preview deployment. Colour contrast is verified separately in a real browser because jsdom does not compute layout.
