import { createFileRoute } from '@tanstack/react-router'

import { Home } from '@/features/home'
import { geistFontPreload } from '@/lib/fonts'
import { homeSchema } from '@/lib/home-schema'
import {
  createPageMeta,
  getSeoUrl,
  SITE_DESCRIPTION,
  SITE_TITLE,
  serializeStructuredData,
} from '@/lib/seo'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: createPageMeta({
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      path: '/',
    }),
    links: [{ rel: 'canonical', href: getSeoUrl('/') }, geistFontPreload],
    scripts: [
      {
        type: 'application/ld+json',
        children: serializeStructuredData(homeSchema),
      },
    ],
  }),
  component: Home,
})
