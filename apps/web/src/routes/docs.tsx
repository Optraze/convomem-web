import { ApiReferenceReact } from '@scalar/api-reference-react'
import { createFileRoute } from '@tanstack/react-router'

import '@scalar/api-reference-react/style.css'

export const Route = createFileRoute('/docs')({
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
