import { createFileRoute } from '@tanstack/react-router'

import { Home } from '@/features/marketing/home/index.tsx'

export const Route = createFileRoute('/(marketing)/')({
  component: Home,
})
