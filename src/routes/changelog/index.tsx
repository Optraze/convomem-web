import { createFileRoute, Link } from '@tanstack/react-router'

import { ResourceLayout } from '@/components/resource-layout'
import { collectionSchema } from '@/lib/collection-schema'
import { getAllContent, getMdxComponent } from '@/lib/content'
import {
  createPageMeta,
  getSeoUrl,
  SITE_NAME,
  serializeStructuredData,
} from '@/lib/seo'

export const Route = createFileRoute('/changelog/')({
  head: () => ({
    meta: createPageMeta({
      title: `Changelog — ${SITE_NAME}`,
      description:
        "What's new in ConvoMem — product updates, features, and improvements.",
      path: '/changelog',
    }),
    links: [{ rel: 'canonical', href: getSeoUrl('/changelog') }],
    scripts: [
      {
        type: 'application/ld+json',
        children: serializeStructuredData(
          collectionSchema({
            title: 'ConvoMem release notes',
            description:
              'Product updates, improvements, and fixes for ConvoMem.',
            path: '/changelog',
            items: getAllContent('changelog').map((entry) => ({
              title: entry.frontmatter.title,
              path: `/changelog/${entry.slug}`,
            })),
          })
        ),
      },
    ],
  }),
  component: ChangelogIndex,
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

function ChangelogIndex() {
  const entries = getAllContent('changelog')
  return (
    <ResourceLayout active="changelog">
      <main className="editorial-main" id="resource-content">
        <header>
          <p className="editorial-kicker">Changelog</p>
          <h1 className="editorial-title">Product updates.</h1>
          <p className="editorial-intro">
            New capabilities, fixes, and improvements to ConvoMem. Every
            release, in one place.
          </p>
        </header>
        <div className="release-layout">
          <aside className="release-index">
            <div>
              <p>Releases</p>
              <nav aria-label="Jump to a release">
                {entries.map((entry) => (
                  <a key={entry.slug} href={`#release-${entry.slug}`}>
                    {entry.frontmatter.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
          <div>
            {entries.map((entry, index) => {
              const MDXContent = getMdxComponent('changelog', entry.slug)
              return (
                <section
                  key={entry.slug}
                  id={`release-${entry.slug}`}
                  className="release-entry"
                >
                  <header>
                    <div className="journal-meta">
                      {entry.frontmatter.date && (
                        <time dateTime={entry.frontmatter.date}>
                          {formatDate(entry.frontmatter.date)}
                        </time>
                      )}
                      {index === 0 && (
                        <span className="release-latest">Latest release</span>
                      )}
                    </div>
                    <h2>
                      <Link to="/changelog/$slug" params={{ slug: entry.slug }}>
                        {entry.frontmatter.title}
                      </Link>
                    </h2>
                    <p>{entry.frontmatter.description}</p>
                  </header>
                  {MDXContent && (
                    <div className="prose prose-compact max-w-none">
                      <MDXContent />
                    </div>
                  )}
                </section>
              )
            })}
            {entries.length === 0 && <p>No releases yet.</p>}
          </div>
        </div>
      </main>
    </ResourceLayout>
  )
}
