/*
 * Seed taxonomies. Drawn from the Observatory's public description (LIRNEasia, 1 July 2026) and the RFP.
 * All are editable in the CMS and marked as pending confirmation in requirements refinement.
 */

export const countries = [
  // South Asia
  { name: 'Afghanistan', iso3: 'AFG', isoNumeric: '004', subregion: 'south-asia' },
  { name: 'Bangladesh', iso3: 'BGD', isoNumeric: '050', subregion: 'south-asia' },
  { name: 'Bhutan', iso3: 'BTN', isoNumeric: '064', subregion: 'south-asia' },
  { name: 'India', iso3: 'IND', isoNumeric: '356', subregion: 'south-asia' },
  { name: 'Maldives', iso3: 'MDV', isoNumeric: '462', subregion: 'south-asia', smallState: true },
  { name: 'Nepal', iso3: 'NPL', isoNumeric: '524', subregion: 'south-asia' },
  { name: 'Pakistan', iso3: 'PAK', isoNumeric: '586', subregion: 'south-asia' },
  { name: 'Sri Lanka', iso3: 'LKA', isoNumeric: '144', subregion: 'south-asia' },
  // Southeast Asia
  { name: 'Brunei Darussalam', iso3: 'BRN', isoNumeric: '096', subregion: 'southeast-asia', smallState: true },
  { name: 'Cambodia', iso3: 'KHM', isoNumeric: '116', subregion: 'southeast-asia' },
  { name: 'Indonesia', iso3: 'IDN', isoNumeric: '360', subregion: 'southeast-asia' },
  { name: 'Lao PDR', iso3: 'LAO', isoNumeric: '418', subregion: 'southeast-asia' },
  { name: 'Malaysia', iso3: 'MYS', isoNumeric: '458', subregion: 'southeast-asia' },
  { name: 'Myanmar', iso3: 'MMR', isoNumeric: '104', subregion: 'southeast-asia' },
  { name: 'Philippines', iso3: 'PHL', isoNumeric: '608', subregion: 'southeast-asia' },
  { name: 'Singapore', iso3: 'SGP', isoNumeric: '702', subregion: 'southeast-asia', smallState: true },
  { name: 'Thailand', iso3: 'THA', isoNumeric: '764', subregion: 'southeast-asia' },
  { name: 'Timor-Leste', iso3: 'TLS', isoNumeric: '626', subregion: 'southeast-asia' },
  { name: 'Viet Nam', iso3: 'VNM', isoNumeric: '704', subregion: 'southeast-asia' },
] as const

export const enablers = [
  { name: 'Data', order: 1, description: 'Availability, quality, governance and openness of the data that AI systems learn from and act on.' },
  { name: 'Compute', order: 2, description: 'Access to the processing capacity, cloud and connectivity needed to train and run AI systems.' },
  { name: 'Algorithms', order: 3, description: 'Models, methods and open resources, including language coverage and local model development.' },
  { name: 'Skills and labour', order: 4, description: 'The people who build, govern and use AI, and the effects of AI on work.' },
  { name: 'Innovation and investment climate', order: 5, description: 'Funding, market conditions, procurement and the environment for AI enterprises and public innovation.' },
  { name: 'Policy and regulation', order: 6, description: 'Strategies, laws, standards and institutions that shape how AI is developed and deployed.' },
] as const

export const raiDimensions = [
  { name: 'Safe', description: 'Systems that are reliable, tested and protected against harm and misuse.' },
  { name: 'Rights-based', description: 'Systems that respect privacy, non-discrimination, due process and other human rights.' },
  { name: 'Sustainable', description: 'Systems whose energy, water and land footprint is measured and managed.' },
  { name: 'Inclusive', description: 'Systems designed with and for women, persons with disabilities, Indigenous communities and others often left out.' },
  { name: 'Context-appropriate', description: 'Systems fitted to local languages, infrastructure, institutions and needs.' },
] as const

export const topics = [
  { name: 'Health', description: 'Clinical, public health and health system applications.' },
  { name: 'Education', description: 'Teaching, learning, assessment and education administration.' },
  { name: 'Agriculture', description: 'Crop, livestock, advisory and food system applications.' },
  { name: 'Climate resilience', description: 'Early warning, disaster response, adaptation and environmental monitoring.' },
  { name: 'Public services', description: 'Government service delivery, welfare and administration.' },
  { name: 'Financial inclusion', description: 'Credit, payments, insurance and access to finance.' },
  { name: 'Future of work', description: 'Labour markets, platform work, automation and skills.' },
  { name: 'Language and information', description: 'Language technology, misinformation and access to information.' },
  { name: 'Justice and rights', description: 'Legal systems, accountability and rights protection.' },
] as const

export const stakeholderTypes = [
  { name: 'Government', description: 'Ministries, agencies, regulators and public bodies.' },
  { name: 'Private sector', description: 'Companies, start-ups and industry associations.' },
  { name: 'Civil society or NGO', description: 'Non-governmental and community organisations.' },
  { name: 'University or research institution', description: 'Universities, think tanks and research centres.' },
  { name: 'Regional or international body', description: 'Multilateral, regional and intergovernmental organisations.' },
  { name: 'Funder', description: 'Development partners, foundations and investors.' },
] as const

export const tags = [
  { name: 'Gender' },
  { name: 'Disability' },
  { name: 'Indigenous communities' },
  { name: 'Environmental sustainability' },
  { name: 'Open source' },
  { name: 'Low-resource languages' },
  { name: 'Small states' },
  { name: 'Benchmarking' },
] as const
