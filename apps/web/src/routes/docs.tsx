import { ApiReferenceReact } from '@scalar/api-reference-react'
import { createFileRoute } from '@tanstack/react-router'

import '@scalar/api-reference-react/style.css'

import { createPageMeta, getSeoUrl, SITE_NAME } from '@/lib/seo.ts'

export const Route = createFileRoute('/docs')({
  head: () => ({
    meta: createPageMeta({
      title: `API documentation — ${SITE_NAME}`,
      description:
        'Explore the ConvoMem API documentation for capturing, reconciling, and injecting durable customer memory into conversational AI products.',
      path: '/docs',
    }),
    links: [{ rel: 'canonical', href: getSeoUrl('/docs') }],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ApiReferenceReact
      configuration={{
        url: 'https://registry.scalar.com/@scalar/apis/galaxy?format=yaml',
      }}
    />
  )
}
