import ImageResponse from 'takumi-js/response'
import { createFileRoute } from '@tanstack/react-router'

import { BaseTemplate } from '@/components/og/base-template'
import { BlogTemplate } from '@/components/og/blog-template'
import { ChangelogTemplate } from '@/components/og/changelog-template'
import { DocsTemplate } from '@/components/og/docs-template'

let fontCache: ArrayBuffer | null = null

async function getFont(): Promise<ArrayBuffer> {
  if (fontCache) return fontCache
  const res = await fetch('https://takumi.kane.tw/fonts/Inter.woff2')
  fontCache = await res.arrayBuffer()
  return fontCache
}

export const Route = createFileRoute('/api/og')({
  server: {
    handlers: {
      GET({ request }) {
        const url = new URL(request.url)
        const type = url.searchParams.get('type') || 'default'
        const title = url.searchParams.get('title') || 'ConvoMem'
        const description = url.searchParams.get('description') || ''
        const date = url.searchParams.get('date') || ''
        const author = url.searchParams.get('author') || ''
        const tags =
          url.searchParams.get('tags')?.split(',').filter(Boolean) || []

        let template: ReturnType<typeof BaseTemplate>

        switch (type) {
          case 'blog':
            template = (
              <BlogTemplate
                title={title}
                description={description}
                date={date}
                author={author}
                tags={tags}
              />
            )
            break
          case 'docs':
            template = <DocsTemplate title={title} description={description} />
            break
          case 'changelog':
            template = (
              <ChangelogTemplate
                title={title}
                description={description}
                date={date}
              />
            )
            break
          default:
            template = <BaseTemplate title={title} description={description} />
        }

        return new ImageResponse(template, {
          width: 1200,
          height: 630,
          fonts: [
            {
              name: 'Inter',
              data: getFont,
              style: 'normal',
            },
          ],
        })
      },
    },
  },
})
