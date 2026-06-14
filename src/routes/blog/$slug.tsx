import {
  createFileRoute,
  Link,
  notFound,
  useLoaderData,
} from '@tanstack/react-router'

import { getContent } from '@/lib/content'
import { getOgImageUrl } from '@/lib/og'
import { createPageMeta, getSeoUrl, SITE_NAME } from '@/lib/seo'

export const Route = createFileRoute('/blog/$slug')({
  loader: ({ params }) => {
    const post = getContent('blog', params.slug)
    if (!post) throw notFound()
    return post
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const { slug, frontmatter } = loaderData
    const ogImage = getOgImageUrl({
      type: 'blog',
      title: frontmatter.title,
      description: frontmatter.description,
      date: frontmatter.date,
      author: frontmatter.author,
      tags: frontmatter.tags,
    })

    return {
      meta: createPageMeta({
        title: `${frontmatter.title} — ${SITE_NAME}`,
        description: frontmatter.description,
        path: `/blog/${slug}`,
        ogImage,
      }),
      links: [{ rel: 'canonical', href: getSeoUrl(`/blog/${slug}`) }],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: frontmatter.title,
            description: frontmatter.description,
            datePublished: frontmatter.date,
            author: frontmatter.author
              ? { '@type': 'Person', name: frontmatter.author }
              : { '@type': 'Organization', name: SITE_NAME },
          }),
        },
      ],
    }
  },
  component: BlogPost,
})

function BlogPost() {
  const data = useLoaderData({ from: '/blog/$slug' }) as {
    slug: string
    frontmatter: {
      title: string
      description: string
      date: string
      author?: string
      tags?: string[]
    }
  }
  const { slug, frontmatter } = data

  const mod = import.meta.glob('/src/content/blog/*.mdx', { eager: true })[
    `/src/content/blog/${slug}.mdx`
  ] as { default: React.ComponentType } | undefined

  if (!mod) throw notFound()
  const MDXContent = mod.default

  return (
    <main className="mx-auto max-w-3xl px-5 pt-28 pb-14 sm:px-8 sm:pt-32 sm:pb-20">
      <Link
        to="/blog"
        className="font-mono text-[11px] tracking-[0.22em] text-hint/90 uppercase hover:text-foreground"
      >
        ← Blog
      </Link>
      <article className="mt-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <time dateTime={frontmatter.date}>
            {new Date(frontmatter.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {frontmatter.author && (
            <>
              <span>·</span>
              <span>{frontmatter.author}</span>
            </>
          )}
        </div>
        <h1 className="mt-3 text-[clamp(24px,4vw,36px)] font-semibold tracking-[-0.02em] text-foreground">
          {frontmatter.title}
        </h1>
        <p className="mt-2 text-[15px] leading-7 text-muted-foreground">
          {frontmatter.description}
        </p>
        {frontmatter.tags && frontmatter.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {frontmatter.tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono uppercase text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="prose mt-8 max-w-none text-[15px] leading-7 text-foreground">
          <MDXContent />
        </div>
      </article>
    </main>
  )
}
