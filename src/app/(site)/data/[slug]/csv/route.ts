import { type NextRequest } from 'next/server'
import { findBySlug, getPayloadClient } from '@/lib/payload'
import { indicatorRows } from '@/lib/site'
import { toCsv } from '@/lib/stats'
import type { Indicator } from '@/payload-types'

/** CSV export of one indicator, one year, for the accessible alternative and for reuse (Section 3.1.4 e). */
export async function GET(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const payload = await getPayloadClient()
  const doc = await findBySlug<Indicator>(payload, 'indicators', slug, 0)
  if (!doc) return new Response('Not found', { status: 404 })
  const y = Number(req.nextUrl.searchParams.get('year'))
  const data = await indicatorRows(payload, doc.id, Number.isFinite(y) && y > 0 ? y : undefined)
  const csv = toCsv(
    data.rows.map((r) => ({
      indicator: doc.name,
      unit: doc.unit,
      year: data.year ?? '',
      country: r.country,
      iso3: r.iso3,
      subregion: r.subregion,
      value: r.value,
      note: r.note ?? '',
      source: doc.source,
    })),
  )
  return new Response(csv, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="${slug}-${data.year ?? 'all'}.csv"`,
      'cache-control': 'public, max-age=300',
    },
  })
}
