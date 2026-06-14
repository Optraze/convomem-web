import {
  createFileRoute,
  Link,
  notFound,
  useLoaderData,
} from '@tanstack/react-router'
import { getContent } from '@/lib/content'
import { getOgImageUrl } from '@/lib/og'
import { createPageMeta, getSeoUrl, SITE_NAME } from '@/lib/seo'

export const Route = createFileRoute('/docs/$slug')({
  loader: ({ params }) => {
    const doc = getContent('docs', params.slug)
    if (!doc) throw notFound()
    return doc
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const { slug, frontmatter } = loaderData
    const ogImage = getOgImageUrl({
      type: 'docs',
      title: frontmatter.title,
      description: frontmatter.description,
    })

    return {
      meta: createPageMeta({
        title: `${frontmatter.title} — ${SITE_NAME}`,
        description: frontmatter.description,
        path: `/docs/${slug}`,
        ogImage,
      }),
      links: [{ rel: 'canonical', href: getSeoUrl(`/docs/${slug}`) }],
    }
  },
  component: DocPage,
})

function DocPage() {
  const data = useLoaderData({ from: '/docs/$slug' }) as {
    slug: string
    frontmatter: {
      title: string
      description: string
    }
  }
  const { slug, frontmatter } = data

  const mod = import.meta.glob('/src/content/docs/*.mdx', { eager: true })[
    `/src/content/docs/${slug}.mdx`
  ] as { default: React.ComponentType } | undefined

  if (!mod) throw notFound()
  const MDXContent = mod.default

  return (
    <main className="mx-auto max-w-3xl px-5 pt-28 pb-14 sm:px-8 sm:pt-32 sm:pb-20">
      <Link
        to="/docs"
        className="font-mono text-[11px] tracking-[0.22em] text-hint/90 uppercase hover:text-foreground"
      >
        ← Documentation
      </Link>
      <article className="mt-6">
        <h1 className="text-[clamp(24px,4vw,36px)] font-semibold tracking-[-0.02em] text-foreground">
          {frontmatter.title}
        </h1>
        <p className="mt-2 text-[15px] leading-7 text-muted-foreground">
          {frontmatter.description}
        </p>
        <div className="prose mt-8 max-w-none text-[15px] leading-7 text-foreground">
          <MDXContent />
        </div>
      </article>
    </main>
  )
}
