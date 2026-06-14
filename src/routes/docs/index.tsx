import { createFileRoute, Link } from '@tanstack/react-router'
import { getAllContent } from '@/lib/content'
import { createPageMeta, getSeoUrl, SITE_NAME } from '@/lib/seo'

export const Route = createFileRoute('/docs/')({
  head: () => ({
    meta: createPageMeta({
      title: `Documentation — ${SITE_NAME}`,
      description:
        'Guides and reference documentation for the ConvoMem platform.',
      path: '/docs',
    }),
    links: [{ rel: 'canonical', href: getSeoUrl('/docs') }],
  }),
  component: DocsIndex,
})

function DocsIndex() {
  const docs = getAllContent('docs')

  return (
    <main className="mx-auto max-w-3xl px-5 pt-28 pb-14 sm:px-8 sm:pt-32 sm:pb-20">
      <p className="font-mono text-[11px] tracking-[0.22em] text-hint/90 uppercase">
        Documentation
      </p>
      <h1 className="mt-4 text-[clamp(28px,5vw,44px)] font-semibold tracking-[-0.03em] text-foreground">
        Guides & reference
      </h1>
      <p className="mt-3 max-w-md text-[15px] leading-7 text-muted-foreground">
        Everything you need to integrate ConvoMem into your product.
      </p>

      <div className="mt-10 space-y-4">
        {docs.map((doc) => (
          <Link
            key={doc.slug}
            to="/docs/$slug"
            params={{ slug: doc.slug }}
            className="block rounded-lg border border-border p-5 transition-colors hover:bg-muted/40"
          >
            <h2 className="text-lg font-semibold text-foreground">
              {doc.frontmatter.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {doc.frontmatter.description}
            </p>
          </Link>
        ))}
        {docs.length === 0 && (
          <p className="text-sm text-muted-foreground">No docs yet.</p>
        )}
      </div>
    </main>
  )
}
