import 'dotenv/config'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// Tests never touch the development database. The integration test boots Payload against
// an in-memory SQLite database; set TEST_DATABASE_URI to run it against PostgreSQL instead.
process.env.DATABASE_URI = process.env.TEST_DATABASE_URI || 'file::memory:'
process.env.PAYLOAD_SECRET =
  process.env.PAYLOAD_SECRET || 'test-secret-0123456789abcdef0123456789abcdef'
process.env.MEDIA_STORAGE = 'local'
// Uploads made by the tests go to a throwaway folder, never into the project's media directory.
process.env.MEDIA_DIR = mkdtempSync(join(tmpdir(), 'ai4d-test-media-'))
process.env.NEWSLETTER_PROVIDER = 'local'
process.env.NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
