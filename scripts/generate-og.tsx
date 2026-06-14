import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { fromJsx } from 'takumi-js/helpers/jsx'
import { Renderer } from 'takumi-js/node'

import type React from 'react'
import type { ContentFile, ContentType } from './content-files'

import { BaseTemplate } from '../src/components/og/base-template'
import { BlogTemplate } from '../src/components/og/blog-template'
import { ChangelogTemplate } from '../src/components/og/changelog-template'
import { DocsTemplate } from '../src/components/og/docs-template'
import { loadOgFonts } from '../src/components/og/fonts'
import { allContentFiles } from './content-files'

const OUT_DIR = join(process.cwd(), 'public/og')

function templateFor(
  type: ContentType,
  data: ContentFile['data']
): React.ReactElement {
  const title = data.title ?? 'ConvoMem'
  const description = data.description ?? ''
  switch (type) {
    case 'blog':
      return (
        <BlogTemplate
          title={title}
          description={description}
          date={data.date}
          author={data.author}
          tags={data.tags}
        />
      )
    case 'docs':
      return <DocsTemplate title={title} description={description} />
    case 'changelog':
      return (
        <ChangelogTemplate
          title={title}
          description={description}
          date={data.date}
        />
      )
  }
}

const renderer = new Renderer({ fonts: loadOgFonts() })

async function renderPng(element: React.ReactElement): Promise<Buffer> {
  const { node, stylesheets } = await fromJsx(element)
  return renderer.render(node, {
    width: 1200,
    height: 630,
    format: 'png',
    stylesheets,
  })
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true })

  // Default fallback image.
  const fallback = await renderPng(
    <BaseTemplate
      title="ConvoMem"
      description="AI memory for customer conversations."
    />
  )
  writeFileSync(join(OUT_DIR, 'default.png'), fallback)

  const files = allContentFiles() // published only
  let count = 1
  for (const file of files) {
    try {
      const buf = await renderPng(templateFor(file.type, file.data))
      mkdirSync(join(OUT_DIR, file.type), { recursive: true })
      writeFileSync(join(OUT_DIR, file.type, `${file.slug}.png`), buf)
      count++
    } catch (err) {
      console.error(`OG failed for ${file.type}/${file.slug}:`, err)
      process.exitCode = 1
    }
  }
  console.log(`OG images generated: ${OUT_DIR} (${count} images)`)
}

await main()
