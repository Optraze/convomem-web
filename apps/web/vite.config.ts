import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'

const config = defineConfig(({ command }) => ({
  resolve: { tsconfigPaths: true },
  build: {
    rolldownOptions: {
      output: {
        strictExecutionOrder: true,
        codeSplitting: {
          minSize: 20_000,
          maxSize: 500_000,
          groups: [
            {
              name: 'react-vendor',
              test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 50,
            },
            {
              name: 'tanstack-vendor',
              test: /node_modules[\\/]@tanstack[\\/]/,
              priority: 40,
            },
            {
              name: 'scalar-agent-chat',
              test: /node_modules[\\/]@scalar[\\/]agent-chat[\\/]/,
              priority: 39,
            },
            {
              name: 'scalar-api-client',
              test: /node_modules[\\/]@scalar[\\/]api-client[\\/]/,
              priority: 38,
            },
            {
              name: 'scalar-api-reference',
              test: /node_modules[\\/]@scalar[\\/]api-reference[\\/]/,
              priority: 37,
            },
            {
              name: 'scalar-ui',
              test: /node_modules[\\/]@scalar[\\/](components|icons|sidebar|themes|use-hooks|use-toasts|workspace-store)[\\/]/,
              priority: 36,
            },
            {
              name: 'scalar-core',
              test: /node_modules[\\/]@scalar[\\/]/,
              priority: 35,
            },
            {
              name: 'codemirror-docs',
              test: /node_modules[\\/](@codemirror|codemirror|@lezer)[\\/]/,
              priority: 30,
            },
            {
              name: 'vue-docs',
              test: /node_modules[\\/](vue|@vue|vue-demi|@headlessui[\\/]vue)[\\/]/,
              priority: 25,
            },
            {
              name: 'ai-vendor',
              test: /node_modules[\\/](@ai-sdk|ai|zod)[\\/]/,
              priority: 20,
            },
            {
              name: 'motion-vendor',
              test: /node_modules[\\/](motion|framer-motion)[\\/]/,
              priority: 15,
            },
            {
              name: 'vendor',
              test: /node_modules[\\/]/,
              priority: 1,
            },
          ],
        },
      },
    },
  },
  plugins: [
    command === 'serve' && devtools(),
    nitro(),
    tailwindcss(),
    tanstackStart({ srcDirectory: 'src' }),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
}))

export default config
