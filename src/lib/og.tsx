import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

/**
 * Branded social sharing cards (Section 3.1.6 e). One renderer for the site default and for every
 * content item, so a use case shared on LinkedIn shows its own title, type and countries in the
 * Observatory's typography rather than a generic image. Raster PNG, 1200 by 630, as the platforms expect.
 */

export const OG_SIZE = { width: 1200, height: 630 }

const font = (file: string) => readFile(join(process.cwd(), 'assets/fonts', file))

let fontsPromise: Promise<
  NonNullable<ConstructorParameters<typeof ImageResponse>[1]>['fonts']
> | null = null
const loadFonts = () => {
  fontsPromise ??= Promise.all([
    font('newsreader-latin-400-normal.woff'),
    font('newsreader-latin-500-normal.woff'),
    font('ibm-plex-sans-latin-400-normal.woff'),
    font('ibm-plex-sans-latin-600-normal.woff'),
    font('ibm-plex-mono-latin-500-normal.woff'),
  ]).then(([n4, n5, s4, s6, m5]) => [
    { name: 'Newsreader', data: n4, weight: 400 as const, style: 'normal' as const },
    { name: 'Newsreader', data: n5, weight: 500 as const, style: 'normal' as const },
    { name: 'Plex', data: s4, weight: 400 as const, style: 'normal' as const },
    { name: 'Plex', data: s6, weight: 600 as const, style: 'normal' as const },
    { name: 'Mono', data: m5, weight: 500 as const, style: 'normal' as const },
  ])
  return fontsPromise
}

const INK = '#1a1f1c'
const PAPER = '#f7f5f0'
const ACCENT = '#c8371f'
const RAMP = ['#e6efe9', '#c3d9cc', '#95bda9', '#659c84', '#3f7a63', '#25553f']

const clip = (s: string, n: number) =>
  s.length > n ? `${s.slice(0, n - 1).replace(/\s+\S*$/, '')}…` : s

export type OgCard = {
  kicker: string
  title: string
  summary?: string | null
  tags?: string[]
  /** 0 to 5. Height of the ramp motif, so cards of different types are recognisably different. */
  tone?: number
}

export async function renderOgCard(card: OgCard) {
  const title = clip(card.title, 110)
  const size = title.length > 80 ? 54 : title.length > 50 ? 64 : 76
  const tone = Math.max(0, Math.min(5, card.tone ?? 4))
  const tags = (card.tags ?? []).slice(0, 4)
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: PAPER,
        color: INK,
        fontFamily: 'Plex',
      }}
    >
      <div style={{ width: 14, height: '100%', background: ACCENT, display: 'flex' }} />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 64px 52px 64px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <svg width="44" height="44" viewBox="0 0 28 28">
            <rect x="2" y="12" width="10" height="10" fill={ACCENT} />
            <rect x="9" y="6" width="10" height="10" fill="#3f6b4f" opacity="0.9" />
            <rect x="16" y="1" width="10" height="10" fill={INK} />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontFamily: 'Newsreader', fontSize: 30, fontWeight: 500 }}>
              Asia AI4D Observatory
            </div>
            <div
              style={{
                fontSize: 14,
                letterSpacing: 2.5,
                textTransform: 'uppercase',
                color: '#5b605d',
              }}
            >
              Responsible AI, South and Southeast Asia
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 880 }}>
          <div
            style={{
              display: 'flex',
              fontFamily: 'Mono',
              fontSize: 20,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: ACCENT,
            }}
          >
            {card.kicker}
          </div>
          <div
            style={{
              fontFamily: 'Newsreader',
              fontSize: size,
              lineHeight: 1.06,
              letterSpacing: -1,
            }}
          >
            {title}
          </div>
          {card.summary && (
            <div style={{ fontSize: 24, lineHeight: 1.4, color: '#3d423f' }}>
              {clip(card.summary, 150)}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10, minHeight: 36 }}>
          {tags.map((t) => (
            <div
              key={t}
              style={{
                display: 'flex',
                fontSize: 18,
                padding: '6px 14px',
                border: '1.5px solid #95bda9',
                background: '#e6efe9',
                borderRadius: 999,
                color: '#25553f',
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
      {/* Data-ramp motif: the choropleth ramp as a column, a quiet signal that this is a data-led observatory. */}
      <div
        style={{
          width: 150,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          gap: 10,
          padding: '0 40px 52px 0',
        }}
      >
        {RAMP.slice(0, tone + 1).map((c) => (
          <div key={c} style={{ display: 'flex', width: 110, height: 58, background: c }} />
        ))}
      </div>
    </div>,
    { ...OG_SIZE, fonts: await loadFonts() },
  )
}
