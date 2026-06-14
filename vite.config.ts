import { nitro } from 'nitro/vite'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { defineConfig } from 'vite'
import mdx from '@mdx-js/rollup'
import babel from '@rolldown/plugin-babel'
import withExtractedToc from '@stefanprobst/rehype-extract-toc'
import withExportedTocMdx from '@stefanprobst/rehype-extract-toc/mdx'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'

import { contentFiles } from './scripts/content-files'

const blogSlugs = contentFiles('blog').map((f) => f.slug)
const docsSlugs = contentFiles('docs').map((f) => f.slug)
const changelogSlugs = contentFiles('changelog').map((f) => f.slug)

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
      providerImportSource: '@mdx-js/react',
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        withExtractedToc,
        withExportedTocMdx,
        [
          rehypePrettyCode,
          {
            theme: { light: 'github-light', dark: 'github-dark' },
            keepBackground: false,
          },
        ],
      ],
    }),
    tailwindcss(),
    tanstackStart({ srcDirectory: 'src' }),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
}))

export default config
