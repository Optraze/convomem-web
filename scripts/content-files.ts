import { readFileSync } from 'node:fs'

import fg from 'fast-glob'
import matter from 'gray-matter'

export type ContentType = 'blog' | 'docs' | 'changelog'
export const CONTENT_TYPES: ContentType[] = ['blog', 'docs', 'changelog']

export interface ContentFrontmatter {
  title?: string
  description?: string
  date?: string
  updated?: string
  author?: string
  tags?: string[]
  status?: 'published' | 'draft'
  [key: string]: unknown
}

export interface ContentFile {
  type: ContentType
  slug: string
  path: string
  data: ContentFrontmatter
}

/** Discover MDX files for a content type, reading frontmatter via gray-matter. */
export function contentFiles(
  type: ContentType,
  { includeDrafts = false } = {}
): ContentFile[] {
  return fg
    .sync(`src/content/${type}/*.mdx`)
    .map((path) => {
      const { data } = matter(readFileSync(path, 'utf8'))
      return {
        type,
        slug: path.split('/').pop()?.replace('.mdx', '') ?? '',
        path,
        data: data as ContentFrontmatter,
      }
    })
    .filter((f) => f.slug && (includeDrafts || f.data.status !== 'draft'))
}

export function allContentFiles(opts?: {
  includeDrafts?: boolean
}): ContentFile[] {
  return CONTENT_TYPES.flatMap((type) => contentFiles(type, opts))
}

/** Best-effort last-modified date for sitemap <lastmod>. */
export function lastmodOf(file: ContentFile): string | undefined {
  return file.data.updated || file.data.date || undefined
}

/** Estimated reading time in minutes, ~200 words per minute. */
export function readingTimeOf(body: string): number {
  const words = body
    .replace(/```[\s\S]*?```/g, '')
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

/** Reading time (minutes) for every content file, keyed by type then slug. */
export function readingTimes(): Record<ContentType, Record<string, number>> {
  const result = {} as Record<ContentType, Record<string, number>>
  for (const type of CONTENT_TYPES) {
    result[type] = {}
    for (const path of fg.sync(`src/content/${type}/*.mdx`)) {
      const { content } = matter(readFileSync(path, 'utf8'))
      const slug = path.split('/').pop()?.replace('.mdx', '') ?? ''
      if (slug) result[type][slug] = readingTimeOf(content)
    }
  }
  return result
}
