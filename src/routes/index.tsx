import { createFileRoute } from '@tanstack/react-router'

import { Home } from '@/features/home'
import { getSeoUrl } from '@/lib/seo'

export const Route = createFileRoute('/')({
  head: () => ({
    links: [{ rel: 'canonical', href: getSeoUrl('/') }],
  }),
  component: Home,
})
