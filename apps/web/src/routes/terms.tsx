import { createFileRoute } from '@tanstack/react-router'

import { TermsOfService } from '@/features/legal/terms/index.tsx'
import { createPageMeta, getSeoUrl, SITE_NAME } from '@/lib/seo.ts'

export const Route = createFileRoute('/terms')({
  head: () => ({
    meta: createPageMeta({
      title: `Terms of Service — ${SITE_NAME}`,
      description:
        'Read the ConvoMem Terms of Service for account, billing, acceptable use, liability, termination, and legal terms.',
      path: '/terms',
    }),
    links: [{ rel: 'canonical', href: getSeoUrl('/terms') }],
  }),
  component: TermsOfService,
})
