import { describe, expect, test } from 'bun:test'
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { allContentFiles, contentFiles } from './content-files.ts'
import { draftContentPlugin } from './draft-content.ts'

const read = (name) => readFileSync(`src/content/docs/${name}.mdx`, 'utf8')
const sdkPages = ['sdk-typescript', 'sdk-reference', 'sdk-python', 'sdk-rust']
const docs = readdirSync('src/content/docs')
  .filter((name) => name.endsWith('.mdx'))
  .map((name) => ({
    name,
    text: readFileSync(`src/content/docs/${name}`, 'utf8'),
  }))

describe('public content release boundary', () => {
  test('production MDX loading leaves the published v1.2.0 entry intact', () => {
    const plugin = draftContentPlugin('build')
    const path = resolve('src/content/changelog/v1.2.0.mdx')
    expect(plugin.load(path)).toBeUndefined()
    expect(plugin.load(`${path}?import`)).toBeUndefined()
  })

  test('published MDX and local draft previews are not changed', () => {
    expect(draftContentPlugin('serve')).toBeNull()
    expect(
      draftContentPlugin('build').load(
        resolve('src/content/docs/sdk-python.mdx')
      )
    ).toBeUndefined()
  })

  test('the v1.2.0 changelog replaces the unpublished draft', () => {
    expect(
      contentFiles('changelog').find((file) => file.slug === 'v1.2.0')?.data
        .status
    ).toBe('published')
    expect(
      allContentFiles({ includeDrafts: true }).some(
        (file) => file.slug === 'v-next'
      )
    ).toBe(false)
  })

  test('SDK pages state the released SDK version, not a pre-release contract', () => {
    for (const name of sdkPages) {
      expect(read(name)).toContain('SDK 0.3.0, released with ConvoMem v1.2.0')
      expect(read(name)).not.toContain('upcoming SDK')
    }
  })

  test('public docs do not advertise excluded SDK methods or internal routes', () => {
    const excluded =
      /\b(?:getStats|get_stats|get_customer_stats|listMergeCandidates|list_merge_candidates|dismissMergeCandidate|dismiss_merge_candidate|CustomerStats|MergeCandidate)\b|\/api\/v1\/customers\/(?:stats|merge-candidates)/
    for (const { text } of docs) expect(text).not.toMatch(excluded)
  })

  test('TypeScript type-only imports use the exported types subpath', () => {
    for (const name of ['sdk-typescript', 'sdk-reference']) {
      expect(read(name)).toContain("from '@optraze/convomem-sdk/types'")
      expect(read(name)).not.toMatch(
        /import type\s*\{[^}]*\}\s*from '@optraze\/convomem-sdk'/s
      )
    }
  })

  test('every Rust Message literal accounts for optional language metadata', () => {
    for (const { text } of docs) {
      for (const match of text.matchAll(/\bMessage\s*\{([^}]+)\}/g)) {
        expect(match[1]).toMatch(/\.\.Default::default\(\)|\blanguage\s*:/)
      }
    }
  })

  test('capture docs distinguish acceptance from completion', () => {
    expect(read('sdk-python')).toContain(
      'get_capture_status(result.capture_id)'
    )
    expect(read('sdk-rust')).toContain('get_capture_status(&result.capture_id)')
    expect(read('sdk-typescript')).toContain(
      'getCaptureStatus(accepted.captureId)'
    )
    for (const name of sdkPages)
      expect(read(name)).not.toContain('searchable within seconds')
  })

  test('customer erasure documents conflict and external-copy limits', () => {
    expect(read('customers')).toContain('`409`')
    expect(read('customers')).toContain('outside ConvoMem')
    expect(read('customers')).not.toContain(
      'Delete a customer and all associated data'
    )
  })
})
