/**
 * Generated cover art for items without a photograph or a designed cover (Section 3.1.1 d, visual language).
 *
 * Deterministic: the same item always gets the same artwork, derived from its slug. Built only from the
 * identity's own parts, the three-square mark, the teal-green data ramp and the vermilion accent, so a page of
 * listings reads as one family without stock imagery. Inline SVG of a few kilobytes, no request, sharp at any size.
 * A real uploaded image always takes precedence (see `isPlaceholderImage`).
 */

const RAMP = ['#e6efe9', '#c3d9cc', '#95bda9', '#659c84', '#3f7a63', '#25553f']
const ACCENT = '#c8371f'
const INK = '#1a1f1c'
const PAPER = '#f7f5f0'
const PAPER_DEEP = '#efece4'
const OCHRE = '#c99a2e'

/** FNV-1a string hash, then mulberry32. Small, fast, stable across server restarts. */
const hash = (s: string) => {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}
const rng = (seed: number) => () => {
  seed |= 0
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

/** Greedy word wrap by an average character width. Good enough for a cover; exact metrics are not needed. */
const wrap = (text: string, maxChars: number, maxLines: number): string[] => {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    if (!line) line = w
    else if ((line + ' ' + w).length <= maxChars) line += ' ' + w
    else {
      lines.push(line)
      line = w
    }
    if (lines.length === maxLines) break
  }
  if (line && lines.length < maxLines) lines.push(line)
  const used = lines.join(' ').split(/\s+/).length
  if (used < words.length && lines.length)
    lines[lines.length - 1] = `${lines[lines.length - 1].replace(/[,.;:]?$/, '')}…`
  return lines
}

/** Band colour per publication type, so a shelf of reports is scannable at a glance. */
const TYPE_TONE: Record<string, { band: string; ground: string; ink: string; sub: string }> = {
  'annual-report': { band: ACCENT, ground: INK, ink: '#ffffff', sub: '#c9ccc9' },
  report: { band: RAMP[4], ground: PAPER, ink: INK, sub: '#5b605d' },
  'mapping-study': { band: RAMP[5], ground: PAPER, ink: INK, sub: '#5b605d' },
  'research-brief': { band: OCHRE, ground: PAPER, ink: INK, sub: '#5b605d' },
  'policy-brief': { band: ACCENT, ground: PAPER, ink: INK, sub: '#5b605d' },
  'innovation-brief': { band: RAMP[3], ground: PAPER, ink: INK, sub: '#5b605d' },
  toolkit: { band: INK, ground: PAPER_DEEP, ink: INK, sub: '#5b605d' },
  'comparative-analysis': { band: RAMP[2], ground: PAPER, ink: INK, sub: '#5b605d' },
  dataset: { band: OCHRE, ground: PAPER_DEEP, ink: INK, sub: '#5b605d' },
}

/** Portrait "report cover", 3:4. Used for publications and datasets. */
export function ReportCover({
  seed,
  kind,
  label,
  title,
  className,
}: {
  seed: string
  kind: string
  label: string
  title: string
  className?: string
}) {
  const tone = TYPE_TONE[kind] ?? TYPE_TONE.report
  const r = rng(hash(seed))
  const lines = wrap(title, 17, 6)
  // A strip of the data ramp along the foot, like the spine of a series.
  const cells = Array.from({ length: 10 }, (_, i) => ({ i, v: Math.floor(r() * RAMP.length) }))
  const accentAt = Math.floor(r() * cells.length)
  return (
    <svg
      className={className}
      viewBox="0 0 300 400"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="300" height="400" fill={tone.ground} />
      <rect width="300" height="14" fill={tone.band} />
      <text
        x="24"
        y="54"
        fill={tone.band === INK ? tone.sub : tone.band}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </text>
      <rect x="24" y="66" width="28" height="2" fill={tone.band} />
      {lines.map((l, i) => (
        <text
          key={i}
          x="24"
          y={106 + i * 30}
          fill={tone.ink}
          style={{ fontFamily: 'var(--font-display)', fontSize: 25, letterSpacing: '-0.01em' }}
        >
          {l}
        </text>
      ))}
      {cells.map((c) => (
        <rect
          key={c.i}
          x={24 + c.i * 25.2}
          y="318"
          width="22"
          height="22"
          fill={c.i === accentAt ? ACCENT : RAMP[c.v]}
          opacity={tone.ground === INK ? 0.9 : 1}
        />
      ))}
      <g transform="translate(24 356)">
        <rect x="0" y="9" width="9" height="9" fill={ACCENT} />
        <rect x="6" y="4.5" width="9" height="9" fill="#3f6b4f" opacity="0.9" />
        <rect x="12" y="0" width="9" height="9" fill={tone.ground === INK ? '#ffffff' : INK} />
        <text
          x="30"
          y="15"
          fill={tone.sub}
          style={{ fontFamily: 'var(--font-text)', fontSize: 11, letterSpacing: '0.04em' }}
        >
          Asia AI4D Observatory
        </text>
      </g>
    </svg>
  )
}

/**
 * Landscape "data mosaic", 16:9. Used for use cases, blog posts and events. A field of squares shaded from the
 * choropleth ramp along a random gradient, with one vermilion square, echoing the mark and the maps.
 */
export function MosaicCover({
  seed,
  label,
  className,
  quiet = false,
  banner = false,
}: {
  seed: string
  label?: string
  className?: string
  quiet?: boolean
  /** 3:1 banner for detail pages instead of the 16:9 card. */
  banner?: boolean
}) {
  const r = rng(hash(seed))
  const cols = banner ? 24 : 16
  const rows = banner ? 8 : 9
  const size = 20
  // Gradient direction and a soft ridge give each item its own landscape.
  const angle = r() * Math.PI * 2
  const dx = Math.cos(angle)
  const dy = Math.sin(angle)
  const ridge = 0.3 + r() * 0.4
  const accent = { c: Math.floor(r() * cols), r: Math.floor(r() * rows) }
  const rects: Array<{ x: number; y: number; fill: string }> = []
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const t = ((x / (cols - 1) - 0.5) * dx + (y / (rows - 1) - 0.5) * dy + 0.5) * 0.85 + r() * 0.3
      const d = Math.abs(t - ridge)
      if (quiet ? d > 0.28 : d > 0.42) continue
      const level = Math.max(
        0,
        Math.min(RAMP.length - 1, Math.round((1 - d / 0.42) * (RAMP.length - 1))),
      )
      rects.push({ x, y, fill: RAMP[level] })
    }
  }
  return (
    <svg
      className={className}
      viewBox={`0 0 ${cols * size} ${rows * size}`}
      role="presentation"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width={cols * size} height={rows * size} fill={PAPER_DEEP} />
      {rects.map((q) => (
        <rect
          key={`${q.x}-${q.y}`}
          x={q.x * size + 1}
          y={q.y * size + 1}
          width={size - 2}
          height={size - 2}
          fill={q.fill}
        />
      ))}
      <rect
        x={accent.c * size + 1}
        y={accent.r * size + 1}
        width={size - 2}
        height={size - 2}
        fill={ACCENT}
      />
      {label && (
        <g>
          <rect x="12" y="12" width={label.length * 7.2 + 16} height="20" fill={PAPER} />
          <text
            x="20"
            y="26"
            fill={INK}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10.5,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </text>
        </g>
      )}
    </svg>
  )
}

type ImageLike =
  | {
      url?: string | null
      mimeType?: string | null
      caption?: string | null
      filename?: string | null
    }
  | null
  | undefined

/**
 * True for the sample SVG placeholders the seed script attached before generated covers existed.
 * Those carry no information, so the site draws generated art instead. Any real upload returns false.
 */
export const isPlaceholderImage = (img: ImageLike): boolean =>
  !img ||
  !img.url ||
  (img.mimeType === 'image/svg+xml' &&
    (/^Sample image/i.test(img.caption ?? '') || /^cover-/.test(img.filename ?? '')))

type HeroImageProps = {
  image:
    | (ImageLike & {
        alt?: string | null
        credit?: string | null
        sizes?: { wide?: { url?: string | null } | null } | null
      })
    | null
  seed: string
  label: string
}

/** Detail-page hero. The uploaded image with caption and credit, or generated art when there is none. */
export function HeroImage({ image, seed, label }: HeroImageProps) {
  if (image && !isPlaceholderImage(image)) {
    return (
      <figure className="hero-figure">
        {/* eslint-disable-next-line @next/next/no-img-element -- CMS media is resized to WebP on upload; see Media.imageSizes */}
        <img
          className="cover-img"
          src={image.sizes?.wide?.url ?? image.url ?? ''}
          alt={image.alt ?? ''}
          width={1440}
          height={810}
          decoding="async"
          fetchPriority="high"
        />
        {(image.caption || image.credit) && (
          <figcaption className="tiny muted">
            {image.caption} {image.credit && <span>Credit. {image.credit}</span>}
          </figcaption>
        )}
      </figure>
    )
  }
  return (
    <div className="hero-figure hero-figure--art">
      <MosaicCover seed={seed} label={label} className="cover-art" quiet banner />
    </div>
  )
}
