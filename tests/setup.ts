import 'dotenv/config'

// Tests never touch the development database. The integration test boots Payload against
// an in-memory SQLite database; set TEST_DATABASE_URI to run it against PostgreSQL instead.
process.env.DATABASE_URI = process.env.TEST_DATABASE_URI || 'file::memory:'
process.env.PAYLOAD_SECRET = process.env.PAYLOAD_SECRET || 'test-secret-0123456789abcdef0123456789abcdef'
process.env.MEDIA_STORAGE = 'local'
process.env.NEWSLETTER_PROVIDER = 'local'
process.env.NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
