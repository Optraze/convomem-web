import { createFileRoute, Link } from '@tanstack/react-router'

import { getAllContent } from '@/lib/content'
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

function ChangelogIndex() {
  const entries = getAllContent('changelog')

  return (
    <main className="mx-auto max-w-3xl px-5 pt-28 pb-14 sm:px-8 sm:pt-32 sm:pb-20">
      <p className="font-mono text-[11px] tracking-[0.22em] text-hint/90 uppercase">
        Changelog
      </p>
      <h1 className="mt-4 text-[clamp(28px,5vw,44px)] font-semibold tracking-[-0.03em] text-foreground">
        What's new
      </h1>
      <p className="mt-3 max-w-md text-[15px] leading-7 text-muted-foreground">
        Product updates, features, and improvements.
      </p>

      <div className="mt-10 space-y-8">
        {entries.map((entry) => (
          <Link
            key={entry.slug}
            to="/changelog/$slug"
            params={{ slug: entry.slug }}
            className="block rounded-lg border border-border p-5 transition-colors hover:bg-muted/40"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-foreground">
                {entry.frontmatter.title}
              </span>
              {entry.frontmatter.date && (
                <time
                  dateTime={entry.frontmatter.date}
                  className="text-xs text-muted-foreground"
                >
                  {new Date(entry.frontmatter.date).toLocaleDateString(
                    'en-US',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  )}
                </time>
              )}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {entry.frontmatter.description}
            </p>
          </Link>
        ))}
        {entries.length === 0 && (
          <p className="text-sm text-muted-foreground">No entries yet.</p>
        )}
      </div>
    </main>
  )
}
