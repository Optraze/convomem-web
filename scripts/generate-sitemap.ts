import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { allContentFiles, lastmodOf } from './content-files'

const SITE_URL = 'https://convomem.com'

interface SitemapUrl {
  path: string
  priority: string
  lastmod?: string
}

const staticUrls: SitemapUrl[] = [
  { path: '/', priority: '1.0' },
  { path: '/blog', priority: '0.8' },
  { path: '/docs', priority: '0.8' },
  { path: '/changelog', priority: '0.7' },
  { path: '/contact', priority: '0.7' },
  { path: '/privacy', priority: '0.6' },
  { path: '/terms', priority: '0.6' },
]

const priorityByType = { blog: '0.7', docs: '0.7', changelog: '0.6' } as const

// Drafts are excluded (allContentFiles filters status:'draft' by default).
const contentUrls: SitemapUrl[] = allContentFiles().map((f) => ({
  path: `/${f.type}/${f.slug}`,
  priority: priorityByType[f.type],
  lastmod: lastmodOf(f),
}))

const allUrls = [...staticUrls, ...contentUrls]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${SITE_URL}${u.path}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

const outPath = resolve('public/sitemap.xml')
writeFileSync(outPath, xml)
console.log(`Sitemap generated: ${outPath} (${allUrls.length} URLs)`)
