import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import fg from 'fast-glob'

const SITE_URL = 'https://convomem.com'

const staticRoutes = [
  '/',
  '/contact',
  '/privacy',
  '/terms',
  '/blog',
  '/docs',
  '/changelog',
]

const blogSlugs = fg
  .sync('src/content/blog/*.mdx')
  .map((f) => f.split('/').pop()?.replace('.mdx', '') ?? '')
  .filter(Boolean)

const docsSlugs = fg
  .sync('src/content/docs/*.mdx')
  .map((f) => f.split('/').pop()?.replace('.mdx', '') ?? '')
  .filter(Boolean)

const changelogSlugs = fg
  .sync('src/content/changelog/*.mdx')
  .map((f) => f.split('/').pop()?.replace('.mdx', '') ?? '')
  .filter(Boolean)

const allRoutes = [
  ...staticRoutes,
  ...blogSlugs.map((s) => `/blog/${s}`),
  ...docsSlugs.map((s) => `/docs/${s}`),
  ...changelogSlugs.map((s) => `/changelog/${s}`),
]

const priority: Record<string, string> = {
  '/': '1.0',
  '/blog': '0.8',
  '/docs': '0.8',
  '/changelog': '0.7',
  '/contact': '0.7',
  '/privacy': '0.6',
  '/terms': '0.6',
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `  <url>
    <loc>${SITE_URL}${route}</loc>
    <priority>${priority[route] ?? '0.5'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

const outPath = resolve('public/sitemap.xml')
writeFileSync(outPath, xml)
console.log(`Sitemap generated: ${outPath} (${allRoutes.length} URLs)`)
