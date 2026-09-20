# Content model

Collections, fields, relationships and access rules of the Asia AI4D Observatory CMS. Derived from `src/payload.config.ts`, `src/collections/*.ts`, `src/globals/index.ts` and `src/fields/shared.ts`, which are the source of truth. Regenerate `src/payload-types.ts` with `pnpm generate:types` after any change.

Conventions in the tables below: `*` required. `→ x` relationship to collection `x`; `[]` many. `select (a, b)` lists the option values.

## 1. Shared building blocks (`src/fields/shared.ts`)

Every public content type carries these fields unless noted.

| Field | Type | Notes |
|---|---|---|
| `slug` | text, unique, indexed | Generated from the title (or name) by `slugify`, editable by editors. Drives the public URL |
| `summary` | textarea * (max 400) | One to three sentences. Listings, search results, social previews |
| `publishedAt` | date | Set automatically on first publish if empty. Sort key for listings |
| `provenance` | select (sample, public, client) | Default `sample`. Marks the boundary between illustrative and real content. Shown as a badge while `site-settings.showPrototypeNotices` is on |
| `seo` | group | `metaTitle` (70), `metaDescription` (160), `image` → media, `noIndex` |
| `countries` | → countries[] | indexed |
| `topics` | → topics[] | indexed. Sector or thematic area |
| `enablers` | → enablers[] | indexed. Responsible AI ecosystem enabler |
| `raiDimensions` | → rai-dimensions[] | indexed. Only on use cases, publications, learning resources |
| `tags` | → tags[] | free keywords |
| `relatedUseCases`, `relatedPublications`, `relatedDatasets`, `relatedEvents`, `relatedLearning` | relationships | Explicit cross-links shown in a "Related" block. Hub pages and taxonomy chips provide implicit links |
| `_status` | draft / published | From versions. See section 7 |

Rich text fields use the Lexical editor with headings, lists, links, quotes and uploads.

## 2. Repository

### `use-cases`  (URL `/use-cases/[slug]`)

| Field | Type |
|---|---|
| `title` | text * |
| `body` | richText |
| `stage` | select (concept, pilot, deployed, scaled, discontinued) * |
| `yearStarted` | number 2000–2100 |
| `problem` | textarea. The development problem addressed |
| `responsibleAiPractices` | textarea. How safety, rights, sustainability, inclusion and context were handled |
| `evidenceOfImpact` | textarea |
| `organisations` | → organisations[] |
| `people` | → people[] |
| `links` | array of `{ label *, url * }` |
| `image` | → media |
| shared | slug, summary, related*, countries, topics, raiDimensions, enablers, tags, publishedAt, provenance, seo |

### `publications`  (URL `/publications/[slug]`)

Serves two RFP modules: reports and mapping studies; research, policy and innovation briefs. The `type` field separates them and is a listing filter.

| Field | Type |
|---|---|
| `title` | text * |
| `type` | select (report, mapping-study, annual-report, research-brief, policy-brief, innovation-brief, toolkit, comparative-analysis) * |
| `abstract` | richText |
| `authors` | → people[] |
| `authorText` | text. When authors are not in the directory |
| `organisations` | → organisations[] |
| `file` | → media. PDF or other file. Gating is set on the media item |
| `externalUrl` | text. If the publication lives elsewhere |
| `citation` | textarea |
| `pages` | number |
| `cover` | → media |
| shared | slug, summary, related*, countries, topics, enablers, raiDimensions, tags, publishedAt, provenance, seo |

### `datasets`  (URL `/datasets/[slug]`)

| Field | Type |
|---|---|
| `title` | text * |
| `description` | richText |
| `source` | text *. Who produced the data |
| `methodNotes` | textarea |
| `temporalCoverage` | text |
| `updateFrequency` | text |
| `licence` | select (cc-by-4, cc-by-sa-4, cc0, odc, restricted, other) |
| `files` | array of `{ label *, file * → media }` |
| `accessLinks` | array of `{ label *, url * }` |
| `indicators` | → indicators[]. Indicators derived from this dataset, shown with their maps |
| shared | slug, summary, related*, countries, topics, enablers, tags, publishedAt, provenance, seo |

## 3. Data

Indicators and their values power `/data`, `/data/[slug]`, the CSV route and the home page map. Neither collection has drafts; a value is either present or not.

### `indicators`  (URL `/data/[slug]`)

| Field | Type |
|---|---|
| `name` | text * |
| `slug` | text |
| `definition` | textarea *. What it measures and how to read it |
| `unit` | text *. For example "score 0 to 100", "percent" |
| `valueType` | select (number, percent, status) * |
| `min`, `max` | number. When both are set the map uses equal-interval classes, otherwise quantiles |
| `higherIsBetter` | checkbox. Changes the text summary and chart order |
| `statusLabels` | array of `{ code *, label * }`. For status indicators, maps numeric codes to words |
| `enabler` | → enablers |
| `topics` | → topics[] |
| `source` | text *. Producer of the underlying data |
| `sourceUrl` | text |
| `methodology` | textarea |
| `dataset` | → datasets |
| `featured` | checkbox. Show on the Data and maps landing page |
| `order` | number |
| `provenance` | select |

### `indicator-values`

One row per indicator, country and year. Bulk import through the REST API or the seed script.

| Field | Type |
|---|---|
| `label` | text, generated ("Indicator · Country · Year") |
| `indicator` | → indicators * |
| `country` | → countries * |
| `year` | number * |
| `value` | number * |
| `note` | text. Caveat shown in the table, for example "provisional" |
| `sourceUrl` | text. Row-level source if different from the indicator |
| `provenance` | select |

## 4. Commentary

### `posts`  (URL `/blog/[slug]`), `news`  (URL `/news/[slug]`)

| Field | Type |
|---|---|
| `title` | text * |
| `body` | richText * |
| `authors` | → people[] |
| `authorText` | text |
| `image` | → media |
| shared | slug, summary, related*, countries, topics, enablers, tags, publishedAt, provenance, seo |

### `op-eds`  (URL `/op-eds/[slug]`)

External publications. The detail page is a summary card that links out.

| Field | Type |
|---|---|
| `title` | text * |
| `outlet` | text *. Where it was published |
| `externalUrl` | text * |
| `authors` | → people[] |
| `authorText` | text |
| `image` | → media |
| shared | slug, summary, related*, countries, topics, enablers, tags, publishedAt, provenance, seo |

All three appear together on `/commentary`, filterable by type.

## 5. Directory

### `people`  (URL `/people/[slug]`)

| Field | Type |
|---|---|
| `name` | text * |
| `slug` | text |
| `role` | text. Position or role title |
| `organisation` | → organisations |
| `affiliation` | select (team, partner, expert, contributor, advisory) * |
| `bio` | richText |
| `expertise` | → topics[]. Filterable as "topic" on the directory |
| `photo` | → media |
| `links` | array of `{ label *, url * }` |
| `countries` | → countries[] |
| `enablers` | → enablers[] |
| `tags` | → tags[] |
| shared | publishedAt, provenance, seo |

The person page lists their publications, posts, op-eds and events by reverse relationship.

### `organisations`  (URL `/organisations/[slug]`)

| Field | Type |
|---|---|
| `name` | text * |
| `slug` | text |
| `acronym` | text |
| `stakeholderType` | → stakeholder-types * |
| `observatoryRole` | select (lead, partner, funder, member, profiled). Drives `/about/partners` |
| `description` | richText |
| `website` | text |
| `logo` | → media |
| `countries`, `topics`, `enablers`, `tags` | taxonomies |
| shared | publishedAt, provenance, seo |

## 6. Engage

### `events`  (URL `/events/[slug]`)

| Field | Type |
|---|---|
| `title` | text * |
| `description` | richText |
| `startDate` | date * |
| `endDate` | date |
| `timezone` | text |
| `format` | select (online, in-person, hybrid) * |
| `eventType` | select (dialogue, webinar, workshop, convening, scopeathon, cop) |
| `venue` | text |
| `onlineUrl` | text. Shown to registrants |
| `registration` | group: `mode` select (none, form, external), `externalUrl`, `closesAt` date, `capacity` number |
| `organisations` | → organisations[] |
| `speakers` | → people[] |
| `recordingUrl` | text |
| `image` | → media |
| shared | slug, summary, related*, countries, topics, enablers, tags, publishedAt, provenance, seo |

`registration.mode = form` renders the on-site form, which writes to `event-registrations` and marks `waitlisted` once `capacity` is reached.

### `learning-resources`  (URL `/learning/[slug]`)

| Field | Type |
|---|---|
| `title` | text * |
| `description` | richText |
| `resourceType` | select (course, video, toolkit, guide, framework, reading-list) * |
| `level` | select (introductory, intermediate, advanced) |
| `duration` | text |
| `provider` | text |
| `providerOrganisation` | → organisations |
| `externalUrl` | text |
| `file` | → media |
| `videoEmbedUrl` | text. YouTube or Vimeo page URL, converted to a privacy-enhanced embed |
| `language` | text |
| shared | slug, summary, related*, countries, topics, enablers, raiDimensions, tags, publishedAt, provenance, seo |

### `opportunities`  (URL `/opportunities/[slug]`)

| Field | Type |
|---|---|
| `title` | text * |
| `description` | richText |
| `opportunityType` | select (fellowship, grant, programme, call-for-papers, job, competition, event) * |
| `deadline` | date |
| `rolling` | checkbox |
| `provider` | text * |
| `eligibility` | textarea |
| `externalUrl` | text * |
| shared | slug, summary, related*, countries, topics, enablers, tags, publishedAt, provenance, seo |

The listing shows open opportunities first with a closing-soon marker; closed ones remain reachable.

### `newsletters`  (URL `/newsletter/[slug]`)

| Field | Type |
|---|---|
| `title` | text * |
| `issueNumber` | number * |
| `body` | richText. Web version |
| `pdf` | → media |
| `externalUrl` | text. Web version hosted by the email provider, if any |
| `featured` | polymorphic → use-cases, publications, events, posts, opportunities [] |
| shared | slug, summary, publishedAt, provenance, seo |

## 7. Site

### `pages`  (URL `/[slug]`)

Standalone CMS pages such as `about`, `privacy`, `accessibility`.

| Field | Type |
|---|---|
| `title` | text * |
| `slug` | text |
| `summary` | textarea |
| `body` | richText * |
| shared | publishedAt, provenance, seo |

### Global `site-settings`

| Field | Type |
|---|---|
| `siteName` * , `tagline`, `description`, `contactEmail` | identity |
| `social` | array of `{ label *, url * }` |
| `funders`, `partners` | arrays of `{ name *, url, logo → media }`. Footer and `/about/partners`. Logos pending Client assets |
| `programmeNote` | textarea |
| `showPrototypeNotices` | checkbox. Shows "sample content" and "pending confirmation" labels. Turn off when real content is loaded |
| `announcement` | group: `enabled`, `text`, `url` |
| `consentVersion` | text *. Change when consent wording changes; stored with every record |
| `newsletterConsentText`, `downloadConsentText`, `registrationConsentText` | textarea * |
| `retentionMonths` | number, default 24. Retention period for download and registration records. Enforced by the nightly `purge-expired-records` task (`src/jobs/retention.ts`) |

### Global `home`

| Field | Type |
|---|---|
| `headline` * , `intro` * | text |
| `featured` | polymorphic → use-cases, publications, datasets, events, posts []. Up to four lead positions |
| `featuredIndicator` | → indicators. The home page map |
| `audienceEntries` | array of `{ label *, description *, url * }`. "I am a…" entry points, set and order pending confirmation |

## 8. Taxonomies

All taxonomies share `name *` (unique), `slug`, `description`, are readable by everyone and writable by editors and admins. Each has a hub page collecting everything tagged with the term.

| Collection | Hub URL | Extra fields | Seeded terms |
|---|---|---|---|
| `countries` | `/countries/[slug]` | `iso3` * (unique, 3 chars), `isoNumeric` * (matches Natural Earth ids for the map), `subregion` * select (south-asia, southeast-asia), `smallState` checkbox (draw a marker) | 20 countries in South and Southeast Asia |
| `topics` | `/topics/[slug]` | | 10 sectors and thematic areas |
| `enablers` | `/enablers/[slug]` | `order` number | 6 responsible AI ecosystem enablers |
| `rai-dimensions` | `/dimensions/[slug]` | | safe, rights-based, sustainable, inclusive, context-appropriate |
| `stakeholder-types` | filter on `/directory` | | 6 organisation categories |
| `tags` | filter and chips | | cross-cutting themes |

The seed lists are drawn from the Observatory's public description and are marked pending confirmation in the requirements refinement.

## 9. Records (personal data)

Created only by the form endpoints (`create` access is closed to everyone, the endpoints write with elevated access after validation). Readable by editors and admins, updatable by editors (subscriber status, registration status), deletable by admins, never exposed through the public API. Exportable as CSV or JSON from the list view through the Export button (`@payloadcms/plugin-import-export`, synchronous, editors only; import disabled for these three) and separated into `records/` by `pnpm export`.

### `exports` and `imports` (maintained by the import/export plugin)

Each export or import run is kept as a record with its file, format, chosen columns and filter, so there is an audit trail of who exported personal data and when. Grouped under Records, readable by staff, created by editors.

### `download-requests`

`email` *, `file` → media *, `resourceTitle`, `resourceUrl`, `organisation`, `country`, `consentText` *, `consentVersion` *, `ipHash` (one-way HMAC, for abuse detection), `userAgent`.

Written by `POST /api/gate`, which then issues a signed link `/download/[id]?t=…` valid for `GATE_TOKEN_TTL_MINUTES`.

### `subscribers`

`email` *, `name`, `organisation`, `interests` → topics[], `status` select (pending, subscribed, unsubscribed) *, `provider` (which adapter handled it), `providerId`, `consentText` *, `consentVersion` *, `source` (page submitted from).

Written by `POST /api/subscribe`, which also calls the configured newsletter provider.

### `event-registrations`

`event` → events *, `name` *, `email` *, `organisation`, `country`, `stakeholderType` → stakeholder-types, `accessibilityNeeds`, `consentText` *, `consentVersion` *, `status` select (registered, waitlisted, cancelled).

Written by `POST /api/register`.

## 10. Administration

### `users` (auth)

`name` *, `email` *, `role` select (admin, editor, contributor) *. Payload adds password hashing, sessions, lockout after failed attempts and password reset.

### `media` (upload)

`alt` * (required for every file; for documents use the document title), `caption`, `credit`, `access` select (open, gated) *, `gatePurpose` textarea (purpose statement shown next to the gate form).

Accepted types: images, PDF, CSV, XLSX, DOCX, JSON, ZIP. Image sizes generated with sharp: `thumb` 320×200, `card` 720 wide, `wide` 1440 wide. Stored under `./media` or in Vercel Blob depending on `MEDIA_STORAGE`. Gated files are served only through `/download/[id]` with a valid token; open files link directly.

### `search` (maintained by the search plugin)

One row per published document of every public content type. `title`, `priority`, `doc` (polymorphic), plus fields added by `src/hooks/search.ts`: `excerpt`, `keywords` (type label and taxonomy names), `typeLabel`, `path`, `countries`, `topics`, `publishedAt`. Rebuilt on every save; drafts and unpublished documents are removed. Editors can re-index by re-saving a document.

## 11. Access rules (`src/access/roles.ts`)

| Action | Public | contributor | editor | admin |
|---|---|---|---|---|
| Read published content and taxonomies | yes | yes | yes | yes |
| Read drafts | | yes | yes | yes |
| Read version history and restore | | | yes | yes |
| Create and update content as draft | | yes | yes | yes |
| Publish (`_status: published`) | | refused by `contributorsCannotPublish` | yes | yes |
| Archive content (move to Trash) and restore from Trash | | | yes | yes |
| Delete content permanently (from Trash) | | | yes | yes |
| Export any list view as CSV or JSON | | | yes | yes |
| Manage taxonomies, indicators and indicator values | | | yes | yes |
| Upload media | | yes | yes | yes |
| Delete media | | | yes | yes |
| Read and export records (download requests, subscribers, registrations) | | | yes | yes |
| Update record status (subscriber, registration) | | | yes | yes |
| Delete records | | | | yes |
| Edit the `home` global | | | yes | yes |
| Manage users, assign roles, edit `site-settings` | | | | yes |
| Submit public forms (`/api/gate`, `/api/subscribe`, `/api/register`) | yes | yes | yes | yes |

Tested in `tests/integration.test.ts`: a contributor can save a draft, is refused on publish, and an editor can publish the same document; anonymous reads never return drafts.

## 12. Drafts, versions, scheduling and archive

All public content types (sections 2, 4, 5, 6, 7) use Payload versions with drafts: autosave every 1.5 s, up to 25 versions per document with one-click restore, scheduled publishing through the built-in jobs queue (run every minute by `jobs.autoRun` on a server; triggered by a platform cron calling `/api/payload-jobs/run` with `CRON_SECRET` on serverless hosts). Indicators, indicator values, taxonomies and records have no drafts.

The RFP's "unpublish" and "archive" (Section 3.1.3 a) are distinct operations. **Unpublish** reverts the live version to a draft: the URL returns 404, the item leaves listings, search and feeds, and can be republished. **Archive** is `trash: true` on the same collections: "Move to Trash" sets `deletedAt`, removes the item from every public query and from the search index, keeps its versions, and lists it in the admin Trash view where an editor can restore it. Permanent deletion is a separate, confirmed step from Trash.

## 13. Localisation

`localization` is enabled with `en` as the only locale and `fallback: true`. Adding a language is one entry in `src/payload.config.ts` plus `localized: true` on the fields that should be translated (titles, summaries, bodies). Untranslated fields fall back to English.

## 14. Type map (Section 3.1.2 of the RFP)

`src/lib/content-types.ts` is the single registry that maps each collection to its label, listing route, detail route base, RFP module, search priority and taxonomies. Search results, listings, hub pages, sitemap, RSS and the coverage test all read from it. Adding a content type means adding a collection file, one entry in the registry, and a `[slug]/page.tsx`; the test suite fails until the routes exist.
