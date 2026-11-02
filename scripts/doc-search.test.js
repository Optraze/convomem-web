import { describe, expect, test } from 'bun:test'

import { searchDocs } from '../src/features/docs/search.ts'

const index = [
  {
    slug: 'setup',
    title: 'Setup',
    description: 'Capture your first conversation.',
    headings: [{ id: 'capture-message', text: 'Capture a message' }],
  },
  {
    slug: 'capture',
    title: 'Capture',
    description: 'The capture reference.',
    headings: [{ id: 'polling', text: 'Polling for completion' }],
  },
]
describe('documentation search navigation', () => {
  test('an exact page title outranks earlier descriptions and headings', () => {
    expect(searchDocs(index, ' CAPTURE ')[0]).toEqual({
      slug: 'capture',
      title: 'Capture',
      label: 'Capture',
    })
  })
  test('a heading-only match preserves the destination anchor', () => {
    expect(searchDocs(index, 'polling')[0]).toEqual({
      slug: 'capture',
      title: 'Capture',
      label: 'Polling for completion',
      hash: 'polling',
    })
  })
  test('unknown terms return no hits and broad searches stay bounded', () => {
    expect(searchDocs(index, 'not-present')).toEqual([])
    const many = Array.from({ length: 20 }, (_, i) => ({
      slug: `guide-${i}`,
      title: `Guide ${i}`,
      description: '',
      headings: [],
    }))
    expect(searchDocs(many, 'guide')).toHaveLength(12)
  })
})
