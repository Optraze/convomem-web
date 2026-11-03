import { createFileRoute } from '@tanstack/react-router'

import { ContactPage } from '@/features/contact'
import { createPageMeta, getSeoUrl, SITE_NAME } from '@/lib/seo'

export const Route = createFileRoute('/contact')({
  head: () => ({
    meta: createPageMeta({
      title: `Contact us — ${SITE_NAME}`,
      description:
        'Contact ConvoMem for pricing, support, partnerships, or enterprise deployment questions.',
      path: '/contact',
    }),
    links: [{ rel: 'canonical', href: getSeoUrl('/contact') }],
  }),
  component: ContactPage,
})
