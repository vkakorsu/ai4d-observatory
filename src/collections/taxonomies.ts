import type { CollectionConfig } from 'payload'
import { taxonomyCollection } from '@/fields/shared'

/**
 * Taxonomies (Section 3.1.4 b). All editable in the CMS.
 * Seed values are drawn from the Observatory's public description and are marked pending confirmation
 * in the requirements refinement (Section 3.1.1 a).
 */

export const Countries: CollectionConfig = taxonomyCollection({
  slug: 'countries',
  label: 'Country',
  plural: 'Countries',
  description:
    'Countries covered by the Observatory. ISO codes drive the map. The list is a seed pending client confirmation.',
  extraFields: [
    {
      name: 'iso3',
      type: 'text',
      required: true,
      unique: true,
      minLength: 3,
      maxLength: 3,
      admin: { description: 'ISO 3166-1 alpha-3, for example LKA.' },
    },
    {
      name: 'isoNumeric',
      type: 'text',
      required: true,
      admin: { description: 'ISO 3166-1 numeric as three digits, for example 144. Matches Natural Earth boundaries.' },
    },
    {
      name: 'subregion',
      type: 'select',
      required: true,
      options: [
        { label: 'South Asia', value: 'south-asia' },
        { label: 'Southeast Asia', value: 'southeast-asia' },
      ],
    },
    {
      name: 'smallState',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Draw a marker on the map because the territory is too small to see at regional scale.' },
    },
  ],
})

export const Topics: CollectionConfig = taxonomyCollection({
  slug: 'topics',
  label: 'Topic',
  plural: 'Topics (sectors)',
  description: 'Sectors and thematic areas, for example health, education, agriculture, climate resilience.',
})

export const Enablers: CollectionConfig = taxonomyCollection({
  slug: 'enablers',
  label: 'Ecosystem enabler',
  plural: 'Ecosystem enablers',
  description:
    'Responsible AI ecosystem enablers used for mapping studies. Seeded with the six enablers in the Observatory description.',
  extraFields: [
    { name: 'order', type: 'number', admin: { description: 'Display order.' } },
  ],
})

export const RaiDimensions: CollectionConfig = taxonomyCollection({
  slug: 'rai-dimensions',
  label: 'Responsible AI dimension',
  plural: 'Responsible AI dimensions',
  description:
    'Qualities of responsible AI. Seeded with safe, rights-based, sustainable, inclusive and context-appropriate.',
})

export const StakeholderTypes: CollectionConfig = taxonomyCollection({
  slug: 'stakeholder-types',
  label: 'Stakeholder type',
  plural: 'Stakeholder types',
  description:
    'Organisation categories. Government, private sector, civil society or NGO, university or research institution, regional or international body, and others the Client agrees.',
})

export const Tags: CollectionConfig = taxonomyCollection({
  slug: 'tags',
  label: 'Tag',
  plural: 'Tags',
  description: 'Free keywords for cross-cutting themes, for example gender, disability, Indigenous communities, environment.',
})
