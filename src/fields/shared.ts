import { APIError, type CollectionBeforeChangeHook, type CollectionConfig, type Field } from 'payload'
import { hasRole, isEditor, publishedOrStaff, staffCanWrite } from '@/access/roles'
import { slugify } from '@/lib/slugify'

/** Slug generated from the title unless an editor overrides it. */
export const slugField = (from = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'URL identifier. Generated from the title, editable.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.trim()) return slugify(value)
        const source = data?.[from]
        return typeof source === 'string' ? slugify(source) : value
      },
    ],
  },
})

/**
 * Provenance marks the boundary between illustrative and real content (Annex 1, Section 5 of the RFP).
 * Every sample item is labelled in the interface while the site setting `showPrototypeNotices` is on.
 */
export const provenanceField: Field = {
  name: 'provenance',
  type: 'select',
  defaultValue: 'sample',
  options: [
    { label: 'Sample content pending client input', value: 'sample' },
    { label: 'Public record (facts from public sources)', value: 'public' },
    { label: 'Client content', value: 'client' },
  ],
  admin: { position: 'sidebar' },
}

export const summaryField: Field = {
  name: 'summary',
  type: 'textarea',
  required: true,
  maxLength: 400,
  admin: { description: 'One to three sentences. Shown in listings, search results and social previews.' },
}

export const publishedAtField: Field = {
  name: 'publishedAt',
  type: 'date',
  admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
  hooks: {
    beforeChange: [
      ({ value, siblingData }) => {
        if (siblingData?._status === 'published' && !value) return new Date().toISOString()
        return value
      },
    ],
  },
}

export const seoGroup: Field = {
  name: 'seo',
  type: 'group',
  admin: { description: 'Optional overrides for search engines and social sharing (Section 3.1.6 e).' },
  fields: [
    { name: 'metaTitle', type: 'text', maxLength: 70 },
    { name: 'metaDescription', type: 'textarea', maxLength: 160 },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'noIndex', type: 'checkbox', defaultValue: false },
  ],
}

/** Shared taxonomy relationships (Section 3.1.4 b). */
export const countriesField: Field = {
  name: 'countries',
  type: 'relationship',
  relationTo: 'countries',
  hasMany: true,
  index: true,
  admin: { position: 'sidebar' },
}
export const topicsField: Field = {
  name: 'topics',
  type: 'relationship',
  relationTo: 'topics',
  hasMany: true,
  index: true,
  admin: { position: 'sidebar', description: 'Sector or thematic area.' },
}
export const enablersField: Field = {
  name: 'enablers',
  type: 'relationship',
  relationTo: 'enablers',
  hasMany: true,
  index: true,
  admin: { position: 'sidebar', description: 'Responsible AI ecosystem enabler(s).' },
}
export const raiDimensionsField: Field = {
  name: 'raiDimensions',
  label: 'Responsible AI dimensions',
  type: 'relationship',
  relationTo: 'rai-dimensions',
  hasMany: true,
  index: true,
  admin: { position: 'sidebar' },
}
export const tagsField: Field = {
  name: 'tags',
  type: 'relationship',
  relationTo: 'tags',
  hasMany: true,
  admin: { position: 'sidebar' },
}

/**
 * Contributors draft, editors publish (Section 3.1.3 c). `_status` is a built-in versions field, so the rule
 * is a collection hook rather than field access. Saving a draft is unaffected; only publishing is refused.
 */
export const contributorsCannotPublish: CollectionBeforeChangeHook = ({ data, req }) => {
  if (data?._status === 'published' && req.user && !hasRole(req.user, 'admin', 'editor')) {
    throw new APIError('Contributors can save drafts but not publish. Ask an editor to publish this item.', 403)
  }
  return data
}

/**
 * Defaults shared by every public content type. Drafts, versions with restore, role-based access.
 *
 * The RFP's five verbs (Section 3.1.3 a) map to Payload features as follows.
 * Create and edit: drafts with autosave. Publish: the Publish button or a scheduled publish.
 * Unpublish: "Unpublish" reverts the live version to a draft; the URL then returns 404 until republished.
 * Archive: "Move to trash" soft-deletes the document (`trash: true`). It leaves listings, search and
 * the public API, keeps its full version history, and can be restored from the Trash view by an editor.
 * Permanent deletion is a separate, admin-confirmed step from the Trash view.
 */
export const contentCollectionDefaults = (
  group: string,
): Pick<CollectionConfig, 'access' | 'versions' | 'admin' | 'hooks' | 'trash'> => ({
  access: {
    read: publishedOrStaff,
    create: staffCanWrite,
    update: staffCanWrite,
    delete: isEditor,
    readVersions: isEditor,
  },
  hooks: {
    beforeChange: [contributorsCannotPublish],
  },
  trash: true,
  versions: {
    drafts: {
      autosave: { interval: 1500 },
      schedulePublish: true,
      validate: false,
    },
    maxPerDoc: 25,
  },
  admin: {
    group,
    useAsTitle: 'title',
    defaultColumns: ['title', 'provenance', '_status', 'updatedAt'],
  },
})

/** Small taxonomy collection factory. Editors manage terms without a developer (Section 3.1.3 e). */
export const taxonomyCollection = (args: {
  slug: string
  label: string
  plural: string
  description: string
  extraFields?: Field[]
}): CollectionConfig => ({
  slug: args.slug,
  labels: { singular: args.label, plural: args.plural },
  admin: {
    group: 'Taxonomies',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
    description: args.description,
  },
  access: {
    read: () => true,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    slugField('name'),
    { name: 'description', type: 'textarea', maxLength: 600 },
    ...(args.extraFields ?? []),
  ],
})
