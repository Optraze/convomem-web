import { ArrowRight } from 'lucide-react'
import { createFileRoute, Link } from '@tanstack/react-router'

import { Logo } from '@/components/logo'
import { ResourceLayout } from '@/components/resource-layout'
import { collectionSchema } from '@/lib/collection-schema'
import { getAllContent } from '@/lib/content'
import {
  createPageMeta,
  getSeoUrl,
  SITE_NAME,
  serializeStructuredData,
} from '@/lib/seo'

export const Route = createFileRoute('/blog/')({
  head: () => ({
    meta: createPageMeta({
      title: `Blog — ${SITE_NAME}`,
      description:
        'Articles about conversational AI memory, customer intelligence, and the ConvoMem platform.',
      path: '/blog',
    }),
    links: [{ rel: 'canonical', href: getSeoUrl('/blog') }],
    scripts: [
      {
        type: 'application/ld+json',
        children: serializeStructuredData(
          collectionSchema({
            title: 'The ConvoMem journal',
            description:
              'Articles about customer memory and conversational AI.',
            path: '/blog',
            items: getAllContent('blog').map((entry) => ({
              title: entry.frontmatter.title,
              path: `/blog/${entry.slug}`,
            })),
          })
        ),
      },
    ],
  }),
  component: BlogIndex,
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

function BlogIndex() {
  const posts = getAllContent('blog')
  const [featured, ...rest] = posts
  return (
    <ResourceLayout active="blog">
      <main className="editorial-main" id="resource-content">
        <header>
          <p className="editorial-kicker">The ConvoMem journal</p>
          <h1 className="editorial-title">Inside ConvoMem.</h1>
          <p className="editorial-intro">
            Product notes and ideas on customer memory, conversational AI, and
            building with context.
          </p>
        </header>
        {featured && (
          <Link
            to="/blog/$slug"
            params={{ slug: featured.slug }}
            className="journal-feature"
          >
            <div>
              <div className="journal-meta">
                <span className="journal-label">Latest article</span>
                {featured.frontmatter.date && (
                  <time dateTime={featured.frontmatter.date}>
                    {formatDate(featured.frontmatter.date)}
                  </time>
                )}
                <span>{featured.readingTime} min read</span>
              </div>
              <h2>{featured.frontmatter.title}</h2>
              <p>{featured.frontmatter.description}</p>
              <span className="journal-read">
                Read the story <ArrowRight size={16} />
              </span>
            </div>
            <div className="journal-art" aria-hidden="true">
              <div className="journal-art-top">
                <Logo /> CUSTOMER MEMORY
              </div>
              <div className="journal-art-words">
                Every conversation.
                <br />
                Part of the same story.
              </div>
              <div className="journal-art-footer">
                <span>01 / CAPTURE</span>
                <span>02 / REMEMBER</span>
                <span>03 / RECALL</span>
              </div>
            </div>
          </Link>
        )}
        {rest.length > 0 && (
          <section className="journal-more">
            <h2>More from the journal</h2>
            <ul>
              {rest.map((post) => (
                <li key={post.slug}>
                  <Link to="/blog/$slug" params={{ slug: post.slug }}>
                    <div className="journal-meta">
                      {post.frontmatter.date && (
                        <time dateTime={post.frontmatter.date}>
                          {formatDate(post.frontmatter.date)}
                        </time>
                      )}
                      <span>{post.readingTime} min read</span>
                    </div>
                    <h3>{post.frontmatter.title}</h3>
                    <p>{post.frontmatter.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
        {posts.length === 0 && (
          <p className="editorial-intro">No articles yet.</p>
        )}
      </main>
    </ResourceLayout>
  )
}
