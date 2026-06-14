import { z } from 'zod'

import type { Toc } from '@stefanprobst/rehype-extract-toc'
import type React from 'react'

export type { Toc, TocEntry } from '@stefanprobst/rehype-extract-toc'

const isValidDate = (s: string) => s === '' || !Number.isNaN(Date.parse(s))

const frontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string().optional().default('').refine(isValidDate, 'Invalid date'),
  updated: z.string().refine(isValidDate, 'Invalid date').optional(),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  cover: z.string().optional(),
  status: z.enum(['published', 'draft']).default('published'),
})

export type ContentType = 'blog' | 'docs' | 'changelog'
export type Frontmatter = z.infer<typeof frontmatterSchema>

interface MdxModule {
  default: React.ComponentType
  frontmatter?: unknown
  tableOfContents?: Toc
}

const blogModules = import.meta.glob('/src/content/blog/*.mdx', {
  eager: true,
}) as Record<string, MdxModule>
const docsModules = import.meta.glob('/src/content/docs/*.mdx', {
  eager: true,
}) as Record<string, MdxModule>
const changelogModules = import.meta.glob('/src/content/changelog/*.mdx', {
  eager: true,
}) as Record<string, MdxModule>

const blogRaw = import.meta.glob('/src/content/blog/*.mdx', {
  query: '?raw',
  eager: true,
})
const docsRaw = import.meta.glob('/src/content/docs/*.mdx', {
  query: '?raw',
  eager: true,
})
const changelogRaw = import.meta.glob('/src/content/changelog/*.mdx', {
  query: '?raw',
  eager: true,
})

const modulesByType: Record<ContentType, Record<string, MdxModule>> = {
  blog: blogModules,
  docs: docsModules,
  changelog: changelogModules,
}
const rawByType: Record<ContentType, Record<string, unknown>> = {
  blog: blogRaw,
  docs: docsRaw,
  changelog: changelogRaw,
}

export interface ContentMeta {
  slug: string
  frontmatter: Frontmatter
  readingTime: number
  toc: Toc
}

const includeDrafts = import.meta.env.DEV

function slugFromPath(path: string): string {
  return path.split('/').pop()?.replace('.mdx', '') ?? ''
}

function readingTimeFor(type: ContentType, slug: string): number {
  const mod = rawByType[type][`/src/content/${type}/${slug}.mdx`] as
    | { default?: string }
    | undefined
  const raw = mod?.default
  if (typeof raw !== 'string') return 0
  const body = raw
    .replace(/^---[\s\S]*?\n---/, '')
    .replace(/```[\s\S]*?```/g, '')
  const words = body.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

function toMeta(type: ContentType, path: string, mod: MdxModule): ContentMeta {
  const slug = slugFromPath(path)
  return {
    slug,
    frontmatter: frontmatterSchema.parse(mod.frontmatter ?? {}),
    readingTime: readingTimeFor(type, slug),
    toc: mod.tableOfContents ?? [],
  }
}

function byDateDesc(a: ContentMeta, b: ContentMeta): number {
  const ta = a.frontmatter.date ? Date.parse(a.frontmatter.date) : 0
  const tb = b.frontmatter.date ? Date.parse(b.frontmatter.date) : 0
  if (tb !== ta) return tb - ta
  return a.frontmatter.title.localeCompare(b.frontmatter.title)
}

/** All non-draft (in prod) items for a type, newest first. */
export function getAllContent(type: ContentType): ContentMeta[] {
  return Object.entries(modulesByType[type])
    .map(([path, mod]) => toMeta(type, path, mod))
    .filter((item) => includeDrafts || item.frontmatter.status !== 'draft')
    .sort(byDateDesc)
}

/** Serializable metadata for a single item (safe to return from a loader). */
export function getContentMeta(
  type: ContentType,
  slug: string
): ContentMeta | null {
  const mod = modulesByType[type][`/src/content/${type}/${slug}.mdx`]
  if (!mod) return null
  const meta = toMeta(type, slug, mod)
  if (!includeDrafts && meta.frontmatter.status === 'draft') return null
  return meta
}

/** The compiled MDX component — resolve in the component body, not the loader. */
export function getMdxComponent(
  type: ContentType,
  slug: string
): React.ComponentType | null {
  return (
    modulesByType[type][`/src/content/${type}/${slug}.mdx`]?.default ?? null
  )
}

/** Previous/next item within an ordered slug list. */
export function getAdjacent(
  orderedSlugs: string[],
  slug: string
): { prev: string | null; next: string | null } {
  const i = orderedSlugs.indexOf(slug)
  if (i === -1) return { prev: null, next: null }
  return {
    prev: i > 0 ? orderedSlugs[i - 1] : null,
    next: i < orderedSlugs.length - 1 ? orderedSlugs[i + 1] : null,
  }
}
