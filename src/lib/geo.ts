import { geoCentroid, geoEquirectangular, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import type { FeatureCollection, Geometry } from 'geojson'
import type { Topology, GeometryCollection } from 'topojson-specification'
import { createRequire } from 'node:module'

/**
 * Server-rendered regional map (Section 3.1.2 "Interactive maps and data", Section 3.1.4 e).
 * Natural Earth boundaries (public domain, via the world-atlas package) are projected with d3-geo
 * into SVG path strings at render time. No tile service, no client map library, a few tens of kilobytes.
 */

export type CountryShape = {
  isoNumeric: string
  d: string
  /** Projected centroid, used for small-state markers and labels. */
  centroid: [number, number]
}

export type RegionMap = {
  width: number
  height: number
  covered: CountryShape[]
  context: CountryShape[]
}

/*
 * Page weight matters more than coastline detail for this audience (Section 3.1.5 c).
 * The 1:110m atlas (about 100 KB of TopoJSON on the server) produces a regional SVG of a few
 * tens of kilobytes once paths are rounded to one decimal place. The 1:50m atlas is loaded only to
 * place markers for states too small to appear at 1:110m (Maldives, Singapore).
 */
const require = createRequire(import.meta.url)
const topologies: Partial<Record<'110m' | '50m', Topology>> = {}
const loadTopology = (scale: '110m' | '50m'): Topology => {
  const cached = topologies[scale]
  if (cached) return cached
  const topo = require(`world-atlas/countries-${scale}.json`) as Topology
  topologies[scale] = topo
  return topo
}

const toFeatures = (topo: Topology) =>
  (feature(topo, topo.objects.countries as GeometryCollection) as unknown as FeatureCollection<Geometry>).features

const pad = (id: string | number | undefined) => String(id ?? '').padStart(3, '0')

/**
 * Build the SVG geometry for a set of ISO numeric country codes.
 * The projection is fitted to the covered countries with padding, so the region fills the frame.
 */
export const buildRegionMap = (coveredIso: string[], width = 960, height = 620): RegionMap => {
  const features = toFeatures(loadTopology('110m'))
  const wanted = new Set(coveredIso.map(pad))
  const coveredFeatures = features.filter((f) => wanted.has(pad(f.id as string)))

  // Small states absent from the 1:110m atlas still need a centroid for their marker and label.
  const found = new Set(coveredFeatures.map((f) => pad(f.id as string)))
  const missing = [...wanted].filter((iso) => !found.has(iso))
  const detailFeatures = missing.length ? toFeatures(loadTopology('50m')).filter((f) => missing.includes(pad(f.id as string))) : []

  const projection = geoEquirectangular()
  const fitTarget: FeatureCollection<Geometry> = { type: 'FeatureCollection', features: [...coveredFeatures, ...detailFeatures] }
  projection.fitExtent(
    [
      [24, 24],
      [width - 24, height - 24],
    ],
    fitTarget,
  )
  const path = geoPath(projection).digits(1)

  const toShape = (f: (typeof features)[number]): CountryShape | null => {
    const d = path(f)
    if (!d) return null
    const c = projection(geoCentroid(f)) ?? [0, 0]
    return { isoNumeric: pad(f.id as string), d, centroid: [c[0], c[1]] }
  }

  const covered = [
    ...coveredFeatures.map(toShape),
    // Marker-only entries: no outline is drawn at this scale, the centroid carries the marker and label.
    ...detailFeatures.map((f) => {
      const c = projection(geoCentroid(f)) ?? [0, 0]
      return { isoNumeric: pad(f.id as string), d: '', centroid: [c[0], c[1]] as [number, number] }
    }),
  ].filter((s): s is CountryShape => s !== null)

  // Context countries are anything whose projected bounds intersect the frame. Drawn in light grey.
  const context = features
    .filter((f) => !wanted.has(pad(f.id as string)))
    .filter((f) => {
      const b = path.bounds(f)
      return b[1][0] > 0 && b[0][0] < width && b[1][1] > 0 && b[0][1] < height
    })
    .map(toShape)
    .filter((s): s is CountryShape => s !== null)

  return { width, height, covered, context }
}
