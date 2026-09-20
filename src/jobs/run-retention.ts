import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import { purgeExpiredRecords } from './retention'

/*
 * Run the retention purge once, from the command line or an external scheduler.
 *
 *   pnpm retention
 */
const payload = await getPayload({ config })
const result = await purgeExpiredRecords(payload)
console.log(`Deleted ${result.deleted['download-requests']} download requests and ${result.deleted['event-registrations']} event registrations older than ${result.months} months (before ${result.cutoff}).`)
process.exit(0)
