import type { CollectionConfig } from 'payload'
import { isEditor } from '@/access/roles'
import { provenanceField, slugField } from '@/fields/shared'

/*
 * Interactive maps and data (Section 3.1.2 and 3.1.4 d).
 * Indicator definitions and per-country, per-year values are records.
 * The map, chart and table render from these, so editors update visualisations through the CMS.
 */

export const Indicators: CollectionConfig = {
  slug: 'indicators',
  labels: { singular: 'Indicator', plural: 'Indicators' },
  admin: {
    group: 'Data',
    useAsTitle: 'name',
    defaultColumns: ['name', 'unit', 'enabler', 'provenance'],
    description: 'Each indicator is shown as a regional map, a chart and a table. Values are entered as indicator values.',
  },
  access: {
    read: () => true,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    { name: 'definition', type: 'textarea', required: true, admin: { description: 'What the indicator measures and how to read it.' } },
    {
      type: 'row',
      fields: [
        {
          name: 'unit',
          type: 'text',
          required: true,
          admin: { description: 'For example score 0 to 100, count, percent, USD million.' },
        },
        {
          name: 'valueType',
          type: 'select',
          required: true,
          defaultValue: 'number',
          options: [
            { label: 'Number', value: 'number' },
            { label: 'Percentage', value: 'percent' },
            { label: 'Status (categorical)', value: 'status' },
          ],
        },
        { name: 'min', type: 'number' },
        { name: 'max', type: 'number' },
        { name: 'higherIsBetter', type: 'checkbox', defaultValue: true },
      ],
    },
    {
      name: 'statusLabels',
      type: 'array',
      admin: {
        description: 'For status indicators. Map numeric codes to labels, for example 0 None, 1 Draft, 2 Adopted.',
        condition: (data) => data?.valueType === 'status',
      },
      fields: [
        { name: 'code', type: 'number', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
    { name: 'enabler', type: 'relationship', relationTo: 'enablers' },
    { name: 'topics', type: 'relationship', relationTo: 'topics', hasMany: true },
    { name: 'source', type: 'text', required: true, admin: { description: 'Producer of the underlying data.' } },
    { name: 'sourceUrl', type: 'text' },
    { name: 'methodology', type: 'textarea' },
    { name: 'dataset', type: 'relationship', relationTo: 'datasets' },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { description: 'Show on the Data and Maps landing page.' } },
    { name: 'order', type: 'number' },
    provenanceField,
  ],
}

export const IndicatorValues: CollectionConfig = {
  slug: 'indicator-values',
  labels: { singular: 'Indicator value', plural: 'Indicator values' },
  admin: {
    group: 'Data',
    useAsTitle: 'label',
    defaultColumns: ['label', 'indicator', 'country', 'year', 'value'],
    description: 'One row per indicator, country and year. Bulk import is available through the API or the import script.',
    listSearchableFields: ['label'],
  },
  access: {
    read: () => true,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      admin: { readOnly: true, description: 'Generated.' },
      hooks: {
        beforeChange: [
          async ({ data, req }) => {
            if (!data) return undefined
            const [ind, ctry] = await Promise.all([
              typeof data.indicator === 'object' && data.indicator
                ? data.indicator
                : data.indicator
                  ? req.payload.findByID({ collection: 'indicators', id: data.indicator, depth: 0 })
                  : null,
              typeof data.country === 'object' && data.country
                ? data.country
                : data.country
                  ? req.payload.findByID({ collection: 'countries', id: data.country, depth: 0 })
                  : null,
            ])
            const indName = (ind as { name?: string } | null)?.name ?? 'indicator'
            const ctryName = (ctry as { name?: string } | null)?.name ?? 'country'
            return `${indName} / ${ctryName} / ${data.year ?? ''}`
          },
        ],
      },
    },
    {
      type: 'row',
      fields: [
        { name: 'indicator', type: 'relationship', relationTo: 'indicators', required: true, index: true },
        { name: 'country', type: 'relationship', relationTo: 'countries', required: true, index: true },
        { name: 'year', type: 'number', required: true, min: 1990, max: 2100, index: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'value', type: 'number', required: true },
        { name: 'note', type: 'text', admin: { description: 'Caveat shown in the table, for example provisional.' } },
      ],
    },
    { name: 'sourceUrl', type: 'text', admin: { description: 'Row-level source if different from the indicator source.' } },
    provenanceField,
  ],
}
