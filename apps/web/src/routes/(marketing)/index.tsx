import { createFileRoute } from '@tanstack/react-router'

import { Home } from '@/features/marketing/home/index.tsx'
import { getSeoUrl } from '@/lib/seo.ts'

export const Route = createFileRoute('/(marketing)/')({
  head: () => ({
    links: [{ rel: 'canonical', href: getSeoUrl('/') }],
  }),
  component: Home,
})
