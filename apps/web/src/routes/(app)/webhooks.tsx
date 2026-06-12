import { createFileRoute } from '@tanstack/react-router'

import { PagePlaceholder } from '@/features/dashboard/components/page-placeholder'

export const Route = createFileRoute('/(app)/webhooks')({
  component: WebhooksPage,
})

function WebhooksPage() {
  return (
    <PagePlaceholder
      title="Webhooks"
      description="Configure webhooks for real-time event notifications."
    />
  )
}
