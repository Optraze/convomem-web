import { createFileRoute } from '@tanstack/react-router'

import { PagePlaceholder } from '@/features/dashboard/components/page-placeholder'

export const Route = createFileRoute('/(app)/graph')({
  component: GraphPage,
})

function GraphPage() {
  return (
    <PagePlaceholder
      title="Entity Graph"
      description="Visualize relationships between entities in your data."
    />
  )
}
