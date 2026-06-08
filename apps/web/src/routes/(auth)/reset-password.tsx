import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'

import { ResetPasswordPage } from '@/features/auth/reset-password/index.tsx'
import { createPageMeta, getSeoUrl, SITE_NAME } from '@/lib/seo.ts'

const resetPasswordSearchSchema = z.object({
  token: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/reset-password')({
  validateSearch: resetPasswordSearchSchema,
  head: () => ({
    meta: createPageMeta({
      title: `Set new password — ${SITE_NAME}`,
      description: 'Choose a new password for your ConvoMem account.',
      path: '/reset-password',
    }),
    links: [{ rel: 'canonical', href: getSeoUrl('/reset-password') }],
  }),
  component: ResetPasswordRoute,
})

function ResetPasswordRoute() {
  const { token } = Route.useSearch()

  return <ResetPasswordPage token={token} />
}
