import { ArrowRight } from 'lucide-react'
import { createFileRoute, Link } from '@tanstack/react-router'

import { ContentFooter } from '@/components/content-footer'
import { getAllContent } from '@/lib/content'
import { createPageMeta, getSeoUrl, SITE_NAME } from '@/lib/seo'

export const Route = createFileRoute('/blog/')({
  head: () => ({
    meta: createPageMeta({
      title: `Blog — ${SITE_NAME}`,
      description:
        'Articles about conversational AI memory, customer intelligence, and the ConvoMem platform.',
      path: '/blog',
    }),
    links: [{ rel: 'canonical', href: getSeoUrl('/blog') }],
  }),
  component: BlogIndex,
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function BlogIndex() {
  const posts = getAllContent('blog')
  // Newest post gets the lead slot; the rest fall into a scannable list.
  const [featured, ...rest] = posts

  return (
    <>
      <main className="mx-auto max-w-4xl px-5 pt-28 pb-14 sm:px-8 sm:pt-32 sm:pb-20">
        <p className="font-mono text-[11px] tracking-[0.22em] text-hint/90 uppercase">
          Blog
        </p>
        <h1 className="mt-4 text-[clamp(28px,5vw,44px)] font-semibold tracking-[-0.03em] text-foreground">
          Latest articles
        </h1>
        <p className="mt-3 max-w-md text-[15px] leading-7 text-muted-foreground">
          Insights on conversational AI memory, customer intelligence, and
          building with ConvoMem.
        </p>

        {featured && (
          <Link
            to="/blog/$slug"
            params={{ slug: featured.slug }}
            className="group mt-12 block rounded-xl border border-border bg-card p-6 transition-colors hover:border-foreground/20 sm:p-8"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-foreground px-2 py-0.5 font-mono text-[10px] tracking-wide text-background uppercase">
                Latest
              </span>
              {featured.frontmatter.date && (
                <time dateTime={featured.frontmatter.date}>
                  {formatDate(featured.frontmatter.date)}
                </time>
              )}
              <span aria-hidden="true">·</span>
              <span>{featured.readingTime} min read</span>
            </div>
            <h2 className="mt-4 text-[clamp(20px,3vw,28px)] leading-tight font-semibold tracking-[-0.02em] text-balance text-foreground">
              {featured.frontmatter.title}
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-pretty text-muted-foreground">
              {featured.frontmatter.description}
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
              Read article
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </span>
          </Link>
        )}

        {rest.length > 0 && (
          <div className="mt-14">
            <h2 className="font-mono text-[11px] tracking-[0.22em] text-hint/90 uppercase">
              More articles
            </h2>
            <ul className="mt-2 divide-y divide-border">
              {rest.map((post) => (
                <li key={post.slug}>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="group flex items-start justify-between gap-6 py-5 transition-colors hover:bg-muted/30"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        {post.frontmatter.date && (
                          <time dateTime={post.frontmatter.date}>
                            {formatDate(post.frontmatter.date)}
                          </time>
                        )}
                        <span aria-hidden="true">·</span>
                        <span>{post.readingTime} min read</span>
                        {post.frontmatter.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="mt-1.5 font-semibold text-foreground">
                        {post.frontmatter.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {post.frontmatter.description}
                      </p>
                    </div>
                    <ArrowRight
                      size={16}
                      className="mt-1 shrink-0 text-hint opacity-0 transition-all -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {posts.length === 0 && (
          <p className="mt-10 text-sm text-muted-foreground">No posts yet.</p>
        )}
      </main>
      <ContentFooter />
    </>
  )
}
