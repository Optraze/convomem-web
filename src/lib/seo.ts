export const SITE_ORIGIN = 'https://convomem.com'
export const SITE_NAME = 'ConvoMem'
export const SITE_TITLE =
  'ConvoMem — Customer Memory & Conversation Intelligence'
export const SITE_DESCRIPTION =
  'Customer memory and AI analytics across voice, chat, SMS, and email. Give agents context with semantic search, shared history, and handoffs.'
export const DEFAULT_OG_PATH = '/og/home.png'
export const DEFAULT_OG_ALT = 'ConvoMem — Customer intelligence. With a memory.'
export const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`
export const WEBSITE_ID = `${SITE_ORIGIN}/#website`

/** Canonical identities stay on the public origin, including local previews. */
export function getSeoUrl(path = '/') {
  return new URL(path, SITE_ORIGIN).toString()
}

/** JSON-LD is embedded as script content, so HTML delimiters must be escaped. */
export function serializeStructuredData(data: unknown) {
  return JSON.stringify(data).replaceAll('<', '\\u003c')
}

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: SITE_NAME,
  url: getSeoUrl('/'),
  logo: getSeoUrl('/logo.svg'),
  parentOrganization: {
    '@type': 'Organization',
    name: 'Optraze',
    url: 'https://optraze.com',
  },
}

export const websiteSchema = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: SITE_NAME,
  url: getSeoUrl('/'),
  inLanguage: 'en',
  publisher: { '@id': ORGANIZATION_ID },
}

export function createPageMeta({
  title,
  description,
  path,
  ogImage,
  ogImageAlt,
  type = 'website',
  noIndex = false,
}: {
  title: string
  description: string
  path: string
  ogImage?: string
  ogImageAlt?: string
  type?: 'website' | 'article'
  noIndex?: boolean
}) {
  const image = ogImage ?? getSeoUrl(DEFAULT_OG_PATH)
  const imageAlt = ogImageAlt ?? (ogImage ? title : DEFAULT_OG_ALT)
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: getSeoUrl(path) },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: imageAlt },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
    { name: 'twitter:image:alt', content: imageAlt },
    ...(noIndex ? [{ name: 'robots', content: 'noindex, follow' }] : []),
  ]
}
