import { useMemo } from 'react'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'

import { DocsLayout } from '@/features/docs/components/docs-layout'
import { DocPager } from '@/features/docs/components/docs-pager'
import {
  buildDocSearchIndex,
  getDocAdjacent,
  getDocGroup,
  resolveDocsNav,
} from '@/features/docs/nav'
import { getContentMeta, getMdxComponent } from '@/lib/content'
import { getOgImageUrl } from '@/lib/og'
import { createPageMeta, getSeoUrl, SITE_NAME } from '@/lib/seo'

export const Route = createFileRoute('/docs/$slug')({
  loader: ({ params }) => {
    const doc = getContentMeta('docs', params.slug)
    if (!doc) throw notFound()
    return doc
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const { slug, frontmatter } = loaderData
    const ogImage = getOgImageUrl({
      type: 'docs',
      slug,
      title: frontmatter.title,
      description: frontmatter.description,
    })
    const url = getSeoUrl(`/docs/${slug}`)
    const group = getDocGroup(slug)

    return {
      meta: createPageMeta({
        title: `${frontmatter.title} — ${SITE_NAME} Docs`,
        description: frontmatter.description,
        path: `/docs/${slug}`,
        ogImage,
      }),
      links: [{ rel: 'canonical', href: url }],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: frontmatter.title,
            description: frontmatter.description,
            url,
            ...(frontmatter.date && { datePublished: frontmatter.date }),
            ...(frontmatter.updated && { dateModified: frontmatter.updated }),
            author: { '@type': 'Organization', name: SITE_NAME },
          }),
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Docs',
                item: getSeoUrl('/docs'),
              },
              ...(group
                ? [{ '@type': 'ListItem', position: 2, name: group }]
                : []),
              {
                '@type': 'ListItem',
                position: group ? 3 : 2,
                name: frontmatter.title,
                item: url,
              },
            ],
          }),
        },
      ],
    }
  },
  component: DocPage,
})

function DocPage() {
  const { slug, frontmatter, toc } = Route.useLoaderData()

  const nav = useMemo(() => resolveDocsNav(), [])
  const searchIndex = useMemo(() => buildDocSearchIndex(), [])
  const group = getDocGroup(slug)
  const { prev, next } = getDocAdjacent(slug)
  const MDXContent = getMdxComponent('docs', slug)
  if (!MDXContent) throw notFound()

  return (
    <DocsLayout
      nav={nav}
      searchIndex={searchIndex}
      currentSlug={slug}
      toc={toc}
    >
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <Link to="/docs" className="hover:text-foreground">
          Docs
        </Link>
        {group && (
          <>
            <span>/</span>
            <span>{group}</span>
          </>
        )}
        <span>/</span>
        <span className="text-foreground">{frontmatter.title}</span>
      </nav>

      <article className="mt-5">
        <h1 className="text-[clamp(26px,4vw,38px)] font-semibold tracking-[-0.02em] text-foreground">
          {frontmatter.title}
        </h1>
        <p className="mt-2 text-[15px] leading-7 text-muted-foreground">
          {frontmatter.description}
        </p>
        <div className="prose mt-8 max-w-none">
          <MDXContent />
        </div>
      </article>

      <DocPager prev={prev} next={next} />
    </DocsLayout>
  )
}
