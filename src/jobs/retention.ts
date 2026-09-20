import type { Payload, TaskConfig } from 'payload'

/*
 * Data retention (Section 3.1.6 c). The privacy notice promises that download and registration
 * records are deleted after the retention period set in Site settings. This task keeps that promise.
 * It runs nightly through the jobs runner, and can be run by hand with `pnpm retention`.
 * Subscribers are not purged: they are kept until they unsubscribe.
 */

export const RETENTION_COLLECTIONS = ['download-requests', 'event-registrations'] as const
export type RetentionCollection = (typeof RETENTION_COLLECTIONS)[number]

export const DEFAULT_RETENTION_MONTHS = 24

export const retentionCutoff = (months: number, now = new Date()): Date => {
  const cutoff = new Date(now)
  cutoff.setUTCMonth(cutoff.getUTCMonth() - months)
  return cutoff
}

export type PurgeResult = { cutoff: string; months: number; deleted: Record<RetentionCollection, number> }

export const purgeExpiredRecords = async (payload: Payload, now = new Date()): Promise<PurgeResult> => {
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  const months = typeof settings.retentionMonths === 'number' && settings.retentionMonths > 0 ? settings.retentionMonths : DEFAULT_RETENTION_MONTHS
  const cutoff = retentionCutoff(months, now)
  const deleted = { 'download-requests': 0, 'event-registrations': 0 } as Record<RetentionCollection, number>
  for (const collection of RETENTION_COLLECTIONS) {
    const result = await payload.delete({
      collection,
      where: { createdAt: { less_than: cutoff.toISOString() } },
      overrideAccess: true,
    })
    deleted[collection] = result.docs.length
  }
  payload.logger.info({ cutoff, months, deleted }, 'Retention purge complete')
  return { cutoff: cutoff.toISOString(), months, deleted }
}

export const purgeExpiredRecordsTask: TaskConfig<'purge-expired-records'> = {
  slug: 'purge-expired-records',
  label: 'Purge expired sign-up records',
  retries: 2,
  // Nightly at 03:00 server time. Runs wherever the jobs runner runs (autoRun or the cron-called endpoint).
  schedule: [{ cron: '0 0 3 * * *', queue: 'nightly' }],
  outputSchema: [
    { name: 'cutoff', type: 'text' },
    { name: 'months', type: 'number' },
    { name: 'downloadRequests', type: 'number' },
    { name: 'eventRegistrations', type: 'number' },
  ],
  handler: async ({ req }) => {
    const result = await purgeExpiredRecords(req.payload)
    return {
      output: {
        cutoff: result.cutoff,
        months: result.months,
        downloadRequests: result.deleted['download-requests'],
        eventRegistrations: result.deleted['event-registrations'],
      },
    }
  },
}
