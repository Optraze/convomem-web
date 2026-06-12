import { createFileRoute } from '@tanstack/react-router'

import { PagePlaceholder } from '@/features/dashboard/components/page-placeholder'

export const Route = createFileRoute('/(app)/team')({
  component: TeamPage,
})

function TeamPage() {
  return (
    <PagePlaceholder
      title="Team"
      description="Manage team members and their roles."
    />
  )
}
