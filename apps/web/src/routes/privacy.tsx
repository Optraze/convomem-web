import { createFileRoute } from '@tanstack/react-router'

import { PrivacyPolicy } from '@/features/legal/privacy/index.tsx'
import { createPageMeta, getSeoUrl, SITE_NAME } from '@/lib/seo.ts'

export const Route = createFileRoute('/privacy')({
  head: () => ({
    meta: createPageMeta({
      title: `Privacy Policy — ${SITE_NAME}`,
      description:
        'Read the ConvoMem Privacy Policy to learn how we collect, use, protect, and retain information across our website and services.',
      path: '/privacy',
    }),
    links: [{ rel: 'canonical', href: getSeoUrl('/privacy') }],
  }),
  component: PrivacyPolicy,
})
