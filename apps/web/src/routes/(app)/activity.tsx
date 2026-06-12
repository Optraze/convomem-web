import { createFileRoute } from '@tanstack/react-router'

import { PagePlaceholder } from '@/features/dashboard/components/page-placeholder'

export const Route = createFileRoute('/(app)/activity')({
  component: ActivityPage,
})

function ActivityPage() {
  return (
    <PagePlaceholder
      title="Activity"
      description="View recent activity and audit logs."
    />
  )
}
