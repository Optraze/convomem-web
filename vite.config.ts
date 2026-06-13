import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'

const config = defineConfig(({ command }) => ({
  resolve: { tsconfigPaths: true },
  plugins: [
    command === 'serve' && devtools(),
    nitro({
      compatibilityDate: 'latest',
      prerender: {
        routes: ['/', '/contact', '/privacy', '/terms'],
      },
      compressPublicAssets: {
        gzip: true,
        brotli: true,
      },
      routeRules: {
        '/': { prerender: true },
        '/contact': { prerender: true },
        '/privacy': { prerender: true },
        '/terms': { prerender: true },
        '/assets/**': {
          headers: { 'cache-control': 'public, max-age=31536000, immutable' },
        },
      },
    }),
    tailwindcss(),
    tanstackStart({ srcDirectory: 'src' }),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
}))

export default config
