import { createFileRoute } from '@tanstack/react-router'

import { PagePlaceholder } from '@/features/dashboard/components/page-placeholder'

export const Route = createFileRoute('/(app)/customers')({
  component: CustomersPage,
})

function CustomersPage() {
  return (
    <PagePlaceholder
      title="Customers"
      description="View and manage your customer profiles and memories."
    />
  )
}
