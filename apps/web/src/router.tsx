import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'

import { configureSdk, createSdkContext } from '@workspace/sdk'

import { env } from './env'
import { routeTree } from './routeTree.gen'

// Configure the generated fetch client once at module load. Runs on both
// client (Vite inlines VITE_API_URL) and server (Nitro reads it at runtime).
// VITE_API_URL is the API origin; the generated client expects the full base
// path including `/api/v1`.
const apiOrigin =
  env.VITE_API_URL ??
  (typeof process !== 'undefined' ? process.env.VITE_API_URL : undefined) ??
  'http://localhost:3000'
configureSdk({
  baseUrl: `${apiOrigin.replace(/\/$/, '')}/api/v1`,
})

export function getRouter() {
  const context = createSdkContext()

  const router = createTanStackRouter({
    routeTree,
    context,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })

  setupRouterSsrQueryIntegration({ router, queryClient: context.queryClient })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
