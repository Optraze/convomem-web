import { createFileRoute } from '@tanstack/react-router'

import { PagePlaceholder } from '@/features/dashboard/components/page-placeholder'

export const Route = createFileRoute('/(app)/data-import')({
  component: DataImportPage,
})

function DataImportPage() {
  return (
    <PagePlaceholder
      title="Data Import"
      description="Import conversation data from external sources."
    />
  )
}
