import { describe, expect, it } from 'vitest'
import { slugify } from '@/lib/slugify'

describe('slugify', () => {
  it('lower-cases and hyphenates', () => {
    expect(slugify('Responsible AI in Agriculture')).toBe('responsible-ai-in-agriculture')
  })

  it('strips accents and non-ASCII punctuation', () => {
    expect(slugify('Côte d’Ivoire — étude')).toBe('cote-d-ivoire-etude')
    expect(slugify('São Tomé & Príncipe')).toBe('sao-tome-and-principe')
  })

  it('spells out ampersands and keeps digits', () => {
    expect(slugify('Data & AI 2026')).toBe('data-and-ai-2026')
    expect(slugify('COVID-19 response')).toBe('covid-19-response')
  })

  it('collapses runs of separators and trims the ends', () => {
    expect(slugify('  --Hello,,, world!!  ')).toBe('hello-world')
    expect(slugify('a///b___c')).toBe('a-b-c')
  })

  it('is idempotent', () => {
    const once = slugify('Health, Nutrition & Wellbeing (2026)')
    expect(slugify(once)).toBe(once)
  })

  it('caps the length at 120 characters', () => {
    expect(slugify('word '.repeat(60)).length).toBeLessThanOrEqual(120)
  })

  it('returns an empty string for input with no usable characters', () => {
    expect(slugify('!!!')).toBe('')
    expect(slugify('')).toBe('')
  })
})
