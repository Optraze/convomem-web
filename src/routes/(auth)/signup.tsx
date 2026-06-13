import { createFileRoute } from '@tanstack/react-router'

import { SignupPage } from '@/features/auth/signup'
import { createPageMeta, getSeoUrl, SITE_NAME } from '@/lib/seo'

export const Route = createFileRoute('/(auth)/signup')({
  head: () => ({
    meta: createPageMeta({
      title: `Create account — ${SITE_NAME}`,
      description: 'Create a ConvoMem account to start storing and reusing customer conversation memory.',
      path: '/signup',
    }),
    links: [{ rel: 'canonical', href: getSeoUrl('/signup') }],
  }),
  component: SignupPage,
})
