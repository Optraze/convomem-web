import { QueryClient } from '@tanstack/react-query'

import { client } from './client/client.gen'

// Re-export the generated SDK (functions, types, options).
export * from './client'

// Re-export the generated React Query hooks so apps can do
// `import { usePostCaptureMutation } from '@workspace/sdk'`
// without reaching into a sub-folder.
export * from './client/@tanstack/react-query.gen'

/**
 * Per-request SDK context. The `queryClient` must be fresh per request in
 * SSR to avoid leaking query state across users.
 */
export interface SdkContext {
  queryClient: QueryClient
}

/**
 * Create a fresh per-request SDK context. Call once per request (or per
 * browser session) and pass the result to your router context.
 */
export function createSdkContext(): SdkContext {
  return { queryClient: new QueryClient() }
}

/**
 * Configure the generated fetch client with the runtime base URL.
 * Call once at app startup, before any query/mutation runs.
 *
 * `VITE_API_URL` is inlined into the client bundle by Vite and is also
 * available on the server at runtime via `process.env.VITE_API_URL`.
 */
export function configureSdk({ baseUrl }: { baseUrl: string }): void {
  client.setConfig({ baseUrl })
}
