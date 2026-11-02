import { createFileRoute, Link, notFound } from '@tanstack/react-router'

import { ArticlePager } from '@/components/article-pager'
import { AuthorByline } from '@/components/author-byline'
import { CopyMarkdownButton } from '@/components/copy-markdown-button'
import { ReadingProgress } from '@/components/reading-progress'
import { ResourceLayout } from '@/components/resource-layout'
import { OnThisPage } from '@/features/docs/components/on-this-page'
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
        noIndex: frontmatter.status === 'draft',
        type: 'article',
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
          children: serializeStructuredData({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: frontmatter.title,
            description: frontmatter.description,
            image: ogImage,
            url,
            publisher: { '@id': ORGANIZATION_ID },
            mainEntityOfPage: { '@type': 'WebPage', '@id': url },
            ...(frontmatter.date && { datePublished: frontmatter.date }),
            dateModified: frontmatter.updated || frontmatter.date,
            author: frontmatter.author
              ? { '@type': 'Person', name: frontmatter.author }
              : { '@type': 'Organization', name: SITE_NAME },
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
    <ResourceLayout active="blog">
      <ReadingProgress />
      <main className="article-main" id="resource-content">
        <Link to="/blog" className="article-back">
          ← All articles
        </Link>
        <header className="article-header">
          {frontmatter.tags && (
            <div className="article-tags">
              {frontmatter.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          )}
          <h1>{frontmatter.title}</h1>
          <p className="article-description">{frontmatter.description}</p>
          <div className="article-byline">
            <AuthorByline
              author={frontmatter.author}
              date={frontmatter.date}
              readingTime={readingTime}
            />
            <CopyMarkdownButton mdUrl={`/blog/${slug}.md`} />
          </div>
        </header>
        <div className="article-grid">
          <div className="article-body">
            <article className="prose max-w-none">
              <MDXContent />
            </article>
            <ArticlePager
              section="blog"
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
          </div>
          <aside className="article-toc">
            <div>
              <OnThisPage toc={toc} />
            </div>
          </aside>
        </div>
      </main>
    </ResourceLayout>
  )
}
