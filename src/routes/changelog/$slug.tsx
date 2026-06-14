import {
  createFileRoute,
  Link,
  notFound,
  useLoaderData,
} from '@tanstack/react-router'
import { getContent } from '@/lib/content'
import { getOgImageUrl } from '@/lib/og'
import { createPageMeta, getSeoUrl, SITE_NAME } from '@/lib/seo'

export const Route = createFileRoute('/changelog/$slug')({
  loader: ({ params }) => {
    const entry = getContent('changelog', params.slug)
    if (!entry) throw notFound()
    return entry
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const { slug, frontmatter } = loaderData
    const ogImage = getOgImageUrl({
      type: 'changelog',
      title: frontmatter.title,
      description: frontmatter.description,
      date: frontmatter.date,
    })

    return {
      meta: createPageMeta({
        title: `${frontmatter.title} — ${SITE_NAME}`,
        description: frontmatter.description,
        path: `/changelog/${slug}`,
        ogImage,
      }),
      links: [{ rel: 'canonical', href: getSeoUrl(`/changelog/${slug}`) }],
    }
  },
  component: ChangelogEntry,
})

function ChangelogEntry() {
  const data = useLoaderData({ from: '/changelog/$slug' }) as {
    slug: string
    frontmatter: {
      title: string
      description: string
      date?: string
    }
  }
  const { slug, frontmatter } = data

  const mod = import.meta.glob('/src/content/changelog/*.mdx', {
    eager: true,
  })[`/src/content/changelog/${slug}.mdx`] as
    | { default: React.ComponentType }
    | undefined

  if (!mod) throw notFound()
  const MDXContent = mod.default

  return (
    <main className="mx-auto max-w-3xl px-5 pt-28 pb-14 sm:px-8 sm:pt-32 sm:pb-20">
      <Link
        to="/changelog"
        className="font-mono text-[11px] tracking-[0.22em] text-hint/90 uppercase hover:text-foreground"
      >
        ← Changelog
      </Link>
      <article className="mt-6">
        <div className="flex items-center gap-3">
          <h1 className="text-[clamp(24px,4vw,36px)] font-semibold tracking-[-0.02em] text-foreground">
            {frontmatter.title}
          </h1>
          {frontmatter.date && (
            <time
              dateTime={frontmatter.date}
              className="font-mono text-xs text-muted-foreground"
            >
              {new Date(frontmatter.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}
        </div>
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
