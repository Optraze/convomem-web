import { createFileRoute, Link, notFound } from '@tanstack/react-router'

import { CopyMarkdownButton } from '@/components/copy-markdown-button'
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

export const Route = createFileRoute('/changelog/$slug')({
  loader: ({ params }) => {
    const entry = getContentMeta('changelog', params.slug)
    if (!entry) throw notFound()
    return entry
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const { slug, frontmatter } = loaderData
    const url = getSeoUrl(`/changelog/${slug}`)
    const ogImage = getOgImageUrl({
      type: 'changelog',
      slug,
      title: frontmatter.title,
      description: frontmatter.description,
      date: frontmatter.date,
    })

    return {
      meta: createPageMeta({
        title: `${frontmatter.title} — ${SITE_NAME} Changelog`,
        description: frontmatter.description,
        path: `/changelog/${slug}`,
        ogImage,
      }),
      links: [
        { rel: 'canonical', href: url },
        {
          rel: 'alternate',
          type: 'text/markdown',
          href: getSeoUrl(`/changelog/${slug}.md`),
        },
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: frontmatter.title,
            description: frontmatter.description,
            image: ogImage,
            url,
            ...(frontmatter.date && { datePublished: frontmatter.date }),
            ...(frontmatter.updated && { dateModified: frontmatter.updated }),
            author: { '@type': 'Organization', name: SITE_NAME },
          }),
        },
      ],
    }
  },
  component: ChangelogEntry,
})

function ChangelogEntry() {
  const { slug, frontmatter } = Route.useLoaderData()

  const order = getAllContent('changelog').map((e) => e.slug)
  const { prev, next } = getAdjacent(order, slug)
  const prevMeta = prev ? getContentMeta('changelog', prev) : null
  const nextMeta = next ? getContentMeta('changelog', next) : null

  const MDXContent = getMdxComponent('changelog', slug)
  if (!MDXContent) throw notFound()

  return (
    <main className="mx-auto max-w-3xl px-5 pt-28 pb-14 sm:px-8 sm:pt-32 sm:pb-20">
      <div className="flex items-center justify-between">
        <Link
          to="/changelog"
          className="font-mono text-[11px] tracking-[0.22em] text-hint/90 uppercase hover:text-foreground"
        >
          ← Changelog
        </Link>
        <CopyMarkdownButton mdUrl={`/changelog/${slug}.md`} />
      </div>
      <article className="mt-6">
        <div className="flex items-center gap-3">
          <h1 className="text-[clamp(24px,4vw,36px)] font-semibold tracking-[-0.02em] text-foreground">
            {frontmatter.title}
          </h1>
          {frontmatter.date && (
            <time
              dateTime={frontmatter.date}
              className="font-mono text-xs text-muted-foreground"
            >
              {formatDate(frontmatter.date)}
            </time>
          )}
        </div>
        <p className="mt-2 text-[15px] leading-7 text-muted-foreground">
          {frontmatter.description}
        </p>
        <div className="prose mt-8 max-w-none">
          <MDXContent />
        </div>
      </article>

      {(prevMeta || nextMeta) && (
        <nav className="mt-12 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
          {prevMeta ? (
            <Link
              to="/changelog/$slug"
              params={{ slug: prevMeta.slug }}
              className="rounded-lg border border-border p-4 transition-colors hover:bg-muted/40"
            >
              <span className="text-xs text-muted-foreground">← Newer</span>
              <span className="mt-1 block font-medium text-foreground">
                {prevMeta.frontmatter.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {nextMeta ? (
            <Link
              to="/changelog/$slug"
              params={{ slug: nextMeta.slug }}
              className="rounded-lg border border-border p-4 text-right transition-colors hover:bg-muted/40"
            >
              <span className="text-xs text-muted-foreground">Older →</span>
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
