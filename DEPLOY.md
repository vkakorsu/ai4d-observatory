# DEPLOY. Asia AI4D Observatory

Step-by-step deployment of the production platform on the Client's infrastructure, plus local setup and publishing the repository to GitHub.

The same code runs everywhere. Environment variables switch the database adapter (SQLite or PostgreSQL), media storage (local disk or Vercel Blob), the newsletter provider and the analytics provider. Nothing is hard-coded to a host.

Contents

1. [Environment variables](#1-environment-variables)
2. [Local](#2-local)
3. [Publishing to GitHub](#3-publishing-to-github)
4. [Production on the Client's server with Docker Compose](#4-production-on-the-clients-server-with-docker-compose)
5. [Database migrations](#5-database-migrations)
6. [Connecting the Client's services](#6-connecting-the-clients-services)
7. [Operations](#7-operations): backups, updates, exports, retention
8. [Go-live checklist](#8-go-live-checklist)

## 1. Environment variables

Copy `.env.example` to `.env`. Every variable has a working default for local use.

| Variable | Default | Notes |
|---|---|---|
| `PAYLOAD_SECRET` | change me | Signs sessions and gated-download tokens. `openssl rand -hex 32`. Rotating it logs everyone out and invalidates outstanding download links |
| `DATABASE_URI` | `file:./data/ai4d.db` | SQLite file. Anything starting with `postgres` selects the PostgreSQL adapter, for example `postgres://user:pass@host:5432/ai4d` |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Public origin. Used for absolute links, sitemap, RSS, Open Graph, CORS and CSRF. Build-time on Vercel and Docker |
| `MEDIA_STORAGE` | `local` | `local` writes to `./media`. `vercel-blob` needs `BLOB_READ_WRITE_TOKEN` |
| `NEWSLETTER_PROVIDER` | `local` | `local`, `brevo` (`BREVO_API_KEY`, `BREVO_LIST_ID`) or `mailchimp` (`MAILCHIMP_API_KEY`, `MAILCHIMP_SERVER_PREFIX`, `MAILCHIMP_LIST_ID`). Falls back to `local` if credentials are missing. Subscribers are always stored in the CMS as well |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER` | `none` | `none`, `umami` (`NEXT_PUBLIC_UMAMI_SCRIPT_URL`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID`) or `ga4` (`NEXT_PUBLIC_GA4_ID`). Build-time |
| `NEXT_PUBLIC_NOINDEX` | `false` | `true` makes `robots.txt` disallow everything. Set on every non-production host. Build-time |
| `GATE_TOKEN_TTL_MINUTES` | `30` | Lifetime of a gated download link |
| `JOBS_AUTORUN` | `true` | Built-in jobs runner (scheduled publishing and the nightly retention purge). Automatically off on Vercel. Set `false` to disable on a long-running server |
| `CRON_SECRET` | empty | Bearer token for `GET /api/payload-jobs/run`. Required on Vercel (the endpoint refuses the request if unset). Vercel adds this header to cron calls automatically when the variable is set |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `SEED_EDITOR_EMAIL`, `SEED_EDITOR_PASSWORD` | demo values | Users created by `pnpm seed`. Change before any public deployment, or delete the users after creating real ones |
| `SITE_DOMAIN`, `ACME_EMAIL`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | | Docker Compose only |

`NEXT_PUBLIC_*` values are inlined into the client bundle at build time. Changing them requires a rebuild.

## 2. Local

```bash
pnpm install
cp .env.example .env
pnpm seed          # creates ./data/ai4d.db, ./media, demo users, sample content
pnpm dev           # http://localhost:3000  admin at /admin
```

Production build locally, still on SQLite:

```bash
pnpm build
pnpm start                        # prints a note that standalone output prefers the command below; both work
node .next/standalone/server.js   # what the Docker image runs
```

Checks that should pass before any deployment:

```bash
pnpm typecheck
pnpm test          # 97 unit and integration tests
pnpm a11y          # axe-core over every page type against the running server, exits non-zero on any violation
```

Local PostgreSQL instead of SQLite (for example to prepare migrations, see section 5):

```bash
docker compose up -d db                       # PostgreSQL on localhost:5432 using .env values
DATABASE_URI=postgres://ai4d:<password>@localhost:5432/ai4d pnpm dev
```

## 3. Publishing to GitHub

The repository is MIT-licensed and designed to be public (RFP 3.1.8, portability). Personal data never enters the repository: `.gitignore` excludes `.env`, `data/` (SQLite), `media/` (uploads) and `export/`.

```bash
cd ai4d-prototype
git init -b main
git add .
git commit -m "Asia AI4D Observatory prototype"

gh repo create <org>/ai4d-observatory --public --source . --push
# or without the GitHub CLI:
# git remote add origin git@github.com:<org>/ai4d-observatory.git && git push -u origin main
```

Before pushing, confirm nothing sensitive is staged: `git status --ignored` should list `.env`, `data/`, `media/`. Grep the tree for the demo passwords if they were changed in `.env.example`.

The MIT licence text is in `LICENSE` and declared in `package.json`. Continuous integration is in `.github/workflows/ci.yml` (typecheck and tests on every push). `vercel.json` schedules the jobs runner once a day at 03:00 UTC for Vercel hosts.

## 4. Production on the Client's server with Docker Compose

Requirements: a Linux host with Docker Engine 24+ and the Compose plugin, ports 80 and 443 reachable, a DNS A/AAAA record for the site domain pointing at the host. 2 vCPU, 4 GB RAM and 20 GB disk are ample for this workload.

`docker-compose.yml` runs:

| Service | Image | Role |
|---|---|---|
| `app` | built from `Dockerfile` | Next.js + Payload on port 3000 (internal), runs as an unprivileged user |
| `db` | `postgres:16-alpine` | Database on a named volume `pgdata` |
| `caddy` | `caddy:2-alpine` | Reverse proxy on 80/443 with automatic Let's Encrypt certificates and HSTS |
| `migrate`, `seed`, `export` | builder stage | One-off tools, profile `tools` |
| `umami` | `ghcr.io/umami-software/umami` | Optional self-hosted analytics, profile `analytics`, served at `/stats/` |

Steps:

```bash
git clone https://github.com/<org>/ai4d-observatory.git && cd ai4d-observatory
cp .env.example .env
```

Edit `.env`: set `PAYLOAD_SECRET`, `POSTGRES_PASSWORD`, `SITE_DOMAIN` (for example `observatory.lirneasia.net`), `ACME_EMAIL`, new `SEED_*_PASSWORD` values, and any provider credentials from section 6. `DATABASE_URI` and `NEXT_PUBLIC_SITE_URL` are derived by the compose file and can stay as they are.

```bash
docker compose up -d db                  # start PostgreSQL, wait for healthy
docker compose run --rm migrate          # create the schema (section 5)
docker compose run --rm seed             # optional: labelled sample content and demo users
docker compose up -d --build             # app and caddy
docker compose logs -f app               # watch first boot
```

Open `https://<SITE_DOMAIN>/admin`. Certificates are issued on first request; allow a minute.

Uploaded files live in the `media` named volume. Move an existing `./media` directory in with `docker compose cp ./media app:/app/` if migrating from the prototype host, or copy it into the volume before first start.

Updating:

```bash
git pull
docker compose run --rm migrate          # only if collections changed
docker compose up -d --build app
```

Self-hosted analytics (optional):

```bash
docker compose --profile analytics up -d umami
# log in at https://<SITE_DOMAIN>/stats/ (default admin / umami, change it), add the website, copy the website id
# then in .env: NEXT_PUBLIC_ANALYTICS_PROVIDER=umami
#              NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://<SITE_DOMAIN>/stats/script.js
#              NEXT_PUBLIC_UMAMI_WEBSITE_ID=<id>
docker compose up -d --build app
```

## 5. Database migrations

In development Payload pushes schema changes to SQLite automatically. In production against PostgreSQL, Payload applies versioned migrations instead, so the schema must be created and updated deliberately.

Create the initial migration once, from a workstation with a PostgreSQL connection (the local `db` service from section 2 is fine):

```bash
DATABASE_URI=postgres://ai4d:<password>@localhost:5432/ai4d pnpm payload migrate:create initial
git add src/migrations && git commit -m "Initial migration"
```

Apply migrations on each host with `pnpm payload migrate` (Vercel build command, Railway shell, or `docker compose run --rm migrate`). Whenever a collection or field changes, run `migrate:create <name>` again locally, commit the result, and deploy. `pnpm payload migrate:status` shows what is pending.

SQLite prototypes need none of this. Moving prototype content from SQLite to PostgreSQL is done with `pnpm export` on the old host and re-import through the REST API, or simply by re-running `pnpm seed` and re-entering the small amount of real content created during evaluation.

## 6. Connecting the Client's services

Accounts must be in the Client's name from the start so nothing has to be transferred later.

**Newsletter.** Create a list in Brevo or Mailchimp. Set `NEWSLETTER_PROVIDER` and the provider variables, rebuild or restart. Existing subscribers stored in the CMS (`Records → Subscribers`) can be exported as CSV and imported into the provider. Double opt-in is configured on the provider side; Mailchimp subscriptions are created as `pending` so Mailchimp sends its own confirmation.

**Analytics.** GA4: set `NEXT_PUBLIC_ANALYTICS_PROVIDER=ga4` and `NEXT_PUBLIC_GA4_ID`. Umami cloud or self-hosted: see section 4. Both need a rebuild. Events fired: page views on navigation, `download`, `gated_download_unlocked`, `newsletter_subscribe`, `event_register`, `dataset_access`, `opportunity_open`.

**Media storage.** Local disk is the default and works with the Compose volume. For object storage on Vercel use `MEDIA_STORAGE=vercel-blob`. S3-compatible storage is a small addition (`@payloadcms/storage-s3`) if the Client prefers it.

**Email (transactional).** Password resets and notifications are written to the server log until an email adapter is configured. Add `@payloadcms/email-nodemailer` with the Client's SMTP or Resend credentials in `src/payload.config.ts` (`email:`) when the account exists.

**Domain and TLS.** Point the domain at the host (Compose: Caddy handles certificates; Vercel or Railway: add the domain in their dashboard). Update `NEXT_PUBLIC_SITE_URL` and `SITE_DOMAIN`, set `NEXT_PUBLIC_NOINDEX=false`, rebuild.

## 7. Operations

**Backups.** Two things hold state: the database and the media files.

```bash
docker compose exec db pg_dump -U ai4d ai4d | gzip > backup-$(date +%F).sql.gz
docker run --rm -v ai4d-observatory_media:/media -v "$PWD":/out alpine tar czf /out/media-$(date +%F).tgz -C / media
```

Schedule both daily with cron and copy off-host. Restore with `gunzip -c backup.sql.gz | docker compose exec -T db psql -U ai4d ai4d` and `tar xzf` into the volume.

**Content export (portability, RFP 3.1.8).** `pnpm export` (or `docker compose run --rm export`) writes every collection to JSON with one level of populated relationships and to CSV with ids, plus the globals and a `manifest.json`, into `export/<timestamp>/`. Personal data (download requests, subscribers, registrations) is separated into `export/<timestamp>/records/`. Editors can also export any list view from the admin as CSV or JSON with the Export button (chosen columns, current filter); each run is kept under Records → Exports.

**Scheduled publishing, retention and the jobs runner.** Scheduling a publish queues a job, and the nightly retention purge is a scheduled task. On a long-running server (Compose, Railway, VPS) the built-in runner processes the queue every minute (`jobs.autoRun`; set `JOBS_AUTORUN=false` to disable). On Vercel the runner is off. `vercel.json` already schedules `GET /api/payload-jobs/run` at 03:00 UTC daily; set `CRON_SECRET` in the environment and Vercel will send it as `Authorization: Bearer <CRON_SECRET>` (the endpoint refuses requests when the secret is unset). Hobby plans allow one daily cron, which is enough for the retention purge; scheduled publishing on Vercel waits until that daily run or until an editor publishes by hand. Without a runner, scheduled items stay queued until an editor publishes them by hand and the purge does not run.

**Security headers.** `next.config.ts` sets a Content Security Policy (self, the configured analytics origin, the two video embed hosts), `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` and `Permissions-Policy`. Caddy adds HSTS. If a new third-party script or embed host is introduced, add its origin to the policy in `next.config.ts` and rebuild.

**Retention.** `Site settings → Privacy → retentionMonths` (default 24) is the retention period for download and registration records. The `purge-expired-records` task deletes older records nightly at 03:00 server time through the jobs runner, and logs what it removed. `pnpm retention` (or `docker compose run --rm app pnpm retention`) runs the same purge by hand, for example from an external cron on a host without the runner. Subscribers are kept until they unsubscribe.

**Roles.** `admin` manages users and settings. `editor` creates, publishes, archives content and taxonomies and exports records. `contributor` drafts content only. Create real users in `Administration → Users`, then delete the seeded demo users.

**Monitoring.** The app answers `GET /robots.txt` quickly and without a database hit, which the Docker health check uses. Payload logs to stdout; `docker compose logs`. For uptime and error monitoring, any external checker on `https://<SITE_DOMAIN>/` is sufficient for this traffic profile.

## 8. Go-live checklist

- [ ] `PAYLOAD_SECRET` is unique to production and not the value used on the prototype host
- [ ] Demo users deleted or their passwords changed; at least one real `admin`
- [ ] `NEXT_PUBLIC_SITE_URL` is the production origin; `NEXT_PUBLIC_NOINDEX=false`
- [ ] Prototype host set to `NEXT_PUBLIC_NOINDEX=true` or taken down
- [ ] `Site settings → showPrototypeNotices` turned off once real content is in
- [ ] Sample content replaced or `provenance` updated; `/prototype-notes` reviewed
- [ ] Consent texts and `consentVersion` in Site settings reviewed with the Client's data protection lead
- [ ] Newsletter provider connected and a test subscription confirmed
- [ ] Analytics property connected and a page view visible
- [ ] Backups scheduled and one restore rehearsed
- [ ] `https://<SITE_DOMAIN>/sitemap.xml`, `/robots.txt`, `/feed.xml` checked
- [ ] Lighthouse and an accessibility pass (axe or WAVE) on the home page, one listing, one detail page and `/data`
