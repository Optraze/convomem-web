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
      preset: 'cloudflare_module',
      logLevel: 3,
      debug: command === 'serve',
      cloudflare: {
        wrangler: {
          name: 'convomem',
          compatibility_date: '2025-01-01',
          compatibility_flags: ['nodejs_compat'],
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
