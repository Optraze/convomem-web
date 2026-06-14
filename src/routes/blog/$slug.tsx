import { createFileRoute, Link, notFound } from '@tanstack/react-router'

import {
  getAdjacent,
  getAllContent,
  getContentMeta,
  getMdxComponent,
} from '@/lib/content'
import { getOgImageUrl } from '@/lib/og'
import { createPageMeta, getSeoUrl, SITE_NAME } from '@/lib/seo'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const Route = createFileRoute('/blog/$slug')({
  loader: ({ params }) => {
    const post = getContentMeta('blog', params.slug)
    if (!post) throw notFound()
    return post
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const { slug, frontmatter } = loaderData
    const url = getSeoUrl(`/blog/${slug}`)
    const ogImage = getOgImageUrl({
      type: 'blog',
      slug,
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
      links: [{ rel: 'canonical', href: url }],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: frontmatter.title,
            description: frontmatter.description,
            image: ogImage,
            url,
            mainEntityOfPage: { '@type': 'WebPage', '@id': url },
            ...(frontmatter.date && { datePublished: frontmatter.date }),
            dateModified: frontmatter.updated || frontmatter.date,
            author: frontmatter.author
              ? { '@type': 'Person', name: frontmatter.author }
              : { '@type': 'Organization', name: SITE_NAME },
            publisher: { '@type': 'Organization', name: SITE_NAME },
          }),
        },
      ],
    }
  },
  component: BlogPost,
})

function BlogPost() {
  const { slug, frontmatter, readingTime } = Route.useLoaderData()

  const order = getAllContent('blog').map((p) => p.slug)
  const { prev, next } = getAdjacent(order, slug)
  const prevMeta = prev ? getContentMeta('blog', prev) : null
  const nextMeta = next ? getContentMeta('blog', next) : null

  const MDXContent = getMdxComponent('blog', slug)
  if (!MDXContent) throw notFound()

  return (
    <main className="mx-auto max-w-3xl px-5 pt-28 pb-14 sm:px-8 sm:pt-32 sm:pb-20">
      <Link
        to="/blog"
        className="font-mono text-[11px] tracking-[0.22em] text-hint/90 uppercase hover:text-foreground"
      >
        ← Blog
      </Link>
      <article className="mt-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {frontmatter.date && (
            <time dateTime={frontmatter.date}>
              {formatDate(frontmatter.date)}
            </time>
          )}
          {frontmatter.author && (
            <>
              <span>·</span>
              <span>{frontmatter.author}</span>
            </>
          )}
          <span>·</span>
          <span>{readingTime} min read</span>
        </div>
        <h1 className="mt-3 text-[clamp(24px,4vw,36px)] font-semibold tracking-[-0.02em] text-foreground">
          {frontmatter.title}
        </h1>
        <p className="mt-2 text-[15px] leading-7 text-muted-foreground">
          {frontmatter.description}
        </p>
        {frontmatter.tags && frontmatter.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="prose mt-8 max-w-none">
          <MDXContent />
        </div>
      </article>

      {(prevMeta || nextMeta) && (
        <nav className="mt-12 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
          {prevMeta ? (
            <Link
              to="/blog/$slug"
              params={{ slug: prevMeta.slug }}
              className="rounded-lg border border-border p-4 transition-colors hover:bg-muted/40"
            >
              <span className="text-xs text-muted-foreground">← Previous</span>
              <span className="mt-1 block font-medium text-foreground">
                {prevMeta.frontmatter.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {nextMeta ? (
            <Link
              to="/blog/$slug"
              params={{ slug: nextMeta.slug }}
              className="rounded-lg border border-border p-4 text-right transition-colors hover:bg-muted/40"
            >
              <span className="text-xs text-muted-foreground">Next →</span>
              <span className="mt-1 block font-medium text-foreground">
                {nextMeta.frontmatter.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </main>
  )
}
