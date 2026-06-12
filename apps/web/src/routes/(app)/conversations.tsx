import { createFileRoute } from '@tanstack/react-router'

import { PagePlaceholder } from '@/features/dashboard/components/page-placeholder'

export const Route = createFileRoute('/(app)/conversations')({
  component: ConversationsPage,
})

function ConversationsPage() {
  return (
    <PagePlaceholder
      title="Conversations"
      description="Browse and analyze customer conversations."
    />
  )
}
