import { z } from 'zod'

const frontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string().optional().default(''),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  status: z.enum(['published', 'draft']).default('published'),
})

export type ContentType = 'blog' | 'docs' | 'changelog'
export type Frontmatter = z.infer<typeof frontmatterSchema>

const blogModules = import.meta.glob('/src/content/blog/*.mdx', {
  eager: true,
})
const docsModules = import.meta.glob('/src/content/docs/*.mdx', {
  eager: true,
})
const changelogModules = import.meta.glob('/src/content/changelog/*.mdx', {
  eager: true,
})

const modulesByType: Record<ContentType, Record<string, unknown>> = {
  blog: blogModules,
  docs: docsModules,
  changelog: changelogModules,
}

export interface ContentItem {
  slug: string
  frontmatter: Frontmatter
}

export function getAllContent(type: ContentType): ContentItem[] {
  const modules = modulesByType[type]
  return Object.entries(modules)
    .map(([path, mod]) => {
      const m = mod as { frontmatter?: unknown; default?: unknown }
      return {
        slug: path.split('/').pop()?.replace('.mdx', '') || '',
        frontmatter: frontmatterSchema.parse(m.frontmatter ?? {}),
      }
    })
    .filter((item) => item.frontmatter.status !== 'draft')
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    )
}

export function getContent(
  type: ContentType,
  slug: string
): ContentItem | null {
  const modules = modulesByType[type]
  const key = `/src/content/${type}/${slug}.mdx`
  const mod = modules[key] as
    | { frontmatter?: unknown; default?: unknown }
    | undefined
  if (!mod) return null
  return {
    slug,
    frontmatter: frontmatterSchema.parse(mod.frontmatter ?? {}),
  }
}
