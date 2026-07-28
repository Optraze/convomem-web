import { createFileRoute, Link, notFound } from '@tanstack/react-router'

import { AuthorByline } from '@/components/author-byline'
import { ContentFooter } from '@/components/content-footer'
import { CopyMarkdownButton } from '@/components/copy-markdown-button'
import { ReadingProgress } from '@/components/reading-progress'
import { OnThisPage } from '@/features/docs/components/on-this-page'
import {
  getAdjacent,
  getAllContent,
  getContentMeta,
  getMdxComponent,
} from '@/lib/content'
import { getOgImageUrl } from '@/lib/og'
import { createPageMeta, getSeoUrl, SITE_NAME } from '@/lib/seo'

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
      links: [
        { rel: 'canonical', href: url },
        {
          rel: 'alternate',
          type: 'text/markdown',
          href: getSeoUrl(`/blog/${slug}.md`),
        },
      ],
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
  const { slug, frontmatter, readingTime, toc } = Route.useLoaderData()

  const order = getAllContent('blog').map((p) => p.slug)
  const { prev, next } = getAdjacent(order, slug)
  const prevMeta = prev ? getContentMeta('blog', prev) : null
  const nextMeta = next ? getContentMeta('blog', next) : null

  const MDXContent = getMdxComponent('blog', slug)
  if (!MDXContent) throw notFound()

  return (
    <>
      <ReadingProgress />
      <main className="mx-auto max-w-6xl px-5 pt-28 pb-14 sm:px-8 sm:pt-32 sm:pb-20">
        {/* Header, article and pager share one column so their left edges line
            up; the TOC sits in a second column beside all of them. */}
        <div className="gap-12 lg:grid lg:grid-cols-[minmax(0,1fr)_200px]">
          <div className="min-w-0 max-w-3xl">
            <header>
              <Link
                to="/blog"
                className="font-mono text-[11px] tracking-[0.22em] text-hint/90 uppercase hover:text-foreground"
              >
                ← Blog
              </Link>

              {frontmatter.tags && frontmatter.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {frontmatter.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] tracking-wide text-muted-foreground uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="mt-4 text-[clamp(30px,5vw,46px)] leading-[1.1] font-semibold tracking-[-0.03em] text-balance text-foreground">
                {frontmatter.title}
              </h1>
              <p className="mt-4 text-[17px] leading-8 text-pretty text-muted-foreground">
                {frontmatter.description}
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
                <AuthorByline
                  author={frontmatter.author}
                  date={frontmatter.date}
                  readingTime={readingTime}
                />
                <CopyMarkdownButton mdUrl={`/blog/${slug}.md`} />
              </div>
            </header>

            <article className="mt-12">
              <div className="prose max-w-none">
                <MDXContent />
              </div>
            </article>

            {(prevMeta || nextMeta) && (
              <nav className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
                {prevMeta ? (
                  <Link
                    to="/blog/$slug"
                    params={{ slug: prevMeta.slug }}
                    className="group rounded-lg border border-border p-4 transition-colors hover:border-foreground/15 hover:bg-muted/40"
                  >
                    <span className="text-xs text-muted-foreground">
                      ← Previous
                    </span>
                    <span className="mt-1 block font-medium text-foreground transition-transform group-hover:-translate-x-0.5">
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
                    className="group rounded-lg border border-border p-4 text-right transition-colors hover:border-foreground/15 hover:bg-muted/40"
                  >
                    <span className="text-xs text-muted-foreground">
                      Next →
                    </span>
                    <span className="mt-1 block font-medium text-foreground transition-transform group-hover:translate-x-0.5">
                      {nextMeta.frontmatter.title}
                    </span>
                  </Link>
                ) : (
                  <span />
                )}
              </nav>
            )}
          </div>

          {/* Desktop only: on narrow screens the article itself is the map. */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <OnThisPage toc={toc} />
            </div>
          </aside>
        </div>
      </main>
      <ContentFooter />
    </>
  )
}
