import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
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

// public/{docs,blog,changelog}/*.md are fully generated and git-ignored.
// Clear them first so a removed, renamed or draft page cannot linger in a
// local build and ship as a stale public file.
for (const type of ['docs', 'blog', 'changelog']) {
  const dir = resolve(`public/${type}`)
  if (!existsSync(dir)) continue
  for (const name of readdirSync(dir)) {
    if (name.endsWith('.md')) rmSync(resolve(dir, name))
  }
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

> Customer memory and AI analytics across voice, chat, SMS, and email. Connect customer context, semantic memory search, and agent handoffs.

${sections.join('\n\n')}
`

writeFileSync(resolve('public/llms.txt'), llmsTxt)

console.log(`Generated ${files.length} markdown files + public/llms.txt`)

// Static hosts consume _headers; the Node server uses the matching Nitro rules.
// Replace only this generated block, preserving hand-written cache/header rules.
const headersPath = resolve('public/_headers')
const headers = readFileSync(headersPath, 'utf8').replace(
  /\n*# BEGIN GENERATED MARKDOWN CANONICALS\n[\s\S]*?# END GENERATED MARKDOWN CANONICALS\n?/g,
  '\n\n'
)
const markdownHeaders = files
  .map(
    (file) =>
      `/${file.type}/${file.slug}.md\n  Link: <${SITE_URL}/${file.type}/${file.slug}>; rel="canonical"`
  )
  .join('\n\n')
writeFileSync(
  headersPath,
  `${headers.trimEnd()}\n\n# BEGIN GENERATED MARKDOWN CANONICALS\n${markdownHeaders}\n# END GENERATED MARKDOWN CANONICALS\n`
)
