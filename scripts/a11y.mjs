import { JSDOM, VirtualConsole } from 'jsdom'
import axe from 'axe-core'

/*
 * Automated accessibility sweep (Section 3.1.6 a). Runs axe-core against the server-rendered HTML of
 * every page type, including one detail page per content type discovered from its listing.
 *
 *   pnpm a11y                       against http://localhost:3000
 *   pnpm a11y -- --base https://…   against a deployed instance
 *
 * Exits non-zero if any violation is found. Colour contrast is checked separately in a real browser
 * (jsdom does not compute layout), and manually with NVDA and VoiceOver as the work plan states.
 */

const args = process.argv.slice(2)
const baseIndex = args.indexOf('--base')
const base = (baseIndex >= 0 ? args[baseIndex + 1] : process.env.A11Y_BASE_URL) || 'http://localhost:3000'

const pages = [
  '/',
  '/use-cases',
  '/use-cases?country=sri-lanka',
  '/publications',
  '/datasets',
  '/data',
  '/directory',
  '/directory?view=organisations',
  '/events',
  '/learning',
  '/opportunities',
  '/newsletter',
  '/commentary',
  '/search?q=health',
  '/countries/sri-lanka',
  '/about',
  '/about/partners',
  '/privacy',
  '/accessibility',
  '/prototype-notes',
  '/does-not-exist',
]

// One detail page per content type, discovered from the listing that shows it.
const detailSources = [
  ['/use-cases', '/use-cases'],
  ['/publications', '/publications'],
  ['/datasets', '/datasets'],
  ['/data', '/data'],
  ['/events', '/events'],
  ['/directory', '/people'],
  ['/directory?view=organisations', '/organisations'],
  ['/commentary', '/blog'],
  ['/commentary?type=op-eds', '/op-eds'],
  ['/commentary?type=news', '/news'],
  ['/learning', '/learning'],
  ['/opportunities', '/opportunities'],
  ['/newsletter', '/newsletter'],
]

const fetchHtml = async (p) => {
  const r = await fetch(base + p)
  return { status: r.status, html: await r.text() }
}

const firstDetail = async (listing, prefix) => {
  const { html } = await fetchHtml(listing)
  const m = html.match(new RegExp(`href="(${prefix}/[a-z0-9-]+)"`))
  return m ? m[1] : null
}

const details = []
for (const [listing, prefix] of detailSources) {
  const d = await firstDetail(listing, prefix)
  if (d && !pages.includes(d)) details.push(d)
}

const vc = new VirtualConsole()
const all = [...pages, ...details]
let total = 0
for (const p of all) {
  const { status, html } = await fetchHtml(p)
  const dom = new JSDOM(html, { url: base + p, virtualConsole: vc, pretendToBeVisual: true, runScripts: 'outside-only' })
  const { window } = dom
  window.eval(axe.source)
  const results = await window.axe.run(window.document, {
    rules: { 'color-contrast': { enabled: false } },
    resultTypes: ['violations'],
  })
  const v = results.violations
  total += v.length
  console.log(`${status} ${p}  violations=${v.length}`)
  for (const item of v) {
    console.log(`  [${item.impact}] ${item.id}: ${item.help} (${item.nodes.length} nodes)`)
    for (const n of item.nodes.slice(0, 3)) console.log(`     ${n.target.join(' ')} :: ${n.html.slice(0, 140).replace(/\s+/g, ' ')}`)
  }
  window.close()
}
console.log(`\n${total} violations across ${all.length} pages`)
process.exit(total ? 1 : 0)
