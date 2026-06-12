import { createFileRoute } from '@tanstack/react-router'

import { PagePlaceholder } from '@/features/dashboard/components/page-placeholder'

export const Route = createFileRoute('/(app)/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <PagePlaceholder
      title="Settings"
      description="Manage your account and application settings."
    />
  )
}
