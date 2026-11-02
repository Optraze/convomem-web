import { describe, expect, test } from 'bun:test'

import { collectionSchema } from '../src/lib/collection-schema'
import { homeSchema } from '../src/lib/home-schema'
import {
  createPageMeta,
  getSeoUrl,
  ORGANIZATION_ID,
  organizationSchema,
  SITE_ORIGIN,
  serializeStructuredData,
  WEBSITE_ID,
} from '../src/lib/seo'

describe('public search metadata', () => {
  test('canonical identities stay absolute on the public origin in previews', () => {
    expect(getSeoUrl('/docs/capture')).toBe(`${SITE_ORIGIN}/docs/capture`)
    expect(getSeoUrl('/#service')).toBe(`${SITE_ORIGIN}/#service`)
    expect(getSeoUrl()).toBe(`${SITE_ORIGIN}/`)
  })

  test('inner pages own their social labels and article type', () => {
    const meta = createPageMeta({
      title: 'Capture — ConvoMem Docs',
      description: 'Capture API guide.',
      path: '/docs/capture',
      ogImage: getSeoUrl('/og/docs/capture.png'),
      type: 'article',
    })
    const value = (key) =>
      meta.find((item) => item.name === key || item.property === key)?.content
    expect(value('og:image:alt')).toBe('Capture — ConvoMem Docs')
    expect(value('twitter:image:alt')).toBe('Capture — ConvoMem Docs')
    expect(value('og:type')).toBe('article')
    expect(value('og:image')).toBe(`${SITE_ORIGIN}/og/docs/capture.png`)
    expect(value('og:url')).toBe(`${SITE_ORIGIN}/docs/capture`)
    expect(value('robots')).toBeUndefined()
    expect(
      createPageMeta({
        title: 'Draft',
        description: 'Draft',
        path: '/docs/draft',
        noIndex: true,
      })
    ).toContainEqual({ name: 'robots', content: 'noindex, follow' })
  })

  test('frontmatter cannot terminate a JSON-LD script', () => {
    const input = {
      headline: '</script><script>alert("x")</script>',
      description: 'Calls & chat < 5 minutes',
    }
    const serialized = serializeStructuredData(input)
    expect(serialized).not.toContain('<')
    expect(JSON.parse(serialized)).toEqual(input)
  })

  test('homepage entities resolve to one public organization and website', () => {
    expect(organizationSchema['@id']).toBe(ORGANIZATION_ID)
    const website = homeSchema['@graph'].find(
      (node) => node['@type'] === 'WebSite'
    )
    const service = homeSchema['@graph'].find(
      (node) => node['@type'] === 'Service'
    )
    const page = homeSchema['@graph'].find(
      (node) => node['@type'] === 'WebPage'
    )
    expect(website['@id']).toBe(WEBSITE_ID)
    expect(website.publisher['@id']).toBe(organizationSchema['@id'])
    expect(service.provider['@id']).toBe(organizationSchema['@id'])
    expect(page.isPartOf['@id']).toBe(website['@id'])
    expect(page.about['@id']).toBe(service['@id'])
  })
})

describe('resource archive schema', () => {
  test('archive entries preserve their published order and canonical URLs', () => {
    const schema = collectionSchema({
      title: 'Releases',
      description: 'Published releases',
      path: '/changelog',
      items: [
        { title: 'v1.3.3', path: '/changelog/v1.3.3' },
        { title: 'v1.2.0', path: '/changelog/v1.2.0' },
      ],
    })
    expect(schema.url).toBe(`${SITE_ORIGIN}/changelog`)
    expect(schema.isPartOf['@id']).toBe(WEBSITE_ID)
    expect(schema.mainEntity.numberOfItems).toBe(2)
    expect(
      schema.mainEntity.itemListElement.map((item) => [item.position, item.url])
    ).toEqual([
      [1, `${SITE_ORIGIN}/changelog/v1.3.3`],
      [2, `${SITE_ORIGIN}/changelog/v1.2.0`],
    ])
    expect(
      collectionSchema({
        title: 'Empty',
        description: 'Empty archive',
        path: '/blog',
        items: [],
      }).mainEntity.numberOfItems
    ).toBe(0)
  })
})
