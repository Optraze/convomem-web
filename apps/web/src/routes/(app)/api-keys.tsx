import { createFileRoute } from '@tanstack/react-router'

import { PagePlaceholder } from '@/features/dashboard/components/page-placeholder'

export const Route = createFileRoute('/(app)/api-keys')({
  component: ApiKeysPage,
})

function ApiKeysPage() {
  return (
    <PagePlaceholder
      title="API Keys"
      description="Manage your API keys for external integrations."
    />
  )
}
