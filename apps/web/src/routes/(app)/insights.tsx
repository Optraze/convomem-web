import { createFileRoute } from '@tanstack/react-router'

import { PagePlaceholder } from '@/features/dashboard/components/page-placeholder'

export const Route = createFileRoute('/(app)/insights')({
  component: InsightsPage,
})

function InsightsPage() {
  return (
    <PagePlaceholder
      title="Insights"
      description="AI-powered insights from your conversation data."
    />
  )
}
