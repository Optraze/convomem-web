export const SITE_ORIGIN = 'https://convomem.com'
export const SITE_NAME = 'ConvoMem'
export const SITE_TITLE = 'ConvoMem — AI Memory for Customer Conversations'
export const SITE_DESCRIPTION =
  'AI memory layer for customer conversations. Capture and inject context into every support interaction.'
export const SITE_KEYWORDS =
  'AI memory, customer intelligence, conversational AI, voice bot, chat bot, customer context, enterprise AI'

export function getSeoUrl(path = '/') {
  return import.meta.env.PROD ? new URL(path, SITE_ORIGIN).toString() : path
}

export function createPageMeta({
  title,
  description,
  path,
  ogImage,
}: {
  title: string
  description: string
  path: string
  ogImage?: string
}) {
  const url = getSeoUrl(path)
  const image = ogImage ?? getSeoUrl('/og-image.png')

  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
  ]
}
