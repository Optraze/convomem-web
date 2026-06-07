import { Home } from '@/features/marketing/home/index.tsx'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(marketing)/')({
  component: Home,
})
