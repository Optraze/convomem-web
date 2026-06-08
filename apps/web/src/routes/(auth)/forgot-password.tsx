import { createFileRoute } from '@tanstack/react-router'

import { ForgotPasswordPage } from '@/features/auth/forgot-password/index.tsx'
import { createPageMeta, getSeoUrl, SITE_NAME } from '@/lib/seo.ts'

export const Route = createFileRoute('/(auth)/forgot-password')({
  head: () => ({
    meta: createPageMeta({
      title: `Reset password — ${SITE_NAME}`,
      description:
        'Request a secure password reset link for your ConvoMem account.',
      path: '/forgot-password',
    }),
    links: [{ rel: 'canonical', href: getSeoUrl('/forgot-password') }],
  }),
  component: ForgotPasswordPage,
})
