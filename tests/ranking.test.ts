import { describe, expect, it } from 'vitest'
import { editDistance, scoreDoc, suggest, tokenize } from '@/lib/search'

/** Search ranking and spelling suggestions, independent of the database. */

describe('tokenize', () => {
  it('lowercases, drops stop words and punctuation, removes duplicates', () => {
    expect(tokenize('The Health of AI, in Sri Lanka and health')).toEqual([
      'health',
      'ai',
      'sri',
      'lanka',
    ])
  })
  it('caps query terms but can return every word when building a vocabulary', () => {
    const long = 'one two three four five six seven eight nine ten'
    expect(tokenize(long)).toHaveLength(8)
    expect(tokenize(long, Infinity)).toHaveLength(10)
  })
  it('folds accents so "Việt" matches "Viet"', () => {
    expect(tokenize('Việt Nam')).toEqual(['viet', 'nam'])
  })
})

describe('scoreDoc', () => {
  const base = { priority: 30, publishedAt: null, keywords: '', excerpt: '' }
  it('ranks a title match above a keyword match above an excerpt match', () => {
    const t = scoreDoc(
      { ...base, title: 'Health data sharing', excerpt: '', keywords: '' },
      ['health'],
      'health',
    )
    const k = scoreDoc(
      { ...base, title: 'Something else', keywords: 'Health', excerpt: '' },
      ['health'],
      'health',
    )
    const e = scoreDoc(
      { ...base, title: 'Something else', keywords: '', excerpt: 'about health' },
      ['health'],
      'health',
    )
    expect(t).toBeGreaterThan(k)
    expect(k).toBeGreaterThan(e)
  })
  it('rewards the whole phrase in the title', () => {
    const phrase = scoreDoc(
      { ...base, title: 'Primary care clinics in Sri Lanka' },
      ['primary', 'care'],
      'primary care',
    )
    const apart = scoreDoc(
      { ...base, title: 'Care for primary schools' },
      ['primary', 'care'],
      'primary care',
    )
    expect(phrase).toBeGreaterThan(apart)
  })
})

describe('editDistance and suggest', () => {
  it('measures small typos and stops early on large ones', () => {
    expect(editDistance('helth', 'health')).toBe(1)
    expect(editDistance('cambodai', 'cambodia')).toBe(2)
    expect(editDistance('agriculture', 'data', 2)).toBe(3)
  })
  it('suggests the closest known word and leaves known words alone', () => {
    const vocab = new Map([
      ['health', 5],
      ['cambodia', 2],
      ['data', 9],
    ])
    expect(suggest(['helth', 'data'], vocab)).toBe('health data')
    expect(suggest(['cambodai'], vocab)).toBe('cambodia')
    expect(suggest(['data'], vocab)).toBeNull()
    expect(suggest(['zzzzzz'], vocab)).toBeNull()
  })
})
