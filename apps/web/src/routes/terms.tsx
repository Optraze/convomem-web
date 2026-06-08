import { createFileRoute } from '@tanstack/react-router'

import { TermsOfService } from '@/features/legal/terms/index.tsx'
import { getSeoUrl, SITE_NAME } from '@/lib/seo.ts'

export const Route = createFileRoute('/terms')({
  head: () => ({
    meta: [
      { title: `Terms of Service — ${SITE_NAME}` },
      {
        name: 'description',
        content:
          'Read the ConvoMem Terms of Service for account, billing, acceptable use, liability, termination, and legal terms.',
      },
    ],
    links: [{ rel: 'canonical', href: getSeoUrl('/terms') }],
  }),
  component: TermsOfService,
})
