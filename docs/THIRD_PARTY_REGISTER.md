# Third-party service and licence register

Required by Sections 3.1.5 (e), 3.1.8 (b) and 3.2 ("third-party service/licence register") of the RFP. Versions are those pinned in `package.json` at the time of writing; the register is updated at each dependency update during support.

## Software the website runs on

| Component | Version | Licence | Purpose | Recurring cost | Ownership and lock-in |
|---|---|---|---|---|---|
| Node.js | 22 LTS | MIT | Runtime | None | Open source |
| Next.js, React | 16.3 / 19.2 | MIT | Web framework, server rendering, image pipeline | None | Open source |
| Payload CMS and first-party packages (`payload`, `@payloadcms/next`, `@payloadcms/ui`, `@payloadcms/richtext-lexical`, `@payloadcms/db-postgres`, `@payloadcms/db-sqlite`, `@payloadcms/plugin-search`, `@payloadcms/plugin-import-export`, `@payloadcms/storage-vercel-blob`) | 3.90 | MIT | Content management, admin dashboard, access control, versions, search index, CSV/JSON export, media storage adapter | None | Open source. Payload has been part of Figma since June 2025 and remains MIT licensed. Content lives in the Client's PostgreSQL database and is exportable with the included scripts |
| Drizzle ORM (via Payload) | bundled | Apache 2.0 | Database access and migrations | None | Open source |
| PostgreSQL | 16 | PostgreSQL licence | Production database | None | Open source, standard SQL dumps |
| libSQL / SQLite | via `@payloadcms/db-sqlite` | MIT / public domain | Development and evaluation database | None | Open source |
| d3-geo, topojson-client | 3.1 / 3.1 | ISC | Server-rendered SVG maps | None | Open source |
| world-atlas (Natural Earth boundaries) | 2.0.2 | ISC (code), public domain (data) | Country boundaries | None | Public domain data |
| sharp | 0.35 | Apache 2.0 | Image resizing and AVIF/WebP encoding | None | Open source |
| Newsreader, IBM Plex Sans, IBM Plex Mono (via `@fontsource`) | 5.3 | SIL Open Font Licence 1.1 | Typography, self-hosted | None | Open source, no external requests |
| Caddy | 2 | Apache 2.0 | Reverse proxy, automatic TLS, HTTP/2, compression | None | Open source |
| Umami (optional, self-hosted) | 2 | MIT | Cookieless analytics on the Client's server | None | Open source, data stays on the Client's server |
| Docker Engine and Compose | current | Apache 2.0 | Reproducible deployment | None | Open source |
| Vitest, TypeScript, tsx, cross-env, dotenv (development only) | see `package.json` | MIT | Tests, types, scripts | None | Development tooling, not deployed |
| axe-core, jsdom (development only) | see `package.json` | MPL-2.0 (axe-core), MIT (jsdom) | Automated accessibility sweep (`pnpm a11y`) | None | Development tooling, not deployed |

No proprietary plugin, theme, paid library or component licensed to the consortium rather than the Client is used.

## Services the Client may choose to connect

All are optional, are opened in the Client's name, and are paid directly by the Client where a paid tier is chosen (Section 3.3 footnote of the RFP). The website runs without any of them.

| Service | Purpose | Account holder | Indicative cost | Exit path |
|---|---|---|---|---|
| Brevo or Mailchimp | Sending the quarterly newsletter | Client | Free tiers exist; paid tiers from about USD 9 to 13 per month. Re-check vendor pages | Subscribers are also stored in the CMS and exportable as CSV, so the provider is a configuration change |
| S3-compatible object storage (any provider) | Off-server backups; optionally uploads | Client | About USD 1 to 5 per month at 20 GB | Standard S3 API; files sync to any other provider |
| Google Analytics 4 | Only if preferred over self-hosted Umami | Client | Free | Data held by Google; Umami is the default to avoid this |
| Transactional email (SMTP or API) | Password resets and form notifications | Client | Usually included with the newsletter service or hosting | Standard SMTP |
| Hosting and domain | Provided by the Client under Section 3.1.7 | Client | Client's existing arrangement | Client-owned |

## Evaluation-hosting services used for the prototype only

| Service | Purpose | Paid by | Note |
|---|---|---|---|
| Vercel or Railway or a small VPS | Hosting the prototype during evaluation | Consortium | Not part of the proposed production architecture |
| Neon (if Vercel) | PostgreSQL for the prototype | Consortium | Content is exported and reloaded onto Client infrastructure at production deployment |
| Vercel Blob (if Vercel) | Uploaded files for the prototype | Consortium | Same |
