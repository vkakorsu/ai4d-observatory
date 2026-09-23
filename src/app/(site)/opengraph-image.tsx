import { OG_SIZE, renderOgCard } from '@/lib/og'

export const runtime = 'nodejs'
export const alt =
  'Asia AI4D Observatory. A policy and innovation network on responsible artificial intelligence'
export const size = OG_SIZE
export const contentType = 'image/png'

/** Default social sharing image for pages without their own card. */
export default function OpenGraphImage() {
  return renderOgCard({
    kicker: 'Asia AI4D Observatory',
    title: 'Evidence for responsible AI in Asia',
    summary:
      'Use cases, mapping studies, data, people and opportunities. A policy and innovation network led by LIRNEasia.',
    tone: 5,
  })
}
