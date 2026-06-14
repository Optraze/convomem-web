import mdx from '@mdx-js/rollup'
import fg from 'fast-glob'
import { nitro } from 'nitro/vite'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkGfm from 'remark-gfm'
import { defineConfig } from 'vite'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'

const blogSlugs = fg
  .sync('src/content/blog/*.mdx')
  .map((f) => f.split('/').pop()?.replace('.mdx', '') ?? '')
const docsSlugs = fg
  .sync('src/content/docs/*.mdx')
  .map((f) => f.split('/').pop()?.replace('.mdx', '') ?? '')
const changelogSlugs = fg
  .sync('src/content/changelog/*.mdx')
  .map((f) => f.split('/').pop()?.replace('.mdx', '') ?? '')

const config = defineConfig(({ command }) => ({
  resolve: { tsconfigPaths: true },
  plugins: [
    command === 'serve' && devtools(),
    nitro({
      compatibilityDate: 'latest',
      prerender: {
        routes: [
          '/',
          '/contact',
          '/privacy',
          '/terms',
          '/blog',
          '/docs',
          '/changelog',
          ...blogSlugs.map((s) => `/blog/${s}`),
          ...docsSlugs.map((s) => `/docs/${s}`),
          ...changelogSlugs.map((s) => `/changelog/${s}`),
        ],
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
        '/blog/**': { prerender: true },
        '/docs/**': { prerender: true },
        '/changelog/**': { prerender: true },
        '/assets/**': {
          headers: { 'cache-control': 'public, max-age=31536000, immutable' },
        },
      },
    }),
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
      rehypePlugins: [rehypePrettyCode],
    }),
    tailwindcss(),
    tanstackStart({ srcDirectory: 'src' }),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
}))

export default config
