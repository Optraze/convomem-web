import { defineConfig } from '@hey-api/openapi-ts'

// Regenerate with: pnpm --filter @workspace/sdk codegen
// The generated client is committed to disk and lives at src/client/.
// `configureSdk({ baseUrl })` from src/index.ts sets the runtime base URL.
export default defineConfig({
  input: 'https://api.convomem.com/api/docs/openapi.json',
  output: {
    path: 'src/client',
  },
  plugins: [
    '@hey-api/client-fetch',
    '@hey-api/sdk',
    '@hey-api/typescript',
    {
      // Generates ready-to-use React Query hooks (e.g. `useGetThingQuery`,
      // `useAddThingMutation`) so apps never touch `useQuery`/`useMutation`
      // directly.
      name: '@tanstack/react-query',
      useQuery: true,
      useMutation: true,
    },
  ],
})
