import { createFileRoute } from '@tanstack/react-router'

import { PagePlaceholder } from '@/features/dashboard/components/page-placeholder'
import { createPageMeta, getSeoUrl, SITE_NAME } from '@/lib/seo.ts'

export const Route = createFileRoute('/(app)/dashboard')({
  head: () => ({
    meta: createPageMeta({
      title: `Dashboard — ${SITE_NAME}`,
      description:
        'Manage your conversation memories, inspect stored context, and connect ConvoMem to your AI workflows.',
      path: '/dashboard',
    }),
    links: [{ rel: 'canonical', href: getSeoUrl('/dashboard') }],
  }),
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <PagePlaceholder
      title="Dashboard"
      description="Welcome back. This is your ConvoMem dashboard."
    />
  )
}
