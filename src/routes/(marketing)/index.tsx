import { createFileRoute } from '@tanstack/react-router'

import { Home } from '@/features/marketing/home'
import { getSeoUrl } from '@/lib/seo'

export const Route = createFileRoute('/(marketing)/')({
  head: () => ({
    links: [{ rel: 'canonical', href: getSeoUrl('/') }],
  }),
  component: Home,
})
