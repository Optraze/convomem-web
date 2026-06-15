/**
 * Docs sidebar structure. Order here drives the sidebar, breadcrumbs, prev/next
 * pagination, and the search index. Each slug must map to an MDX file in this
 * directory. Adding a doc = adding a line.
 */
export interface DocNavItem {
  slug: string
  /** Override the sidebar label; defaults to the doc's frontmatter title. */
  label?: string
}

export interface DocNavGroup {
  group: string
  items: DocNavItem[]
}

export const docsNav: DocNavGroup[] = [
  {
    group: 'Getting started',
    items: [
      { slug: 'introduction' },
      { slug: 'installation' },
      { slug: 'getting-started', label: 'Quick start' },
    ],
  },
  {
    group: 'Core concepts',
    items: [{ slug: 'memory-model' }, { slug: 'retrieval' }],
  },
  {
    group: 'SDK & API',
    items: [
      { slug: 'sdk-reference', label: 'SDK reference' },
      { slug: 'capture' },
      { slug: 'customers' },
      { slug: 'memories' },
      { slug: 'conversations' },
      { slug: 'embed' },
    ],
  },
  {
    group: 'Guides',
    items: [{ slug: 'authentication' }, { slug: 'webhooks' }],
  },
]

/** Flat, ordered list of doc slugs (used for prev/next). */
export const docsOrder: string[] = docsNav.flatMap((g) =>
  g.items.map((i) => i.slug)
)
