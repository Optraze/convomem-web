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

function BlogIndex() {
  const posts = getAllContent('blog')

  return (
    <>
      <main className="mx-auto max-w-3xl px-5 pt-28 pb-14 sm:px-8 sm:pt-32 sm:pb-20">
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

        <div className="mt-10 space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="group block rounded-lg border border-border p-5 transition-colors hover:border-foreground/15 hover:bg-muted/40"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {post.frontmatter.date && (
                  <time dateTime={post.frontmatter.date}>
                    {new Date(post.frontmatter.date).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </time>
                )}
                <span>·</span>
                <span>{post.readingTime} min read</span>
                {post.frontmatter.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-2 flex items-start justify-between gap-4">
                <h2 className="text-lg font-semibold text-foreground transition-transform group-hover:translate-x-0.5">
                  {post.frontmatter.title}
                </h2>
                <ArrowRight
                  size={16}
                  className="mt-1 shrink-0 text-hint opacity-0 transition-all -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100"
                />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {post.frontmatter.description}
              </p>
            </Link>
          ))}
          {posts.length === 0 && (
            <p className="text-sm text-muted-foreground">No posts yet.</p>
          )}
        </div>
      </main>
      <ContentFooter />
    </>
  )
}
