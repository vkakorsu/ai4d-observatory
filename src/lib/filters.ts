import { publicationTypes } from '@/collections/content'
import type { FilterDef } from './queries'
import { standardFilters } from './site'

/** Filter definitions per listing. Kept in one file so the tests and the pages share them. */

export const useCaseFilters: FilterDef[] = [
  ...standardFilters({ dimensions: true }),
  {
    param: 'stage',
    field: 'stage',
    kind: 'select',
    label: 'Stage',
    options: [
      { value: 'concept', label: 'Concept' },
      { value: 'pilot', label: 'Pilot' },
      { value: 'deployed', label: 'Deployed' },
      { value: 'scaled', label: 'Scaled' },
      { value: 'discontinued', label: 'Discontinued' },
    ],
  },
]

export const publicationFilters: FilterDef[] = [
  {
    param: 'type',
    field: 'type',
    kind: 'select',
    label: 'Publication type',
    options: publicationTypes.map((t) => ({ value: t.value, label: t.label })),
  },
  ...standardFilters({ dimensions: true }),
]

export const datasetFilters: FilterDef[] = [
  ...standardFilters(),
  {
    param: 'licence',
    field: 'licence',
    kind: 'select',
    label: 'Licence',
    options: [
      { value: 'cc-by-4', label: 'CC BY 4.0' },
      { value: 'cc-by-sa-4', label: 'CC BY-SA 4.0' },
      { value: 'cc0', label: 'CC0' },
      { value: 'odc', label: 'Open Data Commons' },
      { value: 'restricted', label: 'Restricted' },
      { value: 'other', label: 'Other' },
    ],
  },
]

export const eventFilters: FilterDef[] = [
  {
    param: 'format',
    field: 'format',
    kind: 'select',
    label: 'Format',
    options: [
      { value: 'online', label: 'Online' },
      { value: 'in-person', label: 'In person' },
      { value: 'hybrid', label: 'Hybrid' },
    ],
  },
  {
    param: 'kind',
    field: 'eventType',
    kind: 'select',
    label: 'Event type',
    options: [
      { value: 'dialogue', label: 'Policy dialogue' },
      { value: 'webinar', label: 'Webinar' },
      { value: 'workshop', label: 'Workshop' },
      { value: 'convening', label: 'Convening' },
      { value: 'scopeathon', label: 'Scope-a-thon' },
      { value: 'cop', label: 'Community of Practice' },
    ],
  },
  ...standardFilters(),
]

export const learningFilters: FilterDef[] = [
  {
    param: 'type',
    field: 'resourceType',
    kind: 'select',
    label: 'Resource type',
    options: [
      { value: 'course', label: 'Course' },
      { value: 'video', label: 'Video' },
      { value: 'toolkit', label: 'Toolkit' },
      { value: 'guide', label: 'Guide' },
      { value: 'framework', label: 'Framework' },
      { value: 'reading-list', label: 'Reading list' },
    ],
  },
  {
    param: 'level',
    field: 'level',
    kind: 'select',
    label: 'Level',
    options: [
      { value: 'introductory', label: 'Introductory' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' },
    ],
  },
  ...standardFilters({ dimensions: true }),
]

export const opportunityFilters: FilterDef[] = [
  {
    param: 'type',
    field: 'opportunityType',
    kind: 'select',
    label: 'Opportunity type',
    options: [
      { value: 'fellowship', label: 'Fellowship' },
      { value: 'grant', label: 'Grant or funding call' },
      { value: 'programme', label: 'Programme' },
      { value: 'call-for-papers', label: 'Call for papers' },
      { value: 'job', label: 'Job' },
      { value: 'competition', label: 'Competition' },
      { value: 'event', label: 'Event' },
    ],
  },
  ...standardFilters(),
]

export const commentaryFilters: FilterDef[] = standardFilters()

export const peopleFilters: FilterDef[] = [
  {
    param: 'affiliation',
    field: 'affiliation',
    kind: 'select',
    label: 'Affiliation',
    options: [
      { value: 'team', label: 'Observatory team' },
      { value: 'partner', label: 'Partner' },
      { value: 'expert', label: 'Expert' },
      { value: 'contributor', label: 'Contributor' },
      { value: 'advisory', label: 'Advisory' },
    ],
  },
  { param: 'country', field: 'countries', kind: 'relationship', label: 'Country', multiple: true },
  { param: 'topic', field: 'expertise', kind: 'relationship', label: 'Expertise', multiple: true },
  { param: 'enabler', field: 'enablers', kind: 'relationship', label: 'Ecosystem enabler', multiple: true },
]

export const organisationFilters: FilterDef[] = [
  { param: 'stakeholder', field: 'stakeholderType', kind: 'relationship', label: 'Stakeholder type', multiple: true },
  ...standardFilters(),
]
