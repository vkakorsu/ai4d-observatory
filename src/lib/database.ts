import { postgresAdapter } from '@payloadcms/db-postgres'

/**
 * Postgres is a static import so Vercel traces it. SQLite is a dynamic import so
 * webpack does not pull native `libsql` into the serverless bundle. A static
 * `@payloadcms/db-sqlite` import caused every dynamic route to 500 on Next 15.4
 * (`Cannot find module 'libsql'`).
 */
export async function createDatabaseAdapter() {
  const databaseUri = process.env.DATABASE_URI || 'file:./data/ai4d.db'
  if (process.env.VERCEL || databaseUri.startsWith('postgres')) {
    return postgresAdapter({ pool: { connectionString: databaseUri } })
  }
  const { sqliteAdapter } = await import('@payloadcms/db-sqlite')
  return sqliteAdapter({ client: { url: databaseUri } })
}
