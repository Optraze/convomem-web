import { createFileRoute, Link, notFound } from '@tanstack/react-router'

import { ArticlePager } from '@/components/article-pager'
import { CopyMarkdownButton } from '@/components/copy-markdown-button'
import { ResourceLayout } from '@/components/resource-layout'
import {
  getAdjacent,
  getAllContent,
  getContentMeta,
  getMdxComponent,
} from '@/lib/content'
import { getOgImageUrl } from '@/lib/og'
import {
  createPageMeta,
  getSeoUrl,
  ORGANIZATION_ID,
  SITE_NAME,
  serializeStructuredData,
} from '@/lib/seo'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
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
        noIndex: frontmatter.status === 'draft',
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
          children: serializeStructuredData({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: frontmatter.title,
            description: frontmatter.description,
            image: ogImage,
            url,
            publisher: { '@id': ORGANIZATION_ID },
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
    <ResourceLayout active="changelog">
      <main className="article-main release-single" id="resource-content">
        <Link to="/changelog" className="article-back">
          ← All releases
        </Link>
        <header className="article-header">
          <div className="journal-meta">
            {frontmatter.date && (
              <time dateTime={frontmatter.date}>
                {formatDate(frontmatter.date)}
              </time>
            )}
          </div>
          <h1>{frontmatter.title}</h1>
          <p className="article-description">{frontmatter.description}</p>
          <div className="article-byline">
            <span className="editorial-kicker">Release notes</span>
            <CopyMarkdownButton mdUrl={`/changelog/${slug}.md`} />
          </div>
        </header>
        <article className="prose max-w-none article-body">
          <MDXContent />
        </article>
        <ArticlePager
          section="changelog"
          prev={
            prevMeta
              ? { slug: prevMeta.slug, title: prevMeta.frontmatter.title }
              : null
          }
          next={
            nextMeta
              ? { slug: nextMeta.slug, title: nextMeta.frontmatter.title }
              : null
          }
        />
      </main>
    </ResourceLayout>
  )
}
