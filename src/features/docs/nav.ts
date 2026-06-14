import type { Toc } from '@/lib/content'

import { docsNav, docsOrder } from '@/content/docs/_nav'
import { getContentMeta } from '@/lib/content'

export interface ResolvedNavItem {
  slug: string
  title: string
}
export interface ResolvedNavGroup {
  group: string
  items: ResolvedNavItem[]
}

/** Sidebar groups with titles resolved from frontmatter; drops missing/drafts. */
export function resolveDocsNav(): ResolvedNavGroup[] {
  return docsNav
    .map((g) => ({
      group: g.group,
      items: g.items.flatMap((i) => {
        const meta = getContentMeta('docs', i.slug)
        if (!meta) return []
        return [{ slug: i.slug, title: i.label ?? meta.frontmatter.title }]
      }),
    }))
    .filter((g) => g.items.length > 0)
}

/** Ordered slugs that actually resolve (published) — basis for prev/next. */
function resolvedOrder(): string[] {
  return docsOrder.filter((slug) => getContentMeta('docs', slug) !== null)
}

export function getDocGroup(slug: string): string | null {
  return (
    docsNav.find((g) => g.items.some((i) => i.slug === slug))?.group ?? null
  )
}

export function getDocAdjacent(slug: string): {
  prev: ResolvedNavItem | null
  next: ResolvedNavItem | null
} {
  const order = resolvedOrder()
  const i = order.indexOf(slug)
  const at = (idx: number): ResolvedNavItem | null => {
    const s = order[idx]
    if (!s) return null
    const meta = getContentMeta('docs', s)
    return meta ? { slug: s, title: meta.frontmatter.title } : null
  }
  return {
    prev: i > 0 ? at(i - 1) : null,
    next: i >= 0 && i < order.length - 1 ? at(i + 1) : null,
  }
}

export interface DocSearchEntry {
  slug: string
  title: string
  description: string
  headings: { id: string; text: string }[]
}

function flattenToc(toc: Toc, acc: { id: string; text: string }[] = []) {
  for (const entry of toc) {
    if (entry.id) acc.push({ id: entry.id, text: entry.value })
    if (entry.children) flattenToc(entry.children, acc)
  }
  return acc
}

/** Compile-time search index over docs titles + headings. */
export function buildDocSearchIndex(): DocSearchEntry[] {
  return resolvedOrder().flatMap((slug) => {
    const meta = getContentMeta('docs', slug)
    if (!meta) return []
    return [
      {
        slug,
        title: meta.frontmatter.title,
        description: meta.frontmatter.description,
        headings: flattenToc(meta.toc),
      },
    ]
  })
}
