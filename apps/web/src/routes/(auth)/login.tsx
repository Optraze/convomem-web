import { createFileRoute } from '@tanstack/react-router'

import { LoginPage } from '@/features/auth/login/index.tsx'
import { createPageMeta, getSeoUrl, SITE_NAME } from '@/lib/seo.ts'

export const Route = createFileRoute('/(auth)/login')({
  head: () => ({
    meta: createPageMeta({
      title: `Sign in — ${SITE_NAME}`,
      description:
        'Sign in to your ConvoMem account to manage conversation memories.',
      path: '/login',
    }),
    links: [{ rel: 'canonical', href: getSeoUrl('/login') }],
  }),
  component: LoginPage,
})
