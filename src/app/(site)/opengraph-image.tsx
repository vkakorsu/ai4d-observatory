import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'Asia AI4D Observatory. A policy and innovation network on responsible artificial intelligence'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/** Default social sharing image. Typographic, on the paper colour, with the three-square mark. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#f7f5f0',
          color: '#1a1f1c',
          padding: 72,
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <svg width="56" height="56" viewBox="0 0 28 28">
            <rect x="2" y="12" width="10" height="10" fill="#c8371f" />
            <rect x="9" y="6" width="10" height="10" fill="#3f6b4f" opacity="0.9" />
            <rect x="16" y="1" width="10" height="10" fill="#1a1f1c" />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 34, letterSpacing: -0.5 }}>Asia AI4D Observatory</div>
            <div style={{ fontSize: 16, letterSpacing: 3, textTransform: 'uppercase', color: '#5b605d', fontFamily: 'Arial, sans-serif' }}>
              Responsible AI, South and Southeast Asia
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ width: 64, height: 4, background: '#c8371f' }} />
          <div style={{ fontSize: 68, lineHeight: 1.05, letterSpacing: -1.5, maxWidth: 960 }}>Evidence for responsible AI in Asia</div>
          <div style={{ fontSize: 26, color: '#3d423f', fontFamily: 'Arial, sans-serif', maxWidth: 980, lineHeight: 1.35 }}>
            Use cases, mapping studies, data, people and opportunities. A policy and innovation network led by LIRNEasia.
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
