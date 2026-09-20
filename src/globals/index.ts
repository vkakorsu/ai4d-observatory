import type { GlobalConfig } from 'payload'
import { isAdmin, isEditor } from '@/access/roles'

/** Site-wide settings editable without a developer. */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { group: 'Site' },
  access: { read: () => true, update: isAdmin },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identity',
          fields: [
            { name: 'siteName', type: 'text', required: true, defaultValue: 'Asia AI4D Observatory' },
            {
              name: 'tagline',
              type: 'text',
              defaultValue: 'A policy and innovation network on responsible artificial intelligence',
            },
            {
              name: 'description',
              type: 'textarea',
              defaultValue:
                'Evidence, use cases, data and community for responsible AI in South and Southeast Asia.',
            },
            { name: 'contactEmail', type: 'email' },
            {
              name: 'social',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'url', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Partners and funders',
          fields: [
            {
              name: 'funders',
              type: 'array',
              admin: { description: 'Shown in the footer. Logos pending Client-supplied assets.' },
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'url', type: 'text' },
                { name: 'logo', type: 'upload', relationTo: 'media' },
              ],
            },
            {
              name: 'partners',
              type: 'array',
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'url', type: 'text' },
                { name: 'logo', type: 'upload', relationTo: 'media' },
              ],
            },
            {
              name: 'programmeNote',
              type: 'textarea',
              defaultValue:
                'The Asia AI4D Observatory is led by LIRNEasia with East-West Management Institute and JustJobs Network, with EngageMedia as a project partner. It is part of the Artificial Intelligence for Development (AI4D) programme, a partnership between IDRC and the UK Foreign, Commonwealth and Development Office.',
            },
          ],
        },
        {
          label: 'Prototype and notices',
          fields: [
            {
              name: 'showPrototypeNotices',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description:
                  'Show "sample content" and "pending confirmation" labels. Turn off when real content is loaded.',
              },
            },
            {
              name: 'announcement',
              type: 'group',
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: false },
                { name: 'text', type: 'text' },
                { name: 'url', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Privacy',
          fields: [
            {
              name: 'consentVersion',
              type: 'text',
              required: true,
              defaultValue: '2026-09-v1',
              admin: { description: 'Change when consent wording changes. Stored with every record.' },
            },
            {
              name: 'newsletterConsentText',
              type: 'textarea',
              required: true,
              defaultValue:
                'I agree to receive the Asia AI4D Observatory newsletter and occasional updates about its events and resources. I can unsubscribe at any time.',
            },
            {
              name: 'downloadConsentText',
              type: 'textarea',
              required: true,
              defaultValue:
                'I agree that the Observatory may store my email address to send me updates about this resource and to report anonymised usage to its funders.',
            },
            {
              name: 'registrationConsentText',
              type: 'textarea',
              required: true,
              defaultValue:
                'I agree that the Observatory may store my details to manage my participation in this event and contact me about it.',
            },
            {
              name: 'retentionMonths',
              type: 'number',
              defaultValue: 24,
              admin: { description: 'How long download and registration records are kept.' },
            },
          ],
        },
      ],
    },
  ],
}

/** Home page composition, so editors choose what leads without touching code. */
export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home page',
  admin: { group: 'Site' },
  access: { read: () => true, update: isEditor },
  fields: [
    { name: 'headline', type: 'text', required: true, defaultValue: 'Evidence for responsible AI in Asia' },
    {
      name: 'intro',
      type: 'textarea',
      required: true,
      defaultValue:
        'The Asia AI4D Observatory maps how South and Southeast Asia design, govern and scale AI that is safe, rights-based, sustainable, inclusive and appropriate to context. Find use cases, mapping studies, data, people and opportunities in one place.',
    },
    {
      name: 'featured',
      type: 'relationship',
      relationTo: ['use-cases', 'publications', 'datasets', 'events', 'posts'],
      hasMany: true,
      maxRows: 4,
      admin: { description: 'Up to four items for the lead positions.' },
    },
    {
      name: 'featuredIndicator',
      type: 'relationship',
      relationTo: 'indicators',
      admin: { description: 'Indicator shown in the home page map.' },
    },
    {
      name: 'audienceEntries',
      type: 'array',
      admin: {
        description:
          'Entry points by audience (Section 2.2 of the RFP). Order and set are pending confirmation in requirements refinement.',
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'description', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}
