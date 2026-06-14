import { useMemo } from 'react'
import { ArrowRightIcon } from 'lucide-react'
import { createFileRoute, Link } from '@tanstack/react-router'

import { DocsLayout } from '@/features/docs/components/docs-layout'
import { buildDocSearchIndex, resolveDocsNav } from '@/features/docs/nav'
import { getContentMeta } from '@/lib/content'
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
  const nav = useMemo(() => resolveDocsNav(), [])
  const searchIndex = useMemo(() => buildDocSearchIndex(), [])

  return (
    <DocsLayout nav={nav} searchIndex={searchIndex} currentSlug="">
      <p className="font-mono text-[11px] tracking-[0.22em] text-hint/90 uppercase">
        Documentation
      </p>
      <h1 className="mt-4 text-[clamp(28px,5vw,44px)] font-semibold tracking-[-0.03em] text-foreground">
        Guides & reference
      </h1>
      <p className="mt-3 max-w-lg text-[15px] leading-7 text-muted-foreground">
        Everything you need to integrate ConvoMem into your product — from your
        first captured conversation to webhooks and security.
      </p>

      <div className="mt-12 space-y-10">
        {nav.map((group) => (
          <section key={group.group}>
            <h2 className="font-mono text-[11px] tracking-[0.18em] text-hint/90 uppercase">
              {group.group}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {group.items.map((item) => {
                const meta = getContentMeta('docs', item.slug)
                return (
                  <Link
                    key={item.slug}
                    to="/docs/$slug"
                    params={{ slug: item.slug }}
                    className="group flex flex-col rounded-lg border border-border p-4 transition-colors hover:bg-muted/40"
                  >
                    <span className="flex items-center justify-between font-medium text-foreground">
                      {item.title}
                      <ArrowRightIcon className="size-4 text-hint transition-transform group-hover:translate-x-0.5" />
                    </span>
                    {meta?.frontmatter.description && (
                      <span className="mt-1 text-sm text-muted-foreground">
                        {meta.frontmatter.description}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </DocsLayout>
  )
}
