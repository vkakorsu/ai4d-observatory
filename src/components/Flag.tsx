/**
 * National flag for a country, from the ISO 3166 alpha-3 code stored on each country record.
 * Artwork is flag-icons 7.5.0 (MIT), self-hosted in /public/flags so no page makes a third-party request.
 * The flag is decorative: the country name always sits next to it, so the image has empty alt text.
 * A country outside the table below simply shows no flag; add its code here and its SVG to /public/flags.
 */
const ISO3_TO_ISO2: Record<string, string> = {
  // South Asia
  AFG: 'af', BGD: 'bd', BTN: 'bt', IND: 'in', MDV: 'mv', NPL: 'np', PAK: 'pk', LKA: 'lk',
  // Southeast Asia
  BRN: 'bn', KHM: 'kh', IDN: 'id', LAO: 'la', MYS: 'my', MMR: 'mm', PHL: 'ph', SGP: 'sg', THA: 'th', TLS: 'tl', VNM: 'vn',
  // East Asia, Central Asia and the Pacific, for future expansion
  CHN: 'cn', JPN: 'jp', KOR: 'kr', MNG: 'mn', TWN: 'tw', HKG: 'hk', MAC: 'mo', AUS: 'au', NZL: 'nz', PNG: 'pg', FJI: 'fj',
  KAZ: 'kz', KGZ: 'kg', TJK: 'tj', TKM: 'tm', UZB: 'uz', IRN: 'ir',
}

export function flagSrc(iso3?: string | null): string | null {
  const code = iso3 ? ISO3_TO_ISO2[iso3.toUpperCase()] : undefined
  return code ? `/flags/${code}.svg` : null
}

export function Flag({ iso3, size = 'sm' }: { iso3?: string | null; size?: 'sm' | 'md' | 'lg' }) {
  const src = flagSrc(iso3)
  if (!src) return null
  const w = size === 'lg' ? 48 : size === 'md' ? 24 : 16
  return (
    // eslint-disable-next-line @next/next/no-img-element -- tiny static SVG; the image optimiser adds nothing
    <img className={`flag flag--${size}`} src={src} alt="" width={w} height={(w * 3) / 4} loading="lazy" decoding="async" />
  )
}
