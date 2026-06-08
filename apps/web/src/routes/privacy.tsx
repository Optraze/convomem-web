import { createFileRoute } from '@tanstack/react-router'

import { PrivacyPolicy } from '@/features/legal/privacy/index.tsx'
import { getSeoUrl, SITE_NAME } from '@/lib/seo.ts'

export const Route = createFileRoute('/privacy')({
  head: () => ({
    meta: [
      { title: `Privacy Policy — ${SITE_NAME}` },
      {
        name: 'description',
        content:
          'Read the ConvoMem Privacy Policy to learn how we collect, use, protect, and retain information across our website and services.',
      },
    ],
    links: [{ rel: 'canonical', href: getSeoUrl('/privacy') }],
  }),
  component: PrivacyPolicy,
})
