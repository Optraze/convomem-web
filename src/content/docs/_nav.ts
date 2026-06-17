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
    group: 'Get started',
    items: [
      { slug: 'introduction' },
      { slug: 'getting-started', label: 'Quick start' },
      { slug: 'authentication' },
    ],
  },
  {
    group: 'Concepts',
    items: [{ slug: 'memory-model', label: 'How it works' }],
  },
  {
    group: 'API reference',
    items: [
      { slug: 'capture' },
      { slug: 'memories' },
      { slug: 'customers' },
      { slug: 'conversations' },
      { slug: 'handoff' },
      { slug: 'embed' },
      { slug: 'webhooks' },
    ],
  },
  {
    group: 'SDK',
    items: [
      { slug: 'sdk-typescript', label: 'TypeScript' },
      { slug: 'sdk-python', label: 'Python' },
      { slug: 'sdk-rust', label: 'Rust' },
    ],
  },
]

/** Flat, ordered list of doc slugs (used for prev/next). */
export const docsOrder: string[] = docsNav.flatMap((g) =>
  g.items.map((i) => i.slug)
)
