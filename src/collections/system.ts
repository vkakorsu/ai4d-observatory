import type { CollectionConfig } from 'payload'
import { adminFieldOnly, isAdmin, isEditor, isLoggedIn, staffCanWrite } from '@/access/roles'

/*
 * Users with roles (Section 3.1.3 c, 3.1.10 e), media with gating (Section 3.1.2),
 * and the records that sign-ups produce (Section 2.1, exportable as CSV).
 */

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Administration',
    defaultColumns: ['email', 'name', 'role'],
  },
  auth: {
    tokenExpiration: 60 * 60 * 8,
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
  },
  access: {
    read: isLoggedIn,
    create: isAdmin,
    update: ({ req }) => {
      const user = req.user as { role?: string; id?: string | number } | null
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
    delete: isAdmin,
    admin: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'contributor',
      saveToJWT: true,
      access: { update: adminFieldOnly, create: adminFieldOnly },
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Contributor', value: 'contributor' },
      ],
      admin: {
        description:
          'Administrator manages users and settings. Editor publishes and archives content and exports records. Contributor drafts content.',
      },
    },
  ],
}

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Administration',
    defaultColumns: ['filename', 'alt', 'access', 'updatedAt'],
    description: 'Images, PDFs and other files. Gated files require an email address before download.',
  },
  access: {
    /**
     * Metadata is public so relationships populate. The file bytes of gated items are not.
     * Payload passes `isReadingStaticFile` when serving /api/media/file/:filename, and the returned
     * query restricts anonymous requests to open files. Gated files are served only by /download/:id
     * after a valid signed token.
     */
    read: ({ req, isReadingStaticFile }) => {
      if (req.user) return true
      if (isReadingStaticFile) return { access: { equals: 'open' } }
      return true
    },
    create: staffCanWrite,
    update: staffCanWrite,
    delete: isEditor,
  },
  upload: {
    staticDir: 'media',
    mimeTypes: [
      'image/*',
      'application/pdf',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip',
      'application/json',
    ],
    imageSizes: [
      { name: 'thumb', width: 320, height: 200, position: 'centre' },
      { name: 'card', width: 720, height: undefined },
      { name: 'wide', width: 1440, height: undefined },
    ],
    adminThumbnail: 'thumb',
    focalPoint: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Describe the image for screen reader users. For documents, use the document title.' },
    },
    { name: 'caption', type: 'text' },
    { name: 'credit', type: 'text' },
    {
      name: 'access',
      type: 'select',
      required: true,
      defaultValue: 'open',
      options: [
        { label: 'Open download', value: 'open' },
        { label: 'Email-gated download', value: 'gated' },
      ],
      admin: {
        description:
          'Gated files ask for an email address and a consent tick before the file is released. Requests are stored in Download requests and can be exported.',
      },
    },
    {
      name: 'gatePurpose',
      type: 'textarea',
      defaultValue:
        'We ask for your email address so we can tell you when this resource is updated and to understand who uses the Observatory. We do not share it.',
      admin: {
        condition: (data) => data?.access === 'gated',
        description: 'Purpose statement shown next to the form (Section 3.1.6 c).',
      },
    },
  ],
}

export const DownloadRequests: CollectionConfig = {
  slug: 'download-requests',
  labels: { singular: 'Download request', plural: 'Download requests' },
  admin: {
    group: 'Records',
    useAsTitle: 'email',
    defaultColumns: ['email', 'file', 'createdAt', 'organisation', 'country'],
    description: 'Records created by the email-gated download form. Export as CSV from the list view.',
  },
  access: {
    read: isEditor,
    create: () => false,
    update: () => false,
    delete: isAdmin,
  },
  fields: [
    { name: 'email', type: 'email', required: true, index: true },
    { name: 'file', type: 'relationship', relationTo: 'media', required: true },
    { name: 'resourceTitle', type: 'text' },
    { name: 'resourceUrl', type: 'text' },
    { name: 'organisation', type: 'text' },
    { name: 'country', type: 'text' },
    { name: 'consentText', type: 'textarea', required: true },
    { name: 'consentVersion', type: 'text', required: true },
    { name: 'ipHash', type: 'text', admin: { description: 'One-way hash for abuse detection. Not reversible.' } },
    { name: 'userAgent', type: 'text' },
  ],
  timestamps: true,
}

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: { singular: 'Subscriber', plural: 'Subscribers' },
  admin: {
    group: 'Records',
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'provider', 'createdAt'],
    description: 'Newsletter subscriptions. Also synced to the configured email provider. Export as CSV from the list view.',
  },
  access: {
    read: isEditor,
    create: () => false,
    update: isEditor,
    delete: isAdmin,
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true, index: true },
    { name: 'name', type: 'text' },
    { name: 'organisation', type: 'text' },
    { name: 'interests', type: 'relationship', relationTo: 'topics', hasMany: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending confirmation', value: 'pending' },
        { label: 'Subscribed', value: 'subscribed' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
      ],
    },
    { name: 'provider', type: 'text', admin: { description: 'Which provider adapter handled this subscription.' } },
    { name: 'providerId', type: 'text' },
    { name: 'consentText', type: 'textarea', required: true },
    { name: 'consentVersion', type: 'text', required: true },
    { name: 'source', type: 'text', admin: { description: 'Page the form was submitted from.' } },
  ],
  timestamps: true,
}

export const EventRegistrations: CollectionConfig = {
  slug: 'event-registrations',
  labels: { singular: 'Event registration', plural: 'Event registrations' },
  admin: {
    group: 'Records',
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'event', 'createdAt'],
    description: 'Registrations submitted through on-site event forms. Export as CSV from the list view.',
  },
  access: {
    read: isEditor,
    create: () => false,
    update: isEditor,
    delete: isAdmin,
  },
  fields: [
    { name: 'event', type: 'relationship', relationTo: 'events', required: true, index: true },
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true, index: true },
    { name: 'organisation', type: 'text' },
    { name: 'country', type: 'text' },
    { name: 'stakeholderType', type: 'relationship', relationTo: 'stakeholder-types' },
    { name: 'accessibilityNeeds', type: 'textarea' },
    { name: 'consentText', type: 'textarea', required: true },
    { name: 'consentVersion', type: 'text', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'registered',
      options: [
        { label: 'Registered', value: 'registered' },
        { label: 'Waitlisted', value: 'waitlisted' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
  ],
  timestamps: true,
}
