import type { CollectionConfig, Field } from 'payload'
import {
  contentCollectionDefaults,
  countriesField,
  enablersField,
  provenanceField,
  publishedAtField,
  raiDimensionsField,
  seoGroup,
  slugField,
  summaryField,
  tagsField,
  topicsField,
} from '@/fields/shared'

/*
 * Content types for every module in Section 3.1.2 of the RFP.
 * Structured fields and metadata rather than free-form pages (Section 3.1.3 b).
 * Relationships between types (Section 3.1.4 c).
 */

const richText = (name = 'body', required = false): Field => ({ name, type: 'richText', required })

const relatedFields: Field[] = [
  {
    type: 'collapsible',
    label: 'Related content',
    admin: { initCollapsed: true },
    fields: [
      { name: 'relatedUseCases', type: 'relationship', relationTo: 'use-cases', hasMany: true },
      {
        name: 'relatedPublications',
        type: 'relationship',
        relationTo: 'publications',
        hasMany: true,
      },
      { name: 'relatedDatasets', type: 'relationship', relationTo: 'datasets', hasMany: true },
      { name: 'relatedEvents', type: 'relationship', relationTo: 'events', hasMany: true },
      {
        name: 'relatedLearning',
        type: 'relationship',
        relationTo: 'learning-resources',
        hasMany: true,
      },
    ],
  },
]

const externalLinks: Field = {
  name: 'links',
  type: 'array',
  admin: {
    description: 'External links, for example a project site, a repository or press coverage.',
  },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'url', type: 'text', required: true },
  ],
}

export const UseCases: CollectionConfig = {
  slug: 'use-cases',
  labels: { singular: 'Use case', plural: 'Use cases' },
  ...contentCollectionDefaults('Repository'),
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    summaryField,
    richText('body'),
    {
      type: 'row',
      fields: [
        {
          name: 'stage',
          type: 'select',
          required: true,
          options: [
            { label: 'Concept', value: 'concept' },
            { label: 'Pilot', value: 'pilot' },
            { label: 'Deployed', value: 'deployed' },
            { label: 'Scaled', value: 'scaled' },
            { label: 'Discontinued', value: 'discontinued' },
          ],
        },
        { name: 'yearStarted', type: 'number', min: 2000, max: 2100 },
      ],
    },
    {
      name: 'problem',
      type: 'textarea',
      admin: { description: 'The development problem addressed.' },
    },
    {
      name: 'responsibleAiPractices',
      label: 'Responsible AI practices',
      type: 'textarea',
      admin: {
        description: 'How safety, rights, sustainability, inclusion and context were handled.',
      },
    },
    {
      name: 'evidenceOfImpact',
      type: 'textarea',
      admin: { description: 'What is known about results, with sources where possible.' },
    },
    { name: 'organisations', type: 'relationship', relationTo: 'organisations', hasMany: true },
    { name: 'people', type: 'relationship', relationTo: 'people', hasMany: true },
    externalLinks,
    { name: 'image', type: 'upload', relationTo: 'media' },
    ...relatedFields,
    countriesField,
    topicsField,
    raiDimensionsField,
    enablersField,
    tagsField,
    publishedAtField,
    provenanceField,
    seoGroup,
  ],
}

export const publicationTypes = [
  { label: 'Report', value: 'report' },
  { label: 'Mapping study', value: 'mapping-study' },
  { label: 'Annual progress report', value: 'annual-report' },
  { label: 'Research brief', value: 'research-brief' },
  { label: 'Policy brief', value: 'policy-brief' },
  { label: 'Innovation brief', value: 'innovation-brief' },
  { label: 'Toolkit', value: 'toolkit' },
  { label: 'Comparative analysis', value: 'comparative-analysis' },
] as const

export const Publications: CollectionConfig = {
  slug: 'publications',
  labels: { singular: 'Publication', plural: 'Publications' },
  ...contentCollectionDefaults('Repository'),
  defaultSort: '-publishedAt',
  admin: {
    ...contentCollectionDefaults('Repository').admin,
    defaultColumns: ['title', 'type', 'provenance', '_status', 'publishedAt'],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'type',
      type: 'select',
      required: true,
      index: true,
      options: [...publicationTypes],
    },
    summaryField,
    richText('abstract'),
    {
      name: 'authors',
      type: 'relationship',
      relationTo: 'people',
      hasMany: true,
    },
    {
      name: 'authorText',
      type: 'text',
      admin: { description: 'Use when authors are not in the directory.' },
    },
    { name: 'organisations', type: 'relationship', relationTo: 'organisations', hasMany: true },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'PDF or other file. Gating is set on the media item.' },
    },
    {
      name: 'externalUrl',
      type: 'text',
      admin: { description: 'If the publication lives elsewhere.' },
    },
    { name: 'citation', type: 'textarea' },
    { name: 'pages', type: 'number' },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    ...relatedFields,
    countriesField,
    topicsField,
    enablersField,
    raiDimensionsField,
    tagsField,
    publishedAtField,
    provenanceField,
    seoGroup,
  ],
}

export const Datasets: CollectionConfig = {
  slug: 'datasets',
  labels: { singular: 'Dataset', plural: 'Datasets' },
  ...contentCollectionDefaults('Repository'),
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    summaryField,
    richText('description'),
    {
      name: 'source',
      type: 'text',
      required: true,
      admin: { description: 'Who produced the data.' },
    },
    { name: 'methodNotes', type: 'textarea', admin: { description: 'Method, coverage, caveats.' } },
    {
      type: 'row',
      fields: [
        {
          name: 'temporalCoverage',
          type: 'text',
          admin: { description: 'For example 2020 to 2025.' },
        },
        { name: 'updateFrequency', type: 'text' },
        {
          name: 'licence',
          type: 'select',
          options: [
            { label: 'CC BY 4.0', value: 'cc-by-4' },
            { label: 'CC BY-SA 4.0', value: 'cc-by-sa-4' },
            { label: 'CC0', value: 'cc0' },
            { label: 'Open Data Commons', value: 'odc' },
            { label: 'Restricted', value: 'restricted' },
            { label: 'Other (see notes)', value: 'other' },
          ],
        },
      ],
    },
    {
      name: 'files',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'file', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    {
      name: 'accessLinks',
      type: 'array',
      admin: { description: 'External access, view or API links.' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    { name: 'indicators', type: 'relationship', relationTo: 'indicators', hasMany: true },
    ...relatedFields,
    countriesField,
    topicsField,
    enablersField,
    tagsField,
    publishedAtField,
    provenanceField,
    seoGroup,
  ],
}

const articleFields = (extra: Field[] = []): Field[] => [
  { name: 'title', type: 'text', required: true },
  slugField(),
  summaryField,
  ...extra,
  { name: 'authors', type: 'relationship', relationTo: 'people', hasMany: true },
  { name: 'authorText', type: 'text' },
  { name: 'image', type: 'upload', relationTo: 'media' },
  ...relatedFields,
  countriesField,
  topicsField,
  enablersField,
  tagsField,
  publishedAtField,
  provenanceField,
  seoGroup,
]

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Blog post', plural: 'Blog and commentary' },
  ...contentCollectionDefaults('Commentary'),
  defaultSort: '-publishedAt',
  fields: articleFields([richText('body', true)]),
}

export const OpEds: CollectionConfig = {
  slug: 'op-eds',
  labels: { singular: 'Op-ed or external publication', plural: 'Op-eds and external publications' },
  ...contentCollectionDefaults('Commentary'),
  defaultSort: '-publishedAt',
  fields: articleFields([
    {
      name: 'outlet',
      type: 'text',
      required: true,
      admin: { description: 'Where it was published.' },
    },
    { name: 'externalUrl', type: 'text', required: true },
  ]),
}

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'News item', plural: 'News' },
  ...contentCollectionDefaults('Commentary'),
  defaultSort: '-publishedAt',
  fields: articleFields([richText('body', true)]),
}

export const People: CollectionConfig = {
  slug: 'people',
  labels: { singular: 'Person', plural: 'People' },
  ...contentCollectionDefaults('Directory'),
  admin: {
    ...contentCollectionDefaults('Directory').admin,
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'provenance', '_status'],
  },
  defaultSort: 'name',
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    { name: 'role', type: 'text', admin: { description: 'Position or role title.' } },
    { name: 'organisation', type: 'relationship', relationTo: 'organisations' },
    {
      name: 'affiliation',
      type: 'select',
      required: true,
      options: [
        { label: 'Observatory team', value: 'team' },
        { label: 'Partner', value: 'partner' },
        { label: 'Expert', value: 'expert' },
        { label: 'Contributor', value: 'contributor' },
        { label: 'Advisory', value: 'advisory' },
      ],
    },
    { name: 'summary', type: 'textarea', required: true, maxLength: 400 },
    richText('bio'),
    { name: 'expertise', type: 'relationship', relationTo: 'topics', hasMany: true },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'links',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    countriesField,
    enablersField,
    tagsField,
    publishedAtField,
    provenanceField,
    seoGroup,
  ],
}

export const Organisations: CollectionConfig = {
  slug: 'organisations',
  labels: { singular: 'Organisation', plural: 'Organisations' },
  ...contentCollectionDefaults('Directory'),
  admin: {
    ...contentCollectionDefaults('Directory').admin,
    useAsTitle: 'name',
    defaultColumns: ['name', 'stakeholderType', 'provenance', '_status'],
  },
  defaultSort: 'name',
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    { name: 'acronym', type: 'text' },
    {
      name: 'stakeholderType',
      type: 'relationship',
      relationTo: 'stakeholder-types',
      required: true,
      index: true,
    },
    {
      name: 'observatoryRole',
      type: 'select',
      options: [
        { label: 'Lead organisation', value: 'lead' },
        { label: 'Consortium partner', value: 'partner' },
        { label: 'Funder', value: 'funder' },
        { label: 'Network member', value: 'member' },
        { label: 'Profiled organisation', value: 'profiled' },
      ],
      defaultValue: 'profiled',
    },
    { name: 'summary', type: 'textarea', required: true, maxLength: 400 },
    richText('description'),
    { name: 'website', type: 'text' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    countriesField,
    topicsField,
    enablersField,
    tagsField,
    publishedAtField,
    provenanceField,
    seoGroup,
  ],
}

export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Event', plural: 'Events' },
  ...contentCollectionDefaults('Engage'),
  defaultSort: '-startDate',
  admin: {
    ...contentCollectionDefaults('Engage').admin,
    defaultColumns: ['title', 'startDate', 'format', '_status'],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    summaryField,
    richText('description'),
    {
      type: 'row',
      fields: [
        { name: 'startDate', type: 'date', required: true, index: true },
        { name: 'endDate', type: 'date' },
        { name: 'timezone', type: 'text', defaultValue: 'Asia/Colombo' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'format',
          type: 'select',
          required: true,
          options: [
            { label: 'Online', value: 'online' },
            { label: 'In person', value: 'in-person' },
            { label: 'Hybrid', value: 'hybrid' },
          ],
        },
        {
          name: 'eventType',
          type: 'select',
          options: [
            { label: 'Policy dialogue', value: 'dialogue' },
            { label: 'Webinar', value: 'webinar' },
            { label: 'Workshop', value: 'workshop' },
            { label: 'Convening', value: 'convening' },
            { label: 'Scope-a-thon', value: 'scopeathon' },
            { label: 'Community of Practice', value: 'cop' },
          ],
        },
      ],
    },
    { name: 'venue', type: 'text' },
    {
      name: 'onlineUrl',
      type: 'text',
      // The join link is not public data. It reaches visitors only after registration, or on the event page
      // when the event needs no registration. The REST and GraphQL APIs never expose it to anonymous callers.
      access: { read: ({ req }) => Boolean(req.user) },
      admin: {
        description:
          'Meeting or stream link. Shown after registration, or on the event page when no registration is needed. Never exposed through the public API.',
      },
    },
    {
      name: 'registration',
      type: 'group',
      fields: [
        {
          name: 'mode',
          type: 'select',
          defaultValue: 'none',
          options: [
            { label: 'No registration', value: 'none' },
            { label: 'Register on this site (records exportable)', value: 'form' },
            { label: 'External registration link', value: 'external' },
          ],
        },
        { name: 'externalUrl', type: 'text' },
        { name: 'closesAt', type: 'date' },
        { name: 'capacity', type: 'number' },
      ],
    },
    { name: 'organisations', type: 'relationship', relationTo: 'organisations', hasMany: true },
    { name: 'speakers', type: 'relationship', relationTo: 'people', hasMany: true },
    { name: 'recordingUrl', type: 'text' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    ...relatedFields,
    countriesField,
    topicsField,
    enablersField,
    tagsField,
    publishedAtField,
    provenanceField,
    seoGroup,
  ],
}

export const LearningResources: CollectionConfig = {
  slug: 'learning-resources',
  labels: { singular: 'Learning resource', plural: 'Learning resources' },
  ...contentCollectionDefaults('Engage'),
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    summaryField,
    richText('description'),
    {
      type: 'row',
      fields: [
        {
          name: 'resourceType',
          type: 'select',
          required: true,
          index: true,
          options: [
            { label: 'Course', value: 'course' },
            { label: 'Video', value: 'video' },
            { label: 'Toolkit', value: 'toolkit' },
            { label: 'Guide', value: 'guide' },
            { label: 'Framework', value: 'framework' },
            { label: 'Reading list', value: 'reading-list' },
          ],
        },
        {
          name: 'level',
          type: 'select',
          options: [
            { label: 'Introductory', value: 'introductory' },
            { label: 'Intermediate', value: 'intermediate' },
            { label: 'Advanced', value: 'advanced' },
          ],
        },
        {
          name: 'duration',
          type: 'text',
          admin: { description: 'For example 2 hours or 6 weeks.' },
        },
      ],
    },
    { name: 'provider', type: 'text' },
    { name: 'providerOrganisation', type: 'relationship', relationTo: 'organisations' },
    { name: 'externalUrl', type: 'text' },
    { name: 'file', type: 'upload', relationTo: 'media' },
    { name: 'videoEmbedUrl', type: 'text', admin: { description: 'YouTube or Vimeo page URL.' } },
    { name: 'language', type: 'text', defaultValue: 'English' },
    ...relatedFields,
    countriesField,
    topicsField,
    enablersField,
    raiDimensionsField,
    tagsField,
    publishedAtField,
    provenanceField,
    seoGroup,
  ],
}

export const Opportunities: CollectionConfig = {
  slug: 'opportunities',
  labels: { singular: 'Opportunity', plural: 'Opportunities' },
  ...contentCollectionDefaults('Engage'),
  defaultSort: 'deadline',
  admin: {
    ...contentCollectionDefaults('Engage').admin,
    defaultColumns: ['title', 'opportunityType', 'deadline', '_status'],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    summaryField,
    richText('description'),
    {
      type: 'row',
      fields: [
        {
          name: 'opportunityType',
          type: 'select',
          required: true,
          index: true,
          options: [
            { label: 'Fellowship', value: 'fellowship' },
            { label: 'Grant or funding call', value: 'grant' },
            { label: 'Programme', value: 'programme' },
            { label: 'Call for papers', value: 'call-for-papers' },
            { label: 'Job', value: 'job' },
            { label: 'Competition', value: 'competition' },
            { label: 'Event', value: 'event' },
          ],
        },
        { name: 'deadline', type: 'date', index: true },
        { name: 'rolling', type: 'checkbox', defaultValue: false },
      ],
    },
    { name: 'provider', type: 'text', required: true },
    { name: 'eligibility', type: 'textarea' },
    { name: 'externalUrl', type: 'text', required: true },
    countriesField,
    topicsField,
    enablersField,
    tagsField,
    publishedAtField,
    provenanceField,
    seoGroup,
  ],
}

export const Newsletters: CollectionConfig = {
  slug: 'newsletters',
  labels: { singular: 'Newsletter issue', plural: 'Newsletter issues' },
  ...contentCollectionDefaults('Engage'),
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    { name: 'issueNumber', type: 'number', required: true },
    summaryField,
    richText('body'),
    { name: 'pdf', type: 'upload', relationTo: 'media' },
    {
      name: 'externalUrl',
      type: 'text',
      admin: { description: 'Web version hosted by the email provider, if any.' },
    },
    {
      name: 'featured',
      type: 'relationship',
      relationTo: ['use-cases', 'publications', 'events', 'posts', 'opportunities'],
      hasMany: true,
    },
    publishedAtField,
    provenanceField,
    seoGroup,
  ],
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  ...contentCollectionDefaults('Site'),
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    { name: 'summary', type: 'textarea', maxLength: 400 },
    richText('body', true),
    publishedAtField,
    provenanceField,
    seoGroup,
  ],
}
