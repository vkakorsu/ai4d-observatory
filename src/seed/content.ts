import { paragraphs, richText } from '@/lib/lexical'

/*
 * Representative sample content for the prototype.
 *
 * Rules applied here (see README and PROTOTYPE_SPEC):
 * - Organisations marked `public` are real and described only with facts from their public pages.
 * - Everything marked `sample` is illustrative. Sample organisations and people are fictional placeholders.
 *   Titles, countries, sectors and enablers follow the Observatory's public description so the structure can be judged.
 * - Nothing here is presented as an Observatory output. The interface labels every sample item while
 *   `showPrototypeNotices` is on.
 */

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString()
const daysAhead = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString()

export type Ref = string // slug of a related record in this seed

export const organisations = [
  // Public record
  {
    slug: 'lirneasia',
    name: 'LIRNEasia',
    stakeholderType: 'university-or-research-institution',
    observatoryRole: 'lead',
    summary:
      'A regional digital policy and regulation think tank based in Colombo, Sri Lanka, and lead organisation of the Asia AI4D Observatory.',
    description: paragraphs(
      'LIRNEasia is a pro-poor, pro-market think tank working on digital policy and regulation across the Asia Pacific. It leads the Asia AI4D Observatory, a three-year initiative launched in 2026 as part of the AI4D programme.',
      'Public record. Description drawn from lirneasia.net. To be replaced by the Client’s approved text.',
    ),
    website: 'https://lirneasia.net',
    countries: ['sri-lanka'],
    provenance: 'public',
  },
  {
    slug: 'east-west-management-institute',
    name: 'East-West Management Institute',
    acronym: 'EWMI',
    stakeholderType: 'civil-society-or-ngo',
    observatoryRole: 'partner',
    summary:
      'A non-profit organisation working on governance, rule of law and civil society strengthening, and a partner in the Asia AI4D Observatory.',
    description: paragraphs(
      'Public record. Named as a partner in LIRNEasia’s announcement of the Observatory (1 July 2026). Description to be supplied by the Client.',
    ),
    website: 'https://ewmi.org',
    provenance: 'public',
  },
  {
    slug: 'justjobs-network',
    name: 'JustJobs Network',
    stakeholderType: 'university-or-research-institution',
    observatoryRole: 'partner',
    summary:
      'A research organisation focused on employment and the future of work, and a partner in the Asia AI4D Observatory.',
    description: paragraphs(
      'Public record. Named as a partner in LIRNEasia’s announcement of the Observatory (1 July 2026). Description to be supplied by the Client.',
    ),
    website: 'https://justjobsnetwork.org',
    provenance: 'public',
  },
  {
    slug: 'engagemedia',
    name: 'EngageMedia',
    stakeholderType: 'civil-society-or-ngo',
    observatoryRole: 'partner',
    summary:
      'A non-profit working on digital rights, open technology and video for change in the Asia Pacific. Listed as a participating organisation on the AI4D project page.',
    description: paragraphs(
      'Public record. Listed on ai4d.ai for this project. Not named in LIRNEasia’s 1 July 2026 announcement. Role to be confirmed by the Client.',
    ),
    website: 'https://engagemedia.org',
    provenance: 'public',
  },
  {
    slug: 'idrc',
    name: 'International Development Research Centre',
    acronym: 'IDRC',
    stakeholderType: 'funder',
    observatoryRole: 'funder',
    summary:
      'Canada’s international development research funder and co-funder of the AI4D programme.',
    description: paragraphs(
      'Public record. IDRC project 110850. Description and logo usage rules to be supplied by the Client.',
    ),
    website: 'https://idrc-crdi.ca',
    provenance: 'public',
  },
  {
    slug: 'fcdo',
    name: 'Foreign, Commonwealth and Development Office',
    acronym: 'FCDO',
    stakeholderType: 'funder',
    observatoryRole: 'funder',
    summary:
      'The United Kingdom’s foreign affairs and development ministry and co-funder of the AI4D programme.',
    description: paragraphs(
      'Public record. Description and logo usage rules to be supplied by the Client.',
    ),
    website: 'https://www.gov.uk/government/organisations/foreign-commonwealth-development-office',
    provenance: 'public',
  },
  // Sample (fictional placeholders)
  {
    slug: 'regional-digital-health-research-centre',
    name: 'Regional Digital Health Research Centre',
    acronym: 'RDHRC',
    stakeholderType: 'university-or-research-institution',
    summary:
      'Sample organisation. A university-based centre studying digital and AI tools in primary health care.',
    description: paragraphs(
      'Sample profile pending client content. Organisation profiles in the directory carry a stakeholder type, countries, topics and enablers, and list the use cases, publications and events they are connected to.',
    ),
    countries: ['sri-lanka', 'india'],
    topics: ['health'],
    enablers: ['data', 'skills-and-labour'],
    provenance: 'sample',
  },
  {
    slug: 'national-ai-strategy-office',
    name: 'National AI Strategy Office',
    stakeholderType: 'government',
    summary:
      'Sample organisation. A government unit coordinating a national AI strategy and its responsible AI guidelines.',
    description: paragraphs('Sample profile pending client content.'),
    countries: ['indonesia'],
    topics: ['public-services'],
    enablers: ['policy-and-regulation'],
    provenance: 'sample',
  },
  {
    slug: 'farmers-data-cooperative',
    name: 'Farmers’ Data Cooperative',
    stakeholderType: 'civil-society-or-ngo',
    summary:
      'Sample organisation. A member-owned cooperative that governs how smallholder data is shared with agricultural advisory services.',
    description: paragraphs('Sample profile pending client content.'),
    countries: ['bangladesh', 'nepal'],
    topics: ['agriculture'],
    enablers: ['data'],
    provenance: 'sample',
  },
  {
    slug: 'mekong-language-technology-lab',
    name: 'Mekong Language Technology Lab',
    stakeholderType: 'private-sector',
    summary:
      'Sample organisation. A start-up building speech and text models for Khmer, Lao and minority languages of the Mekong region.',
    description: paragraphs('Sample profile pending client content.'),
    countries: ['cambodia', 'lao-pdr', 'viet-nam'],
    topics: ['language-and-information'],
    enablers: ['algorithms', 'compute'],
    provenance: 'sample',
  },
  {
    slug: 'asia-disability-and-technology-network',
    name: 'Asia Disability and Technology Network',
    stakeholderType: 'civil-society-or-ngo',
    summary:
      'Sample organisation. A regional network of organisations of persons with disabilities working on accessible and inclusive AI.',
    description: paragraphs('Sample profile pending client content.'),
    countries: ['philippines', 'sri-lanka', 'malaysia'],
    topics: ['public-services', 'education'],
    enablers: ['skills-and-labour', 'policy-and-regulation'],
    tags: ['disability'],
    provenance: 'sample',
  },
  {
    slug: 'coastal-resilience-institute',
    name: 'Coastal Resilience Institute',
    stakeholderType: 'university-or-research-institution',
    summary:
      'Sample organisation. A research institute working on early warning and climate adaptation for coastal and island communities.',
    description: paragraphs('Sample profile pending client content.'),
    countries: ['maldives', 'philippines', 'bangladesh'],
    topics: ['climate-resilience'],
    enablers: ['data', 'compute'],
    tags: ['environmental-sustainability', 'small-states'],
    provenance: 'sample',
  },
  {
    slug: 'southeast-asia-fintech-association',
    name: 'Southeast Asia Fintech Association',
    stakeholderType: 'private-sector',
    summary:
      'Sample organisation. An industry association of financial technology companies with a working group on responsible credit scoring.',
    description: paragraphs('Sample profile pending client content.'),
    countries: ['indonesia', 'philippines', 'viet-nam', 'thailand'],
    topics: ['financial-inclusion'],
    enablers: ['innovation-and-investment-climate', 'policy-and-regulation'],
    provenance: 'sample',
  },
  {
    slug: 'regional-development-partners-forum',
    name: 'Regional Development Partners Forum',
    stakeholderType: 'regional-or-international-body',
    summary:
      'Sample organisation. A coordination forum for development partners funding AI for development work in the region.',
    description: paragraphs('Sample profile pending client content.'),
    topics: ['public-services'],
    enablers: ['innovation-and-investment-climate'],
    provenance: 'sample',
  },
] as const

export const people = [
  {
    slug: 'observatory-research-lead',
    name: 'Nadeesha Wickramasinghe',
    role: 'Research Lead, Asia AI4D Observatory',
    organisation: 'lirneasia',
    affiliation: 'team',
    summary:
      'Sample profile. Leads the Observatory’s benchmarking and ecosystem mapping workstream.',
    bio: paragraphs(
      'Sample profile pending client content. A person record carries a role, an organisation, an affiliation to the Observatory, areas of expertise, countries and links. The page lists every publication, use case and event the person is connected to.',
    ),
    expertise: ['justice-and-rights', 'public-services'],
    countries: ['sri-lanka'],
    provenance: 'sample',
  },
  {
    slug: 'observatory-data-lead',
    name: 'Arjun Mehta',
    role: 'Data and Visualisation Lead, Asia AI4D Observatory',
    organisation: 'lirneasia',
    affiliation: 'team',
    summary: 'Sample profile. Responsible for the indicator framework and the regional data views.',
    bio: paragraphs('Sample profile pending client content.'),
    expertise: ['climate-resilience', 'health'],
    countries: ['india'],
    provenance: 'sample',
  },
  {
    slug: 'observatory-engagement-lead',
    name: 'Siti Rahmah',
    role: 'Community of Practice Coordinator, Asia AI4D Observatory',
    organisation: 'lirneasia',
    affiliation: 'team',
    summary:
      'Sample profile. Convenes the regional Community of Practice and coordinates scope-a-thons.',
    bio: paragraphs('Sample profile pending client content.'),
    expertise: ['future-of-work', 'education'],
    countries: ['malaysia'],
    provenance: 'sample',
  },
  {
    slug: 'partner-labour-researcher',
    name: 'Rafael Dela Cruz',
    role: 'Senior Researcher, JustJobs Network',
    organisation: 'justjobs-network',
    affiliation: 'partner',
    summary: 'Sample profile. Works on AI and the future of work across Southeast Asia.',
    bio: paragraphs('Sample profile pending client content.'),
    expertise: ['future-of-work'],
    countries: ['philippines'],
    provenance: 'sample',
  },
  {
    slug: 'partner-governance-adviser',
    name: 'Tashi Dorji',
    role: 'Governance Adviser, East-West Management Institute',
    organisation: 'east-west-management-institute',
    affiliation: 'partner',
    summary: 'Sample profile. Advises on rights-based approaches to AI in public administration.',
    bio: paragraphs('Sample profile pending client content.'),
    expertise: ['justice-and-rights', 'public-services'],
    countries: ['bhutan', 'nepal'],
    provenance: 'sample',
  },
  {
    slug: 'expert-digital-health',
    name: 'Dr Priya Nandakumar',
    role: 'Director, Regional Digital Health Research Centre',
    organisation: 'regional-digital-health-research-centre',
    affiliation: 'expert',
    summary: 'Sample profile. Clinician and researcher on AI triage tools in primary care.',
    bio: paragraphs('Sample profile pending client content.'),
    expertise: ['health'],
    countries: ['india', 'sri-lanka'],
    provenance: 'sample',
  },
  {
    slug: 'expert-language-technology',
    name: 'Sokha Chan',
    role: 'Founder, Mekong Language Technology Lab',
    organisation: 'mekong-language-technology-lab',
    affiliation: 'expert',
    summary: 'Sample profile. Builds speech recognition for Khmer and minority languages.',
    bio: paragraphs('Sample profile pending client content.'),
    expertise: ['language-and-information'],
    countries: ['cambodia'],
    provenance: 'sample',
  },
  {
    slug: 'expert-disability-inclusion',
    name: 'Maria Santos-Reyes',
    role: 'Coordinator, Asia Disability and Technology Network',
    organisation: 'asia-disability-and-technology-network',
    affiliation: 'expert',
    summary:
      'Sample profile. Advocates for accessible AI and leads participatory design with organisations of persons with disabilities.',
    bio: paragraphs('Sample profile pending client content.'),
    expertise: ['public-services', 'education'],
    countries: ['philippines'],
    tags: ['disability'],
    provenance: 'sample',
  },
  {
    slug: 'advisory-member',
    name: 'Prof. Nguyen Thi Lan',
    role: 'Advisory Group Member',
    affiliation: 'advisory',
    summary:
      'Sample profile. Economist working on AI investment and innovation policy in Viet Nam.',
    bio: paragraphs('Sample profile pending client content.'),
    expertise: ['financial-inclusion', 'future-of-work'],
    countries: ['viet-nam'],
    provenance: 'sample',
  },
] as const

export const useCases = [
  {
    slug: 'ai-triage-support-primary-care-clinics',
    title: 'AI triage support in rural primary care clinics',
    summary:
      'A decision-support tool that helps nurses in rural clinics prioritise patients, designed with clinicians and evaluated for safety before deployment.',
    stage: 'pilot',
    yearStarted: 2024,
    problem:
      'Rural clinics see high patient volumes with few clinicians. Waiting times and missed urgent cases are common.',
    responsibleAiPractices:
      'Clinician-in-the-loop design. Model outputs are advisory. Prospective safety evaluation before pilot. Patient data stays on the clinic server.',
    evidenceOfImpact:
      'Pilot evaluation under way in twelve clinics. Baseline waiting time and referral data collected. Results expected in the second year.',
    organisations: ['regional-digital-health-research-centre'],
    people: ['expert-digital-health'],
    countries: ['sri-lanka', 'india'],
    topics: ['health'],
    raiDimensions: ['safe', 'context-appropriate'],
    enablers: ['data', 'skills-and-labour'],
    links: [{ label: 'Project page (sample)', url: 'https://example.org/triage' }],
    publishedAt: daysAgo(12),
    related: {
      publications: ['mapping-study-data-enabler'],
      datasets: ['regional-health-facility-ai-readiness'],
    },
  },
  {
    slug: 'khmer-speech-recognition-agricultural-hotline',
    title: 'Khmer speech recognition for an agricultural advice hotline',
    summary:
      'An open speech model for Khmer that lets farmers ask questions by phone and receive advice in their own language.',
    stage: 'deployed',
    yearStarted: 2023,
    problem:
      'Farmers with low literacy could not use text-based advisory services. Existing speech models did not support Khmer well.',
    responsibleAiPractices:
      'Model and training data released under an open licence. Consent recorded for every voice contribution. Dialect coverage tested with farmer groups.',
    evidenceOfImpact:
      'Handles about 4,000 calls a month. Word error rate reduced from 38 percent to 14 percent over two model versions.',
    organisations: ['mekong-language-technology-lab'],
    people: ['expert-language-technology'],
    countries: ['cambodia'],
    topics: ['agriculture', 'language-and-information'],
    raiDimensions: ['inclusive', 'context-appropriate'],
    enablers: ['algorithms', 'data'],
    tags: ['low-resource-languages', 'open-source'],
    publishedAt: daysAgo(20),
    related: { publications: ['innovation-brief-low-resource-languages'] },
  },
  {
    slug: 'flood-early-warning-machine-learning-bangladesh',
    title: 'Machine learning flood early warning for river communities',
    summary:
      'Combining satellite rainfall estimates and river gauges to extend flood warnings from two days to five, with alerts in Bangla by SMS and voice.',
    stage: 'scaled',
    yearStarted: 2021,
    problem:
      'Short warning lead times gave households too little time to move livestock and belongings.',
    responsibleAiPractices:
      'Forecast uncertainty communicated in every alert. False alarm rates published monthly. Community feedback loop with union councils.',
    evidenceOfImpact:
      'Independent evaluation found households acting on five-day warnings reported lower asset losses. Coverage extended to four river basins.',
    organisations: ['coastal-resilience-institute'],
    countries: ['bangladesh'],
    topics: ['climate-resilience'],
    raiDimensions: ['safe', 'inclusive'],
    enablers: ['data', 'compute'],
    tags: ['environmental-sustainability'],
    publishedAt: daysAgo(30),
    related: { datasets: ['regional-ai-indicator-values'] },
  },
  {
    slug: 'sign-language-recognition-public-service-counters',
    title: 'Sign language recognition at public service counters',
    summary:
      'A camera-based interpreter for Filipino Sign Language at government service counters, co-designed with the Deaf community.',
    stage: 'pilot',
    yearStarted: 2025,
    problem:
      'Deaf citizens depend on interpreters who are rarely available at local government offices.',
    responsibleAiPractices:
      'Co-design with Deaf users from the outset. Video is processed on device and not stored. Human interpreter remains available on request.',
    evidenceOfImpact:
      'Pilot in three city halls. User satisfaction surveys and completion rates being collected.',
    organisations: ['asia-disability-and-technology-network'],
    people: ['expert-disability-inclusion'],
    countries: ['philippines'],
    topics: ['public-services'],
    raiDimensions: ['inclusive', 'rights-based'],
    enablers: ['algorithms', 'skills-and-labour'],
    tags: ['disability'],
    publishedAt: daysAgo(8),
  },
  {
    slug: 'alternative-credit-scoring-consent-framework',
    title: 'Alternative credit scoring with a consent and contestability framework',
    summary:
      'A lender consortium adopted shared rules for using mobile and transaction data in credit scoring, including the right to see and contest a score.',
    stage: 'deployed',
    yearStarted: 2022,
    problem:
      'Thin-file borrowers were excluded from credit while opaque scoring created new risks of discrimination.',
    responsibleAiPractices:
      'Explicit consent per data source. Plain-language score explanation. Human review of contested decisions within five days. Annual bias audit published.',
    evidenceOfImpact:
      'Approval rates for first-time borrowers rose. Two bias audits published. Regulator referenced the framework in draft guidance.',
    organisations: ['southeast-asia-fintech-association'],
    countries: ['indonesia', 'philippines'],
    topics: ['financial-inclusion'],
    raiDimensions: ['rights-based', 'safe'],
    enablers: ['policy-and-regulation', 'innovation-and-investment-climate'],
    publishedAt: daysAgo(45),
  },
  {
    slug: 'farmer-owned-data-cooperative-advisory-services',
    title: 'A farmer-owned data cooperative for AI advisory services',
    summary:
      'Smallholders pool field data through a cooperative that licenses it to advisory services on members’ terms.',
    stage: 'pilot',
    yearStarted: 2024,
    problem:
      'Advisory apps collected farm data with little benefit or control returning to farmers.',
    responsibleAiPractices:
      'Members vote on data licences. Revenue shared with contributors. Data minimisation and deletion on exit.',
    evidenceOfImpact:
      'About 6,000 members across two districts. First licensing agreement signed with a weather advisory provider.',
    organisations: ['farmers-data-cooperative'],
    countries: ['bangladesh', 'nepal'],
    topics: ['agriculture'],
    raiDimensions: ['rights-based', 'inclusive'],
    enablers: ['data', 'innovation-and-investment-climate'],
    tags: ['gender'],
    publishedAt: daysAgo(60),
  },
  {
    slug: 'ai-assisted-reading-assessment-multilingual-classrooms',
    title: 'AI-assisted reading assessment in multilingual classrooms',
    summary:
      'A tablet tool that assesses early-grade reading in Nepali and three local languages, giving teachers immediate feedback.',
    stage: 'pilot',
    yearStarted: 2025,
    problem: 'Teachers had no quick way to assess reading in children’s home languages.',
    responsibleAiPractices:
      'Assessment results advisory to teachers. Speech data kept on device. Local language communities involved in data collection and validation.',
    evidenceOfImpact: 'Pilot in 40 schools. Agreement with teacher assessment measured at 0.82.',
    countries: ['nepal'],
    topics: ['education', 'language-and-information'],
    raiDimensions: ['inclusive', 'context-appropriate'],
    enablers: ['algorithms', 'skills-and-labour'],
    tags: ['low-resource-languages', 'indigenous-communities'],
    publishedAt: daysAgo(15),
  },
  {
    slug: 'coral-reef-monitoring-computer-vision-maldives',
    title: 'Computer vision for coral reef monitoring in the Maldives',
    summary:
      'Local dive teams collect imagery that a model classifies for bleaching and cover, replacing weeks of manual annotation.',
    stage: 'deployed',
    yearStarted: 2023,
    problem:
      'Reef monitoring depended on scarce expert annotation and lagged bleaching events by months.',
    responsibleAiPractices:
      'Model accuracy reported by reef type. Data shared openly with the national environment agency. Energy use of training runs logged.',
    evidenceOfImpact: 'Monitoring frequency increased from annual to quarterly at 60 sites.',
    organisations: ['coastal-resilience-institute'],
    countries: ['maldives'],
    topics: ['climate-resilience'],
    raiDimensions: ['sustainable', 'context-appropriate'],
    enablers: ['data', 'compute'],
    tags: ['environmental-sustainability', 'small-states'],
    publishedAt: daysAgo(75),
  },
  {
    slug: 'algorithmic-impact-assessment-social-protection',
    title: 'Algorithmic impact assessment for a social protection targeting system',
    summary:
      'A government agency published an impact assessment and appeals process before using a model to prioritise welfare enrolment.',
    stage: 'deployed',
    yearStarted: 2024,
    problem:
      'Targeting decisions affected household income with no explanation or route to appeal.',
    responsibleAiPractices:
      'Published impact assessment. Human review of every exclusion. Appeals decided within 30 days. Annual audit by an independent body.',
    evidenceOfImpact:
      'Appeal rate 3 percent, with one in four appeals upheld in the first year, feeding model revisions.',
    organisations: ['national-ai-strategy-office'],
    countries: ['indonesia'],
    topics: ['public-services'],
    raiDimensions: ['rights-based', 'safe'],
    enablers: ['policy-and-regulation'],
    publishedAt: daysAgo(90),
  },
  {
    slug: 'platform-worker-scheduling-transparency',
    title: 'Scheduling transparency for platform delivery workers',
    summary:
      'A delivery platform agreed to disclose how its scheduling algorithm allocates work after a worker association study.',
    stage: 'deployed',
    yearStarted: 2025,
    problem:
      'Workers could not tell why their hours or earnings changed, and had no way to challenge allocations.',
    responsibleAiPractices:
      'Published allocation criteria. Monthly earnings reports to workers. Worker association consulted on changes.',
    evidenceOfImpact: 'First disclosure published. Follow-up survey planned.',
    organisations: ['justjobs-network'],
    people: ['partner-labour-researcher'],
    countries: ['viet-nam', 'thailand'],
    topics: ['future-of-work'],
    raiDimensions: ['rights-based'],
    enablers: ['skills-and-labour', 'policy-and-regulation'],
    publishedAt: daysAgo(5),
  },
  {
    slug: 'energy-aware-model-training-university-cluster',
    title: 'Energy-aware model training on a shared university compute cluster',
    summary:
      'A university consortium meters and publishes the energy and water use of AI training jobs and schedules them for lower-carbon hours.',
    stage: 'pilot',
    yearStarted: 2025,
    problem: 'AI research compute was growing with no measurement of its environmental cost.',
    responsibleAiPractices:
      'Per-job energy and water reporting. Carbon-aware scheduling. Public quarterly footprint report.',
    evidenceOfImpact:
      'Baseline year measured. Target of 20 percent reduction in emissions per training hour.',
    countries: ['malaysia', 'singapore'],
    topics: ['education'],
    raiDimensions: ['sustainable'],
    enablers: ['compute'],
    tags: ['environmental-sustainability'],
    publishedAt: daysAgo(25),
  },
  {
    slug: 'misinformation-detection-election-monitoring',
    title: 'Multilingual misinformation detection for election monitoring',
    summary:
      'A civil society coalition used language models to triage reports of election misinformation in five languages for human fact-checkers.',
    stage: 'discontinued',
    yearStarted: 2023,
    problem: 'Fact-checkers were overwhelmed by report volume during election periods.',
    responsibleAiPractices:
      'Model only ranks reports for human review. Published precision and recall by language. Discontinued after the election with a public lessons report.',
    evidenceOfImpact:
      'Reduced median time to fact-check from 26 hours to 9. Lessons report informs the next election cycle.',
    countries: ['sri-lanka', 'pakistan'],
    topics: ['language-and-information', 'justice-and-rights'],
    raiDimensions: ['rights-based', 'context-appropriate'],
    enablers: ['algorithms', 'skills-and-labour'],
    tags: ['low-resource-languages'],
    publishedAt: daysAgo(120),
  },
] as const

export const publications = [
  {
    slug: 'mapping-study-data-enabler',
    title: 'Mapping the data enabler for responsible AI in South and Southeast Asia',
    type: 'mapping-study',
    summary:
      'The first of six mapping studies. Data availability, governance and openness across the region, with country profiles and a regional comparison.',
    abstract: richText([
      {
        p: 'Sample abstract. This mapping study examines the data foundations for responsible AI across the countries covered by the Observatory. It reviews data protection legislation, open data availability, sectoral data ecosystems in health, agriculture and education, and the institutions that govern data sharing.',
      },
      { h: 'Key findings' },
      {
        li: [
          'Data protection laws are in force or adopted in a majority of countries, with enforcement capacity uneven.',
          'Open government data portals exist widely but sectoral datasets relevant to AI for development are sparse.',
          'Data-sharing arrangements for health and agriculture are emerging through cooperatives and public-private agreements.',
        ],
      },
      {
        p: 'The study is one of six planned for the first year of the Observatory, covering data, compute, algorithms, skills and labour, innovation and investment climate, and policy and regulation.',
      },
    ]),
    authors: ['observatory-research-lead', 'observatory-data-lead'],
    organisations: ['lirneasia'],
    file: {
      name: 'mapping-study-data-enabler.pdf',
      gated: true,
      title: 'Mapping the data enabler',
    },
    citation:
      'Wickramasinghe, N. and Mehta, A. (2026). Mapping the data enabler for responsible AI in South and Southeast Asia. Asia AI4D Observatory. Sample citation.',
    pages: 64,
    countries: [
      'sri-lanka',
      'india',
      'bangladesh',
      'indonesia',
      'philippines',
      'viet-nam',
      'nepal',
      'cambodia',
    ],
    topics: ['health', 'agriculture', 'education'],
    enablers: ['data'],
    raiDimensions: ['rights-based'],
    tags: ['benchmarking'],
    publishedAt: daysAgo(10),
    related: {
      useCases: [
        'farmer-owned-data-cooperative-advisory-services',
        'ai-triage-support-primary-care-clinics',
      ],
      datasets: ['regional-ai-indicator-values'],
    },
  },
  {
    slug: 'mapping-study-policy-and-regulation-enabler',
    title:
      'Mapping the policy and regulation enabler. National AI strategies, laws and institutions',
    type: 'mapping-study',
    summary:
      'How countries in the region are governing AI. Strategies, draft and enacted laws, sectoral guidance and the institutions responsible.',
    abstract: paragraphs(
      'Sample abstract. This study compares national AI strategies and regulatory instruments across the region, and maps the institutions that hold responsibility for AI governance.',
    ),
    authors: ['observatory-research-lead', 'partner-governance-adviser'],
    organisations: ['lirneasia', 'east-west-management-institute'],
    file: {
      name: 'mapping-study-policy-regulation.pdf',
      gated: false,
      title: 'Mapping the policy and regulation enabler',
    },
    pages: 58,
    countries: [
      'sri-lanka',
      'india',
      'indonesia',
      'malaysia',
      'singapore',
      'thailand',
      'viet-nam',
      'philippines',
      'pakistan',
      'bangladesh',
    ],
    topics: ['public-services'],
    enablers: ['policy-and-regulation'],
    raiDimensions: ['rights-based', 'safe'],
    tags: ['benchmarking'],
    publishedAt: daysAgo(40),
    related: { useCases: ['algorithmic-impact-assessment-social-protection'] },
  },
  {
    slug: 'benchmarking-ai-indices-asia',
    title: 'Benchmarking the benchmarks. How global AI indices see Asia',
    type: 'comparative-analysis',
    summary:
      'A comparison of how major AI readiness and responsible AI indices score countries in the region, where they agree, where they diverge and what they miss.',
    abstract: paragraphs(
      'Sample abstract. The Observatory’s first benchmarking study compares global indices and identifies gaps relevant to development contexts, including informal economies, low-resource languages and small states.',
    ),
    authors: ['observatory-data-lead'],
    organisations: ['lirneasia'],
    file: {
      name: 'benchmarking-ai-indices.pdf',
      gated: false,
      title: 'Benchmarking the benchmarks',
    },
    pages: 32,
    topics: ['public-services'],
    enablers: ['policy-and-regulation', 'data', 'compute'],
    tags: ['benchmarking', 'small-states'],
    publishedAt: daysAgo(55),
    related: { datasets: ['regional-ai-indicator-values'] },
  },
  {
    slug: 'policy-brief-algorithmic-impact-assessment',
    title: 'Policy brief. Algorithmic impact assessments for public sector AI',
    type: 'policy-brief',
    summary:
      'What an impact assessment should contain, who should conduct it and how it connects to appeal rights. Drawn from three deployments in the region.',
    abstract: paragraphs(
      'Sample abstract. Four pages for policymakers. Recommendations on scope, publication, independent review and appeals.',
    ),
    authors: ['partner-governance-adviser'],
    organisations: ['east-west-management-institute'],
    file: {
      name: 'policy-brief-aia.pdf',
      gated: false,
      title: 'Algorithmic impact assessments for public sector AI',
    },
    pages: 4,
    countries: ['indonesia', 'india', 'philippines'],
    topics: ['public-services', 'justice-and-rights'],
    enablers: ['policy-and-regulation'],
    raiDimensions: ['rights-based', 'safe'],
    publishedAt: daysAgo(18),
    related: { useCases: ['algorithmic-impact-assessment-social-protection'] },
  },
  {
    slug: 'policy-brief-ai-and-platform-work',
    title: 'Policy brief. Algorithmic management and platform work in Southeast Asia',
    type: 'policy-brief',
    summary:
      'Evidence on how scheduling and pay algorithms affect delivery and ride-hailing workers, and options for transparency and worker voice.',
    abstract: paragraphs('Sample abstract.'),
    authors: ['partner-labour-researcher'],
    organisations: ['justjobs-network'],
    file: {
      name: 'policy-brief-platform-work.pdf',
      gated: false,
      title: 'Algorithmic management and platform work',
    },
    pages: 6,
    countries: ['viet-nam', 'thailand', 'indonesia', 'philippines'],
    topics: ['future-of-work'],
    enablers: ['skills-and-labour', 'policy-and-regulation'],
    raiDimensions: ['rights-based'],
    publishedAt: daysAgo(7),
    related: { useCases: ['platform-worker-scheduling-transparency'] },
  },
  {
    slug: 'research-brief-women-in-ai-workforce',
    title: 'Research brief. Women in the AI workforce of South Asia',
    type: 'research-brief',
    summary:
      'Participation, pay and progression of women in AI-related occupations, using labour force survey data from four countries.',
    abstract: paragraphs('Sample abstract.'),
    authors: ['partner-labour-researcher', 'observatory-research-lead'],
    organisations: ['justjobs-network', 'lirneasia'],
    file: {
      name: 'research-brief-women-ai-workforce.pdf',
      gated: true,
      title: 'Women in the AI workforce of South Asia',
    },
    pages: 12,
    countries: ['india', 'bangladesh', 'sri-lanka', 'pakistan'],
    topics: ['future-of-work'],
    enablers: ['skills-and-labour'],
    raiDimensions: ['inclusive'],
    tags: ['gender'],
    publishedAt: daysAgo(33),
  },
  {
    slug: 'innovation-brief-low-resource-languages',
    title: 'Innovation brief. Speech and text AI for low-resource languages of the Mekong',
    type: 'innovation-brief',
    summary:
      'How small teams are building language models for Khmer, Lao and minority languages, what enables them and what holds them back.',
    abstract: paragraphs('Sample abstract.'),
    authors: ['expert-language-technology'],
    organisations: ['mekong-language-technology-lab', 'lirneasia'],
    file: {
      name: 'innovation-brief-mekong-languages.pdf',
      gated: false,
      title: 'Speech and text AI for low-resource languages',
    },
    pages: 8,
    countries: ['cambodia', 'lao-pdr', 'viet-nam'],
    topics: ['language-and-information'],
    enablers: ['algorithms', 'compute', 'data'],
    raiDimensions: ['inclusive', 'context-appropriate'],
    tags: ['low-resource-languages', 'open-source'],
    publishedAt: daysAgo(22),
    related: { useCases: ['khmer-speech-recognition-agricultural-hotline'] },
  },
  {
    slug: 'innovation-brief-inclusive-design-disability',
    title: 'Innovation brief. Designing AI with persons with disabilities',
    type: 'innovation-brief',
    summary:
      'Participatory design practices from four projects and a checklist for teams starting out.',
    abstract: paragraphs('Sample abstract.'),
    authors: ['expert-disability-inclusion'],
    organisations: ['asia-disability-and-technology-network'],
    file: {
      name: 'innovation-brief-disability.pdf',
      gated: false,
      title: 'Designing AI with persons with disabilities',
    },
    pages: 10,
    countries: ['philippines', 'sri-lanka', 'malaysia'],
    topics: ['public-services', 'education'],
    enablers: ['skills-and-labour', 'algorithms'],
    raiDimensions: ['inclusive'],
    tags: ['disability'],
    publishedAt: daysAgo(48),
    related: { useCases: ['sign-language-recognition-public-service-counters'] },
  },
  {
    slug: 'toolkit-responsible-ai-procurement',
    title: 'Toolkit. Responsible AI procurement for public agencies',
    type: 'toolkit',
    summary:
      'Model clauses, evaluation criteria and a due diligence checklist for agencies buying AI systems.',
    abstract: paragraphs('Sample abstract.'),
    authors: ['partner-governance-adviser', 'observatory-research-lead'],
    organisations: ['east-west-management-institute', 'lirneasia'],
    file: {
      name: 'toolkit-procurement.pdf',
      gated: true,
      title: 'Responsible AI procurement toolkit',
    },
    pages: 40,
    topics: ['public-services'],
    enablers: ['policy-and-regulation', 'innovation-and-investment-climate'],
    raiDimensions: ['safe', 'rights-based'],
    publishedAt: daysAgo(65),
  },
  {
    slug: 'annual-progress-report-2026',
    title: 'Asia AI4D Observatory. Year one progress report',
    type: 'annual-report',
    summary:
      'What the Observatory did in its first year. Mapping studies, benchmarking, the Community of Practice and the evaluation framework.',
    abstract: paragraphs('Sample abstract. Placeholder for the first annual progress report.'),
    organisations: ['lirneasia'],
    authorText: 'Asia AI4D Observatory',
    file: { name: 'annual-report-2026.pdf', gated: false, title: 'Year one progress report' },
    pages: 28,
    enablers: [
      'data',
      'compute',
      'algorithms',
      'skills-and-labour',
      'innovation-and-investment-climate',
      'policy-and-regulation',
    ],
    publishedAt: daysAgo(2),
  },
] as const

export const datasets = [
  {
    slug: 'regional-ai-indicator-values',
    title: 'Regional responsible AI indicator values',
    summary:
      'Country by year values for the Observatory’s indicator set. The dataset behind the maps and charts on this site.',
    description: paragraphs(
      'Sample dataset. In production this dataset is exported from the indicator values held in the CMS and published with a versioned CSV and a data dictionary.',
    ),
    source: 'Asia AI4D Observatory',
    methodNotes:
      'Values are illustrative placeholders in the prototype. Production values come from the benchmarking studies and cited public indices, each row carrying its own source.',
    temporalCoverage: '2024 to 2026',
    updateFrequency: 'Annual, with corrections as published',
    licence: 'cc-by-4',
    files: [{ label: 'CSV, all indicators', name: 'regional-indicators.csv', kind: 'csv' }],
    accessLinks: [{ label: 'Browse as maps and tables', url: '/data' }],
    indicators: [
      'ai-policy-status',
      'data-protection-law-status',
      'compute-access-index',
      'open-data-availability',
      'responsible-ai-use-cases-recorded',
      'ai-skills-programmes-recorded',
    ],
    countries: [],
    topics: ['public-services'],
    enablers: [
      'data',
      'compute',
      'algorithms',
      'skills-and-labour',
      'innovation-and-investment-climate',
      'policy-and-regulation',
    ],
    tags: ['benchmarking'],
    publishedAt: daysAgo(14),
  },
  {
    slug: 'regional-health-facility-ai-readiness',
    title: 'Health facility AI readiness survey',
    summary:
      'Survey of 240 primary care facilities on connectivity, devices, data practices and staff readiness for AI tools.',
    description: paragraphs('Sample dataset.'),
    source: 'Regional Digital Health Research Centre',
    methodNotes: 'Facility survey, stratified by district. Anonymised at facility level.',
    temporalCoverage: '2025',
    updateFrequency: 'One-off',
    licence: 'cc-by-sa-4',
    files: [{ label: 'CSV, facility level', name: 'health-facility-readiness.csv', kind: 'csv' }],
    countries: ['sri-lanka', 'india'],
    topics: ['health'],
    enablers: ['data', 'compute', 'skills-and-labour'],
    publishedAt: daysAgo(35),
    related: { useCases: ['ai-triage-support-primary-care-clinics'] },
  },
  {
    slug: 'khmer-speech-corpus',
    title: 'Khmer agricultural speech corpus',
    summary:
      'About 300 hours of consented Khmer speech from farmer hotline calls, transcribed and released for research.',
    description: paragraphs('Sample dataset.'),
    source: 'Mekong Language Technology Lab',
    methodNotes:
      'Consent recorded per contributor. Personal information removed from transcripts. Dialect labels included.',
    temporalCoverage: '2023 to 2025',
    licence: 'cc-by-4',
    accessLinks: [
      { label: 'Request access (sample link)', url: 'https://example.org/khmer-corpus' },
    ],
    countries: ['cambodia'],
    topics: ['agriculture', 'language-and-information'],
    enablers: ['data', 'algorithms'],
    tags: ['low-resource-languages', 'open-source'],
    publishedAt: daysAgo(50),
    related: { useCases: ['khmer-speech-recognition-agricultural-hotline'] },
  },
  {
    slug: 'national-ai-policy-documents-corpus',
    title: 'National AI policy documents corpus',
    summary:
      'Full text of national AI strategies, draft laws and guidelines from the region, with metadata on status and issuing body.',
    description: paragraphs('Sample dataset.'),
    source: 'Asia AI4D Observatory',
    methodNotes: 'Documents collected from official sources. Machine translations flagged as such.',
    temporalCoverage: '2018 to 2026',
    updateFrequency: 'Quarterly',
    licence: 'other',
    accessLinks: [
      { label: 'Browse the corpus (sample link)', url: 'https://example.org/policy-corpus' },
    ],
    indicators: ['ai-policy-status'],
    topics: ['public-services'],
    enablers: ['policy-and-regulation'],
    publishedAt: daysAgo(70),
    related: { publications: ['mapping-study-policy-and-regulation-enabler'] },
  },
] as const

export const indicators = [
  {
    slug: 'ai-policy-status',
    name: 'National AI policy or strategy status',
    definition:
      'Whether a country has a national AI policy or strategy, and how far it has progressed from draft to adoption and implementation.',
    unit: 'status',
    valueType: 'status',
    min: 0,
    max: 3,
    higherIsBetter: true,
    statusLabels: [
      { code: 0, label: 'None' },
      { code: 1, label: 'In development' },
      { code: 2, label: 'Adopted' },
      { code: 3, label: 'Adopted with implementation plan' },
    ],
    enabler: 'policy-and-regulation',
    source: 'Asia AI4D Observatory mapping study (illustrative)',
    methodology: 'Coded from official documents. Illustrative values in the prototype.',
    dataset: 'national-ai-policy-documents-corpus',
    featured: true,
    order: 1,
  },
  {
    slug: 'data-protection-law-status',
    name: 'Data protection law status',
    definition:
      'Whether a comprehensive data protection law exists, and whether it is in force with an operating authority.',
    unit: 'status',
    valueType: 'status',
    min: 0,
    max: 3,
    higherIsBetter: true,
    statusLabels: [
      { code: 0, label: 'None' },
      { code: 1, label: 'Draft' },
      { code: 2, label: 'Enacted' },
      { code: 3, label: 'In force with authority' },
    ],
    enabler: 'data',
    source: 'Asia AI4D Observatory mapping study (illustrative)',
    order: 2,
  },
  {
    slug: 'compute-access-index',
    name: 'Compute access index',
    definition:
      'A composite of data centre capacity, cloud region availability, international bandwidth and research compute access, scaled 0 to 100.',
    unit: 'score 0 to 100',
    valueType: 'number',
    min: 0,
    max: 100,
    higherIsBetter: true,
    enabler: 'compute',
    source: 'Composite of public indices (illustrative)',
    methodology: 'Equal-weighted composite. Illustrative values in the prototype.',
    order: 3,
  },
  {
    slug: 'open-data-availability',
    name: 'Open government data availability',
    definition:
      'Share of a reference list of datasets relevant to AI for development that are published openly with machine-readable formats.',
    unit: 'percent',
    valueType: 'percent',
    min: 0,
    max: 100,
    higherIsBetter: true,
    enabler: 'data',
    source: 'Asia AI4D Observatory mapping study (illustrative)',
    order: 4,
  },
  {
    slug: 'responsible-ai-use-cases-recorded',
    name: 'Responsible AI use cases recorded',
    definition: 'Number of use cases in the Observatory repository that involve the country.',
    unit: 'count',
    valueType: 'number',
    min: 0,
    higherIsBetter: true,
    enabler: 'innovation-and-investment-climate',
    source: 'Asia AI4D Observatory repository',
    methodology:
      'In production this indicator is computed from the repository rather than entered by hand.',
    order: 5,
  },
  {
    slug: 'ai-skills-programmes-recorded',
    name: 'AI skills programmes recorded',
    definition:
      'Number of public or publicly funded AI skills programmes identified in the skills and labour mapping study.',
    unit: 'count',
    valueType: 'number',
    min: 0,
    higherIsBetter: true,
    enabler: 'skills-and-labour',
    source: 'Asia AI4D Observatory mapping study (illustrative)',
    order: 6,
  },
] as const

/** Illustrative values. iso3 -> [year, value] pairs. Missing countries show as "No data". */
export const indicatorValues: Record<string, Record<string, Array<[number, number]>>> = {
  'ai-policy-status': {
    IND: [
      [2024, 2],
      [2025, 3],
      [2026, 3],
    ],
    SGP: [
      [2024, 3],
      [2025, 3],
      [2026, 3],
    ],
    IDN: [
      [2024, 2],
      [2025, 2],
      [2026, 3],
    ],
    MYS: [
      [2024, 2],
      [2025, 2],
      [2026, 2],
    ],
    THA: [
      [2024, 2],
      [2025, 2],
      [2026, 2],
    ],
    VNM: [
      [2024, 2],
      [2025, 2],
      [2026, 3],
    ],
    PHL: [
      [2024, 1],
      [2025, 1],
      [2026, 2],
    ],
    LKA: [
      [2024, 1],
      [2025, 2],
      [2026, 2],
    ],
    BGD: [
      [2024, 1],
      [2025, 1],
      [2026, 2],
    ],
    PAK: [
      [2024, 1],
      [2025, 2],
      [2026, 2],
    ],
    NPL: [
      [2024, 1],
      [2025, 1],
      [2026, 1],
    ],
    KHM: [
      [2024, 0],
      [2025, 1],
      [2026, 1],
    ],
    LAO: [
      [2024, 0],
      [2025, 0],
      [2026, 1],
    ],
    MMR: [
      [2024, 0],
      [2025, 0],
      [2026, 0],
    ],
    BTN: [
      [2024, 0],
      [2025, 1],
      [2026, 1],
    ],
    MDV: [
      [2024, 0],
      [2025, 1],
      [2026, 1],
    ],
    BRN: [
      [2024, 1],
      [2025, 1],
      [2026, 2],
    ],
    TLS: [
      [2024, 0],
      [2025, 0],
      [2026, 0],
    ],
  },
  'data-protection-law-status': {
    IND: [[2026, 2]],
    SGP: [[2026, 3]],
    IDN: [[2026, 3]],
    MYS: [[2026, 3]],
    THA: [[2026, 3]],
    VNM: [[2026, 2]],
    PHL: [[2026, 3]],
    LKA: [[2026, 3]],
    BGD: [[2026, 2]],
    PAK: [[2026, 1]],
    NPL: [[2026, 1]],
    KHM: [[2026, 1]],
    LAO: [[2026, 1]],
    BTN: [[2026, 1]],
    MDV: [[2026, 2]],
    BRN: [[2026, 2]],
  },
  'compute-access-index': {
    SGP: [
      [2023, 74],
      [2024, 83],
      [2025, 92],
    ],
    MYS: [
      [2023, 55],
      [2024, 62],
      [2025, 68],
    ],
    IND: [
      [2023, 52],
      [2024, 58],
      [2025, 64],
    ],
    THA: [
      [2023, 44],
      [2024, 50],
      [2025, 58],
    ],
    IDN: [
      [2023, 43],
      [2024, 48],
      [2025, 52],
    ],
    VNM: [
      [2023, 36],
      [2024, 40],
      [2025, 47],
    ],
    PHL: [
      [2023, 35],
      [2024, 40],
      [2025, 44],
    ],
    LKA: [
      [2023, 23],
      [2024, 26],
      [2025, 31],
    ],
    BGD: [
      [2023, 20],
      [2024, 23],
      [2025, 28],
    ],
    PAK: [
      [2023, 19],
      [2024, 22],
      [2025, 27],
    ],
    KHM: [
      [2023, 19],
      [2024, 21],
      [2025, 22],
    ],
    BRN: [
      [2023, 26],
      [2024, 30],
      [2025, 35],
    ],
    NPL: [
      [2023, 16],
      [2024, 18],
      [2025, 18],
    ],
    LAO: [
      [2023, 9],
      [2024, 10],
      [2025, 14],
    ],
    MDV: [
      [2023, 15],
      [2024, 17],
      [2025, 20],
    ],
    BTN: [
      [2023, 10],
      [2024, 12],
      [2025, 12],
    ],
    MMR: [
      [2023, 8],
      [2024, 9],
      [2025, 11],
    ],
  },
  'open-data-availability': {
    IND: [
      [2024, 51],
      [2025, 57],
      [2026, 61],
    ],
    IDN: [
      [2024, 45],
      [2025, 51],
      [2026, 54],
    ],
    PHL: [
      [2024, 40],
      [2025, 45],
      [2026, 49],
    ],
    SGP: [
      [2024, 60],
      [2025, 67],
      [2026, 72],
    ],
    MYS: [
      [2024, 39],
      [2025, 43],
      [2026, 46],
    ],
    THA: [
      [2024, 33],
      [2025, 38],
      [2026, 43],
    ],
    VNM: [
      [2024, 29],
      [2025, 33],
      [2026, 38],
    ],
    LKA: [
      [2024, 27],
      [2025, 30],
      [2026, 35],
    ],
    BGD: [
      [2024, 22],
      [2025, 25],
      [2026, 30],
    ],
    NPL: [
      [2024, 28],
      [2025, 32],
      [2026, 33],
    ],
    PAK: [
      [2024, 19],
      [2025, 21],
      [2026, 26],
    ],
    KHM: [
      [2024, 17],
      [2025, 19],
      [2026, 19],
    ],
    LAO: [
      [2024, 8],
      [2025, 9],
      [2026, 12],
    ],
    BTN: [
      [2024, 20],
      [2025, 23],
      [2026, 24],
    ],
    MDV: [
      [2024, 16],
      [2025, 18],
      [2026, 21],
    ],
    TLS: [
      [2024, 8],
      [2025, 9],
      [2026, 9],
    ],
  },
  'responsible-ai-use-cases-recorded': {
    LKA: [[2026, 3]],
    IND: [[2026, 2]],
    BGD: [[2026, 2]],
    NPL: [[2026, 2]],
    KHM: [[2026, 1]],
    PHL: [[2026, 3]],
    IDN: [[2026, 2]],
    MDV: [[2026, 1]],
    MYS: [[2026, 1]],
    SGP: [[2026, 1]],
    VNM: [[2026, 1]],
    THA: [[2026, 1]],
    PAK: [[2026, 1]],
  },
  'ai-skills-programmes-recorded': {
    IND: [[2026, 41]],
    IDN: [[2026, 18]],
    SGP: [[2026, 22]],
    MYS: [[2026, 15]],
    PHL: [[2026, 14]],
    VNM: [[2026, 12]],
    THA: [[2026, 11]],
    LKA: [[2026, 7]],
    BGD: [[2026, 9]],
    PAK: [[2026, 8]],
    NPL: [[2026, 4]],
    KHM: [[2026, 3]],
    LAO: [[2026, 1]],
    BTN: [[2026, 2]],
    MDV: [[2026, 1]],
    BRN: [[2026, 2]],
  },
}

export const events = [
  {
    slug: 'regional-policy-dialogue-ai-governance-2026',
    title: 'Regional policy dialogue on AI governance and development',
    summary:
      'Policymakers and regulators from twelve countries compare approaches to AI governance, with findings from the policy and regulation mapping study.',
    description: richText([
      {
        p: 'Sample event. A two-day dialogue for senior officials, regulators and researchers. Sessions cover national strategies, sectoral regulation, algorithmic impact assessment and regional cooperation.',
      },
      { h: 'Programme' },
      {
        li: [
          'Day one. Findings from the mapping studies. Country roundtables.',
          'Day two. Working sessions on procurement, impact assessment and appeals.',
        ],
      },
    ]),
    startDate: daysAhead(24),
    endDate: daysAhead(25),
    format: 'hybrid',
    eventType: 'dialogue',
    venue: 'Colombo, Sri Lanka (venue to be confirmed)',
    onlineUrl: 'https://example.org/dialogue-stream',
    registration: { mode: 'form', closesAt: daysAhead(20), capacity: 120 },
    organisations: ['lirneasia', 'east-west-management-institute'],
    speakers: ['observatory-research-lead', 'partner-governance-adviser'],
    countries: ['sri-lanka'],
    topics: ['public-services', 'justice-and-rights'],
    enablers: ['policy-and-regulation'],
    publishedAt: daysAgo(10),
    related: {
      publications: [
        'mapping-study-policy-and-regulation-enabler',
        'policy-brief-algorithmic-impact-assessment',
      ],
    },
  },
  {
    slug: 'webinar-data-enabler-findings',
    title: 'Webinar. What the data enabler mapping study found',
    summary:
      'The authors present the first mapping study and take questions. Live captioning provided.',
    description: paragraphs(
      'Sample event. One hour online. Recording and slides will be published on this page afterwards.',
    ),
    startDate: daysAhead(9),
    format: 'online',
    eventType: 'webinar',
    onlineUrl: 'https://example.org/webinar',
    registration: { mode: 'form', closesAt: daysAhead(8) },
    organisations: ['lirneasia'],
    speakers: ['observatory-research-lead', 'observatory-data-lead'],
    topics: ['health', 'agriculture'],
    enablers: ['data'],
    publishedAt: daysAgo(6),
    related: { publications: ['mapping-study-data-enabler'] },
  },
  {
    slug: 'scope-a-thon-inclusive-ai-public-services',
    title: 'Scope-a-thon. Inclusive AI for public services',
    summary:
      'Teams of officials, technologists and disability advocates scope responsible AI projects for local government services over three days.',
    description: paragraphs(
      'Sample event. Applications are handled by the partner organisation. Travel support is available for participants from organisations of persons with disabilities.',
    ),
    startDate: daysAhead(52),
    endDate: daysAhead(54),
    format: 'in-person',
    eventType: 'scopeathon',
    venue: 'Manila, Philippines',
    registration: {
      mode: 'external',
      externalUrl: 'https://example.org/scopeathon-apply',
      closesAt: daysAhead(35),
    },
    organisations: ['asia-disability-and-technology-network', 'lirneasia'],
    speakers: ['expert-disability-inclusion', 'observatory-engagement-lead'],
    countries: ['philippines'],
    topics: ['public-services'],
    enablers: ['skills-and-labour', 'algorithms'],
    tags: ['disability'],
    publishedAt: daysAgo(4),
    related: {
      useCases: ['sign-language-recognition-public-service-counters'],
      publications: ['innovation-brief-inclusive-design-disability'],
    },
  },
  {
    slug: 'community-of-practice-session-3',
    title: 'Community of Practice. Session three. Measuring the environmental footprint of AI',
    summary:
      'Monthly session for members of the Observatory Community of Practice. Open to the public without registration.',
    description: paragraphs(
      'Sample event. Presentations from a university compute consortium and a reef monitoring project on measuring energy and water use.',
    ),
    startDate: daysAhead(16),
    format: 'online',
    eventType: 'cop',
    onlineUrl: 'https://example.org/cop-3',
    registration: { mode: 'none' },
    organisations: ['lirneasia'],
    speakers: ['observatory-engagement-lead'],
    topics: ['climate-resilience', 'education'],
    enablers: ['compute'],
    tags: ['environmental-sustainability'],
    publishedAt: daysAgo(3),
    related: {
      useCases: [
        'energy-aware-model-training-university-cluster',
        'coral-reef-monitoring-computer-vision-maldives',
      ],
    },
  },
  {
    slug: 'observatory-launch-convening-2026',
    title: 'Observatory launch convening',
    summary:
      'The regional convening that launched the Observatory’s workstreams and Community of Practice.',
    description: paragraphs('Sample past event with a recording.'),
    startDate: daysAgo(150),
    endDate: daysAgo(149),
    format: 'hybrid',
    eventType: 'convening',
    venue: 'Colombo, Sri Lanka',
    registration: { mode: 'none' },
    recordingUrl: 'https://example.org/launch-recording',
    organisations: ['lirneasia', 'east-west-management-institute', 'justjobs-network'],
    speakers: [
      'observatory-research-lead',
      'partner-labour-researcher',
      'partner-governance-adviser',
    ],
    countries: ['sri-lanka'],
    enablers: ['policy-and-regulation', 'data'],
    publishedAt: daysAgo(160),
  },
  {
    slug: 'workshop-platform-work-algorithmic-management',
    title: 'Workshop. Algorithmic management and worker voice',
    summary:
      'Worker associations, platforms and labour ministries discussed transparency in scheduling and pay algorithms.',
    description: paragraphs('Sample past event.'),
    startDate: daysAgo(40),
    format: 'in-person',
    eventType: 'workshop',
    venue: 'Hanoi, Viet Nam',
    registration: { mode: 'none' },
    recordingUrl: 'https://example.org/workshop-recording',
    organisations: ['justjobs-network'],
    speakers: ['partner-labour-researcher'],
    countries: ['viet-nam'],
    topics: ['future-of-work'],
    enablers: ['skills-and-labour'],
    publishedAt: daysAgo(70),
    related: {
      useCases: ['platform-worker-scheduling-transparency'],
      publications: ['policy-brief-ai-and-platform-work'],
    },
  },
  {
    slug: 'webinar-benchmarking-indices',
    title: 'Webinar. Benchmarking the benchmarks',
    summary:
      'How global AI indices score Asia and what the Observatory’s own indicator framework adds.',
    description: paragraphs('Sample past event.'),
    startDate: daysAgo(50),
    format: 'online',
    eventType: 'webinar',
    registration: { mode: 'none' },
    recordingUrl: 'https://example.org/benchmarking-recording',
    organisations: ['lirneasia'],
    speakers: ['observatory-data-lead'],
    enablers: ['policy-and-regulation', 'compute', 'data'],
    tags: ['benchmarking'],
    publishedAt: daysAgo(65),
    related: { publications: ['benchmarking-ai-indices-asia'] },
  },
] as const

export const posts = [
  {
    slug: 'why-an-observatory-needs-a-repository-not-a-report',
    title: 'Why an observatory needs a repository, not a report',
    summary:
      'Reports go out of date the day they are published. A repository of structured, comparable cases can keep pace with the region.',
    body: richText([
      {
        p: 'Sample blog post. This is placeholder copy demonstrating the blog format, with a serif reading style, a summary and taxonomy tags.',
      },
      {
        p: 'Blog posts carry authors from the directory, countries, topics and enablers, and can be related to use cases, publications, datasets and events.',
      },
    ]),
    authors: ['observatory-research-lead'],
    topics: ['public-services'],
    enablers: ['data'],
    publishedAt: daysAgo(3),
  },
  {
    slug: 'what-we-learned-coding-national-ai-strategies',
    title: 'What we learned coding twenty national AI strategies',
    summary:
      'Strategies differ more in what they leave out than in what they include. Notes from the policy mapping study.',
    body: paragraphs('Sample blog post.'),
    authors: ['observatory-research-lead', 'partner-governance-adviser'],
    enablers: ['policy-and-regulation'],
    tags: ['benchmarking'],
    publishedAt: daysAgo(28),
  },
  {
    slug: 'small-states-and-the-compute-question',
    title: 'Small states and the compute question',
    summary:
      'The Maldives, Bhutan and Brunei will not build hyperscale data centres. What does compute access mean for them?',
    body: paragraphs('Sample blog post.'),
    authors: ['observatory-data-lead'],
    countries: ['maldives', 'bhutan', 'brunei-darussalam'],
    enablers: ['compute'],
    tags: ['small-states'],
    publishedAt: daysAgo(36),
  },
  {
    slug: 'consent-is-not-a-checkbox',
    title: 'Consent is not a checkbox. Lessons from a farmers’ data cooperative',
    summary:
      'When farmers govern their own data, the questions change from “did they agree” to “what did they decide”.',
    body: paragraphs('Sample blog post.'),
    authors: ['observatory-engagement-lead'],
    countries: ['bangladesh', 'nepal'],
    topics: ['agriculture'],
    enablers: ['data'],
    publishedAt: daysAgo(52),
    related: { useCases: ['farmer-owned-data-cooperative-advisory-services'] },
  },
  {
    slug: 'measuring-what-indices-miss',
    title: 'Measuring what the indices miss',
    summary:
      'Informal work, low-resource languages and island geography barely register in global AI indices. Our indicator framework tries to change that.',
    body: paragraphs('Sample blog post.'),
    authors: ['observatory-data-lead'],
    enablers: ['skills-and-labour', 'algorithms'],
    tags: ['benchmarking', 'low-resource-languages'],
    publishedAt: daysAgo(80),
  },
] as const

export const opEds = [
  {
    slug: 'asia-should-write-its-own-ai-rules',
    title: 'Asia should write its own AI rules',
    summary:
      'Importing regulatory templates from elsewhere will not serve the region’s development priorities. Sample op-ed entry.',
    outlet: 'Sample regional newspaper',
    externalUrl: 'https://example.org/op-ed-1',
    authors: ['observatory-research-lead'],
    enablers: ['policy-and-regulation'],
    publishedAt: daysAgo(15),
  },
  {
    slug: 'gig-workers-deserve-to-see-the-algorithm',
    title: 'Gig workers deserve to see the algorithm',
    summary:
      'Transparency in scheduling and pay is a labour right, not a technical favour. Sample op-ed entry.',
    outlet: 'Sample business daily',
    externalUrl: 'https://example.org/op-ed-2',
    authors: ['partner-labour-researcher'],
    countries: ['viet-nam', 'indonesia'],
    topics: ['future-of-work'],
    enablers: ['skills-and-labour'],
    publishedAt: daysAgo(42),
  },
  {
    slug: 'accessible-ai-is-better-ai',
    title: 'Accessible AI is better AI',
    summary:
      'Designing with persons with disabilities improves systems for everyone. Sample op-ed entry.',
    outlet: 'Sample online magazine',
    externalUrl: 'https://example.org/op-ed-3',
    authors: ['expert-disability-inclusion'],
    countries: ['philippines'],
    topics: ['public-services'],
    enablers: ['algorithms'],
    tags: ['disability'],
    publishedAt: daysAgo(58),
  },
] as const

export const news = [
  {
    slug: 'first-mapping-study-published',
    title: 'First mapping study published. The data enabler',
    summary:
      'The Observatory has published the first of six mapping studies on responsible AI ecosystem enablers.',
    body: paragraphs('Sample news item.'),
    enablers: ['data'],
    publishedAt: daysAgo(10),
    related: { publications: ['mapping-study-data-enabler'] },
  },
  {
    slug: 'call-for-use-cases-open',
    title: 'Call for responsible AI use cases now open',
    summary:
      'Organisations across South and Southeast Asia are invited to submit use cases to the regional repository.',
    body: paragraphs(
      'Sample news item. Submissions are reviewed by the Observatory team before publication.',
    ),
    enablers: ['innovation-and-investment-climate'],
    publishedAt: daysAgo(21),
  },
  {
    slug: 'community-of-practice-passes-200-members',
    title: 'Community of Practice passes 200 members',
    summary:
      'Six months after launch, the Observatory Community of Practice has members from 16 countries.',
    body: paragraphs('Sample news item.'),
    enablers: ['skills-and-labour'],
    publishedAt: daysAgo(38),
  },
  {
    slug: 'observatory-launched',
    title: 'Asia AI4D Observatory launched',
    summary:
      'LIRNEasia, with East-West Management Institute and JustJobs Network, has launched a three-year Observatory on responsible AI for development.',
    body: paragraphs(
      'Sample news item drawing on LIRNEasia’s public announcement of 1 July 2026. To be replaced with the Client’s text.',
    ),
    publishedAt: daysAgo(160),
  },
] as const

export const learningResources = [
  {
    slug: 'introduction-to-responsible-ai-for-policymakers',
    title: 'Introduction to responsible AI for policymakers',
    summary:
      'A self-paced course in six modules covering AI basics, risks, governance options and procurement.',
    description: paragraphs('Sample learning resource.'),
    resourceType: 'course',
    level: 'introductory',
    duration: '6 hours',
    provider: 'Asia AI4D Observatory',
    providerOrganisation: 'lirneasia',
    externalUrl: 'https://example.org/course',
    language: 'English',
    topics: ['public-services'],
    enablers: ['policy-and-regulation', 'skills-and-labour'],
    raiDimensions: ['rights-based', 'safe'],
    publishedAt: daysAgo(30),
  },
  {
    slug: 'algorithmic-impact-assessment-template',
    title: 'Algorithmic impact assessment template and worked example',
    summary: 'A fillable template with a completed example from a social protection deployment.',
    description: paragraphs('Sample learning resource with a downloadable file.'),
    resourceType: 'toolkit',
    level: 'intermediate',
    duration: '2 hours',
    provider: 'East-West Management Institute',
    providerOrganisation: 'east-west-management-institute',
    file: {
      name: 'aia-template.pdf',
      gated: false,
      title: 'Algorithmic impact assessment template',
    },
    topics: ['public-services'],
    enablers: ['policy-and-regulation'],
    raiDimensions: ['rights-based'],
    publishedAt: daysAgo(18),
    related: { publications: ['policy-brief-algorithmic-impact-assessment'] },
  },
  {
    slug: 'recording-sri-lanka-ai-emerging-technologies-webinar',
    title:
      'Recording. How Sri Lanka can be a global partner in driving AI and emerging technologies',
    summary:
      'Public webinar recording on Sri Lanka’s position in the AI and emerging technologies landscape, used here to demonstrate the video resource type.',
    description: paragraphs(
      'Sample video resource. The recording is a publicly available webinar and stands in for the Observatory’s own recordings. The embed uses the privacy-enhanced YouTube domain, loads only when scrolled into view, and links to the original so captions and transcripts on the provider’s site can be used.',
    ),
    resourceType: 'video',
    level: 'introductory',
    duration: 'About 90 minutes',
    provider: 'Public webinar recording (placeholder)',
    videoEmbedUrl: 'https://www.youtube.com/watch?v=NLqCw_iWMgw',
    language: 'English',
    enablers: ['skills-and-labour', 'innovation-and-investment-climate'],
    publishedAt: daysAgo(20),
  },
  {
    slug: 'guide-inclusive-data-collection-disability',
    title: 'Guide. Inclusive data collection with persons with disabilities',
    summary:
      'Practical steps for consent, accessibility and representation when collecting training data.',
    description: paragraphs('Sample guide.'),
    resourceType: 'guide',
    level: 'intermediate',
    provider: 'Asia Disability and Technology Network',
    providerOrganisation: 'asia-disability-and-technology-network',
    externalUrl: 'https://example.org/guide',
    enablers: ['data', 'skills-and-labour'],
    raiDimensions: ['inclusive'],
    tags: ['disability'],
    publishedAt: daysAgo(44),
  },
  {
    slug: 'framework-evaluating-responsible-ai-use-cases',
    title: 'Framework. Evaluating responsible AI use cases for development',
    summary:
      'The Observatory’s evaluation framework, with criteria across the five responsible AI dimensions.',
    description: paragraphs('Sample framework resource.'),
    resourceType: 'framework',
    level: 'advanced',
    provider: 'Asia AI4D Observatory',
    providerOrganisation: 'lirneasia',
    externalUrl: 'https://example.org/framework',
    raiDimensions: ['safe', 'rights-based', 'sustainable', 'inclusive', 'context-appropriate'],
    enablers: ['algorithms'],
    publishedAt: daysAgo(12),
  },
  {
    slug: 'reading-list-ai-and-work-in-asia',
    title: 'Reading list. AI and the future of work in Asia',
    summary: 'Twenty papers and reports selected by JustJobs Network researchers.',
    description: paragraphs('Sample reading list.'),
    resourceType: 'reading-list',
    level: 'intermediate',
    provider: 'JustJobs Network',
    providerOrganisation: 'justjobs-network',
    externalUrl: 'https://example.org/reading-list',
    topics: ['future-of-work'],
    enablers: ['skills-and-labour'],
    publishedAt: daysAgo(66),
  },
  {
    slug: 'khmer-nlp-starter-kit',
    title: 'Khmer NLP starter kit',
    summary: 'Open models, corpora and tutorials for building Khmer language applications.',
    description: paragraphs('Sample resource in a second language.'),
    resourceType: 'toolkit',
    level: 'advanced',
    provider: 'Mekong Language Technology Lab',
    providerOrganisation: 'mekong-language-technology-lab',
    externalUrl: 'https://example.org/khmer-kit',
    language: 'Khmer and English',
    countries: ['cambodia'],
    topics: ['language-and-information'],
    enablers: ['algorithms'],
    tags: ['low-resource-languages', 'open-source'],
    publishedAt: daysAgo(90),
  },
] as const

export const opportunities = [
  {
    slug: 'observatory-research-fellowship-2027',
    title: 'Asia AI4D Observatory research fellowship 2027',
    summary:
      'Six-month fellowships for early-career researchers from the region to work on the mapping and benchmarking studies.',
    description: paragraphs('Sample opportunity.'),
    opportunityType: 'fellowship',
    deadline: daysAhead(38),
    provider: 'Asia AI4D Observatory',
    eligibility:
      'Researchers based in South or Southeast Asia within eight years of their highest degree.',
    externalUrl: 'https://example.org/fellowship',
    enablers: ['skills-and-labour'],
    publishedAt: daysAgo(6),
  },
  {
    slug: 'small-grants-inclusive-ai-2026',
    title: 'Small grants for inclusive AI projects',
    summary:
      'Grants of up to USD 25,000 for projects led by or with organisations of women, persons with disabilities or Indigenous communities.',
    description: paragraphs('Sample opportunity.'),
    opportunityType: 'grant',
    deadline: daysAhead(11),
    provider: 'Regional Development Partners Forum (sample)',
    eligibility: 'Registered organisations in the region.',
    externalUrl: 'https://example.org/small-grants',
    enablers: ['innovation-and-investment-climate'],
    tags: ['gender', 'disability', 'indigenous-communities'],
    publishedAt: daysAgo(20),
  },
  {
    slug: 'call-for-papers-regional-convening-2027',
    title: 'Call for papers. Regional convening on responsible AI 2027',
    summary:
      'Abstracts invited on any of the six ecosystem enablers, with priority for empirical work from the region.',
    description: paragraphs('Sample opportunity.'),
    opportunityType: 'call-for-papers',
    deadline: daysAhead(75),
    provider: 'Asia AI4D Observatory',
    externalUrl: 'https://example.org/cfp',
    enablers: ['policy-and-regulation', 'data'],
    publishedAt: daysAgo(2),
  },
  {
    slug: 'data-visualisation-officer',
    title: 'Data visualisation officer (sample vacancy)',
    summary:
      'Sample vacancy. Full-time role with the Observatory team in Colombo or remote within the region.',
    description: paragraphs('Sample opportunity.'),
    opportunityType: 'job',
    rolling: true,
    provider: 'LIRNEasia',
    externalUrl: 'https://example.org/vacancy',
    countries: ['sri-lanka'],
    enablers: ['skills-and-labour'],
    publishedAt: daysAgo(9),
  },
  {
    slug: 'scope-a-thon-applications-2026',
    title: 'Apply to the inclusive AI scope-a-thon',
    summary: 'Applications for the Manila scope-a-thon. Travel support available.',
    description: paragraphs('Sample opportunity linked to an event.'),
    opportunityType: 'event',
    deadline: daysAhead(35),
    provider: 'Asia Disability and Technology Network (sample)',
    externalUrl: 'https://example.org/scopeathon-apply',
    countries: ['philippines'],
    enablers: ['skills-and-labour'],
    tags: ['disability'],
    publishedAt: daysAgo(4),
  },
  {
    slug: 'closed-innovation-challenge-2026',
    title: 'Responsible AI innovation challenge 2026 (closed)',
    summary: 'A closed competition kept for the record. Winners announced at the launch convening.',
    description: paragraphs(
      'Sample closed opportunity. Closed items remain visible under “Including closed” so the archive is complete.',
    ),
    opportunityType: 'competition',
    deadline: daysAgo(100),
    provider: 'Asia AI4D Observatory',
    externalUrl: 'https://example.org/challenge',
    enablers: ['innovation-and-investment-climate'],
    publishedAt: daysAgo(180),
  },
] as const

export const newsletters = [
  {
    slug: 'issue-2-september-2026',
    title:
      'Issue 2. Mapping the data enabler, a call for use cases, and the first Community of Practice sessions',
    issueNumber: 2,
    summary: 'The quarterly digest. Sample issue.',
    body: richText([
      {
        p: 'Sample newsletter issue. The archive keeps every issue readable on the site, so the newsletter is a public record rather than something that lives only in inboxes.',
      },
      { h: 'In this issue' },
      {
        li: [
          'The data enabler mapping study.',
          'Call for responsible AI use cases.',
          'Three new learning resources.',
          'Upcoming regional policy dialogue.',
        ],
      },
    ]),
    featured: [
      { relationTo: 'publications', slug: 'mapping-study-data-enabler' },
      { relationTo: 'use-cases', slug: 'khmer-speech-recognition-agricultural-hotline' },
      { relationTo: 'events', slug: 'regional-policy-dialogue-ai-governance-2026' },
    ],
    file: { name: 'newsletter-issue-2.pdf', gated: false, title: 'Newsletter issue 2' },
    publishedAt: daysAgo(12),
  },
  {
    slug: 'issue-1-june-2026',
    title: 'Issue 1. Introducing the Asia AI4D Observatory',
    issueNumber: 1,
    summary:
      'The first issue. What the Observatory is, who is involved and what to expect. Sample issue.',
    body: paragraphs('Sample newsletter issue.'),
    featured: [{ relationTo: 'events', slug: 'observatory-launch-convening-2026' }],
    publishedAt: daysAgo(100),
  },
] as const

export const pages = [
  {
    slug: 'about',
    title: 'About the Asia AI4D Observatory',
    summary:
      'A policy and innovation network on responsible artificial intelligence for South and Southeast Asia, led by LIRNEasia.',
    body: richText([
      {
        p: 'The Asia AI4D Observatory is a three-year initiative launched in 2026 to strengthen evidence, knowledge and capacity for responsible artificial intelligence across South and Southeast Asia. It is led by LIRNEasia with East-West Management Institute and JustJobs Network, with EngageMedia as a project partner, as part of the Artificial Intelligence for Development (AI4D) programme, a five-year partnership between IDRC and the UK Foreign, Commonwealth and Development Office.',
      },
      { h: 'What responsible AI means here' },
      {
        p: 'AI that is safe, rights-based, sustainable, inclusive and appropriate to context. The Observatory examines how these qualities are achieved in practice across six ecosystem enablers. Data, compute, algorithms, skills and labour, innovation and investment climate, and policy and regulation.',
      },
      { h: 'What the Observatory does' },
      {
        li: [
          'Evidence. Benchmarking country progress, mapping ecosystems across the six enablers and maintaining a regional repository of responsible AI use cases.',
          'Knowledge translation. Mapping studies, innovation briefs, newsletters, interactive regional resources, comparative analyses, policy tools and assessment frameworks.',
          'Capacity. Training, advisory support, regional policy dialogues, a Community of Practice, convenings and scope-a-thons.',
          'Inclusion. Attention to women, persons with disabilities and Indigenous communities, and to environmental sustainability, across all work.',
        ],
      },
      { h: 'This website' },
      {
        p: 'The website is the Observatory’s repository and engagement platform. Everything published here is searchable and filterable by country, sector, ecosystem enabler and responsible AI dimension, and items are connected to one another so a reader can move from a use case to the study that analysed it, the dataset behind it and the people involved.',
      },
    ]),
    provenance: 'public',
  },
  {
    slug: 'accessibility',
    title: 'Accessibility statement',
    summary:
      'How this website meets accessibility standards, what we know does not yet work, and how to tell us about problems.',
    body: richText([
      {
        p: 'Draft statement for the Client to review. The Asia AI4D Observatory website is designed to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA.',
      },
      { h: 'What we have done' },
      {
        li: [
          'Every page can be used with a keyboard, with a visible focus indicator.',
          'Text and background colours meet contrast requirements.',
          'Maps and charts are accompanied by a text summary, a legend, a table and a CSV export.',
          'Forms label every field, state why information is collected and report errors in text.',
          'Text can be resized to 200 percent without loss of content.',
          'Motion is minimal and respects the reduce motion preference.',
          'Video embeds link to the original so captions and transcripts on the provider’s site can be used.',
        ],
      },
      { h: 'Known limitations' },
      {
        li: [
          'Documents uploaded by partners may not be accessible PDFs. We ask partners for accessible versions and will provide an alternative format on request.',
          'The site is in English. Additional languages are planned.',
        ],
      },
      { h: 'Tell us' },
      {
        p: 'If you find a problem or need content in another format, contact the Observatory team. Contact address pending client input.',
      },
    ]),
    provenance: 'sample',
  },
  {
    slug: 'privacy',
    title: 'Privacy',
    summary: 'What personal information this website collects, why, and how long it is kept.',
    body: richText([
      {
        p: 'Draft notice for the Client’s legal review. It reflects how the site is built and should be finalised against Sri Lanka’s Personal Data Protection Act No. 9 of 2022 and the Client’s own policies.',
      },
      { h: 'What we collect' },
      {
        li: [
          'Newsletter subscription. Email address, and optionally your name and organisation, with the consent text you agreed to and its version.',
          'Email-gated downloads. Email address, and optionally your organisation and country, the resource requested, the consent text and version, and a one-way hash of your network address used only to detect abuse.',
          'Event registration. Name, email address, and optionally organisation, country and accessibility requirements, with the consent text and version.',
          'Analytics. Aggregate page views and events such as downloads and sign-ups. The analytics configuration is set by the Observatory and is documented here once decided.',
        ],
      },
      { h: 'How long we keep it' },
      {
        p: 'Download and registration records are kept for 24 months by default and then deleted. Subscriptions are kept until you unsubscribe. The retention period is a site setting.',
      },
      { h: 'Your rights' },
      {
        p: 'You may ask to see, correct or delete your information at any time. Contact address pending client input.',
      },
    ]),
    provenance: 'sample',
  },
] as const

export const homeConfig = {
  headline: 'Evidence for responsible AI in Asia',
  intro:
    'The Asia AI4D Observatory maps how South and Southeast Asia design, govern and scale AI that is safe, rights-based, sustainable, inclusive and appropriate to context. Find use cases, mapping studies, data, people and opportunities in one place.',
  featured: [
    { relationTo: 'publications', slug: 'mapping-study-data-enabler' },
    { relationTo: 'use-cases', slug: 'khmer-speech-recognition-agricultural-hotline' },
    { relationTo: 'events', slug: 'regional-policy-dialogue-ai-governance-2026' },
    { relationTo: 'datasets', slug: 'regional-ai-indicator-values' },
  ],
  featuredIndicator: 'ai-policy-status',
  audienceEntries: [
    {
      label: 'Policymakers and regulators',
      description: 'Strategies, laws and briefs by country',
      url: '/publications?type=policy-brief',
    },
    {
      label: 'Researchers and academics',
      description: 'Mapping studies, datasets and indicators',
      url: '/datasets',
    },
    {
      label: 'Civil society',
      description: 'Rights, inclusion and accountability in practice',
      url: '/use-cases?dimension=rights-based',
    },
    {
      label: 'Innovators and private sector',
      description: 'Use cases, briefs and funding calls',
      url: '/opportunities',
    },
    {
      label: 'Funders and development partners',
      description: 'Where the gaps are, by enabler',
      url: '/data',
    },
    {
      label: 'International and regional organisations',
      description: 'Who is working on what, by organisation type',
      url: '/directory?view=organisations',
    },
    {
      label: 'Media and the public',
      description: 'Experts to speak to, latest news and plain-language explainers',
      url: '/commentary',
    },
  ],
}

export const siteConfig = {
  programmeNote:
    'The Asia AI4D Observatory is led by LIRNEasia with East-West Management Institute and JustJobs Network, with EngageMedia as a project partner. It is part of the Artificial Intelligence for Development (AI4D) programme, a partnership between IDRC and the UK Foreign, Commonwealth and Development Office.',
  funders: [
    { name: 'IDRC', url: 'https://idrc-crdi.ca' },
    {
      name: 'UK FCDO',
      url: 'https://www.gov.uk/government/organisations/foreign-commonwealth-development-office',
    },
  ],
  partners: [
    { name: 'LIRNEasia', url: 'https://lirneasia.net' },
    { name: 'East-West Management Institute', url: 'https://ewmi.org' },
    { name: 'JustJobs Network', url: 'https://justjobsnetwork.org' },
    // Listed as a project organisation on ai4d.ai and idrc-crdi.ca. LIRNEasia's own announcement names the three above as leads.
    { name: 'EngageMedia', url: 'https://engagemedia.org' },
  ],
}
