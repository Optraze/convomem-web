import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { DocsLayout } from '@/features/docs/components/docs-layout'
import { DocsOverview } from '@/features/docs/components/docs-overview'
import { buildDocSearchIndex, resolveDocsNav } from '@/features/docs/nav'
import { geistFontPreload } from '@/lib/fonts'
import { createPageMeta, getSeoUrl, SITE_NAME } from '@/lib/seo'

export const Route = createFileRoute('/docs/')({
  head: () => ({
    meta: createPageMeta({
      title: `Documentation — ${SITE_NAME}`,
      description:
        'Guides and reference documentation for the ConvoMem platform.',
      path: '/docs',
    }),
    links: [{ rel: 'canonical', href: getSeoUrl('/docs') }, geistFontPreload],
  }),
  component: DocsIndex,
})

function DocsIndex() {
  const nav = useMemo(() => resolveDocsNav(), [])
  const searchIndex = useMemo(() => buildDocSearchIndex(), [])

  return (
    <DocsLayout nav={nav} searchIndex={searchIndex} currentSlug="">
      <DocsOverview nav={nav} />
    </DocsLayout>
  )
}
