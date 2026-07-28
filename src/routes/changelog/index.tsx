import { createFileRoute, Link } from '@tanstack/react-router'

import { ContentFooter } from '@/components/content-footer'
import { getAllContent, getMdxComponent } from '@/lib/content'
import { createPageMeta, getSeoUrl, SITE_NAME } from '@/lib/seo'

export const Route = createFileRoute('/changelog/')({
  head: () => ({
    meta: createPageMeta({
      title: `Changelog — ${SITE_NAME}`,
      description:
        "What's new in ConvoMem — product updates, features, and improvements.",
      path: '/changelog',
    }),
    links: [{ rel: 'canonical', href: getSeoUrl('/changelog') }],
  }),
  component: ChangelogIndex,
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function ChangelogIndex() {
  const entries = getAllContent('changelog')

  return (
    <>
      <main className="mx-auto max-w-4xl px-5 pt-28 pb-14 sm:px-8 sm:pt-32 sm:pb-20">
        <p className="font-mono text-[11px] tracking-[0.22em] text-hint/90 uppercase">
          Changelog
        </p>
        <h1 className="mt-4 text-[clamp(28px,5vw,44px)] font-semibold tracking-[-0.03em] text-foreground">
          What's new
        </h1>
        <p className="mt-3 max-w-md text-[15px] leading-7 text-muted-foreground">
          Product updates, features, and improvements. Newest first.
        </p>

        {/* Full entries render inline on a single timeline: a changelog is read
            by scanning several releases at once, not by opening them one by
            one. Per-version pages still exist for deep links and sharing. */}
        <div className="mt-14 sm:pl-8">
          {entries.map((entry, i) => {
            const MDXContent = getMdxComponent('changelog', entry.slug)

            return (
              <section
                key={entry.slug}
                className="relative pb-14 sm:border-l sm:border-border sm:pl-10 last:pb-0"
              >
                {/* Timeline node, aligned to the version heading. */}
                <span
                  aria-hidden="true"
                  className="absolute -left-[5px] top-1.5 hidden size-2.5 rounded-full border-2 border-background bg-foreground/30 sm:block"
                />

                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <Link
                    to="/changelog/$slug"
                    params={{ slug: entry.slug }}
                    className="font-mono text-lg font-semibold tracking-tight text-foreground hover:underline"
                  >
                    {entry.frontmatter.title}
                  </Link>
                  {i === 0 && (
                    <span className="rounded-full bg-foreground px-2 py-0.5 font-mono text-[10px] tracking-wide text-background uppercase">
                      Latest
                    </span>
                  )}
                  {entry.frontmatter.date && (
                    <time
                      dateTime={entry.frontmatter.date}
                      className="text-xs text-muted-foreground"
                    >
                      {formatDate(entry.frontmatter.date)}
                    </time>
                  )}
                </div>

                <p className="mt-2 max-w-2xl text-[15px] leading-7 text-pretty text-muted-foreground">
                  {entry.frontmatter.description}
                </p>

                {MDXContent && (
                  <div className="prose prose-compact mt-6 max-w-none">
                    <MDXContent />
                  </div>
                )}
              </section>
            )
          })}

          {entries.length === 0 && (
            <p className="text-sm text-muted-foreground">No entries yet.</p>
          )}
        </div>
      </main>
      <ContentFooter />
    </>
  )
}
