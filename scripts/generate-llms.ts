import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

import type { ContentFile } from './content-files'

import { allContentFiles } from './content-files'

const SITE_URL = 'https://convomem.com'

const CALLOUT_RE =
  /<Callout type="(\w+)"(?:\s+title="([^"]*)")?\s*>\n?([\s\S]*?)\n?<\/Callout>/g

// Renders <Callout> JSX (the only custom component in our MDX) as a Markdown blockquote.
function calloutsToBlockquotes(raw: string): string {
  return raw.replace(
    CALLOUT_RE,
    (_m, type: string, title: string | undefined, body: string) => {
      const label = title ?? type.charAt(0).toUpperCase() + type.slice(1)
      const lines = body.trim().split('\n')
      return [
        `> **${label}**`,
        '>',
        ...lines.map((l) => (l ? `> ${l}` : '>')),
      ].join('\n')
    }
  )
}

function writeMarkdown(file: ContentFile) {
  const raw = readFileSync(file.path, 'utf8')
  const outPath = resolve(`public/${file.type}/${file.slug}.md`)
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, calloutsToBlockquotes(raw))
}

const files = allContentFiles()
for (const file of files) writeMarkdown(file)

const sectionTitles = {
  docs: 'Docs',
  blog: 'Blog',
  changelog: 'Changelog',
} as const

const sections = (['docs', 'blog', 'changelog'] as const)
  .map((type) => {
    const items = files.filter((f) => f.type === type)
    if (items.length === 0) return ''
    const lines = items.map(
      (f) =>
        `- [${f.data.title}](${SITE_URL}/${type}/${f.slug}): ${f.data.description} (${SITE_URL}/${type}/${f.slug}.md)`
    )
    return `## ${sectionTitles[type]}\n${lines.join('\n')}`
  })
  .filter(Boolean)

const llmsTxt = `# ConvoMem

> AI memory layer for customer conversations. Capture and inject context into every support interaction.

${sections.join('\n\n')}
`

writeFileSync(resolve('public/llms.txt'), llmsTxt)

console.log(`Generated ${files.length} markdown files + public/llms.txt`)
