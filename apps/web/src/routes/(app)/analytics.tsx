import { createFileRoute } from '@tanstack/react-router'

import { PagePlaceholder } from '@/features/dashboard/components/page-placeholder'

export const Route = createFileRoute('/(app)/analytics')({
  component: AnalyticsPage,
})

function AnalyticsPage() {
  return (
    <PagePlaceholder
      title="Analytics"
      description="View conversation analytics and metrics."
    />
  )
}
