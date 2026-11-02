import { MDXProvider } from '@mdx-js/react'
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'

import type { QueryClient } from '@tanstack/react-query'
import type React from 'react'

import { AnalyticsConsent } from '@/components/analytics-consent'
import { Devtools } from '@/components/devtools'
import { mdxComponents } from '@/components/mdx-components'
import { ThemeProvider, themeScript } from '@/components/theme-provider'
import { GeneralError } from '@/features/errors/general-error'
import { NotFoundError } from '@/features/errors/not-found'
import {
  DEFAULT_OG_ALT,
  DEFAULT_OG_PATH,
  getSeoUrl,
  organizationSchema,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  serializeStructuredData,
} from '@/lib/seo'
import appCss from '@/styles.css?url'

const OG_IMAGE = getSeoUrl(DEFAULT_OG_PATH)

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        {
          charSet: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          title: SITE_TITLE,
        },
        {
          name: 'description',
          content: SITE_DESCRIPTION,
        },
        {
          name: 'author',
          content: 'ConvoMem',
        },
        {
          name: 'theme-color',
          content: '#ffffff',
        },
        {
          name: 'application-name',
          content: SITE_NAME,
        },
        {
          name: 'apple-mobile-web-app-title',
          content: SITE_NAME,
        },
        {
          name: 'mobile-web-app-capable',
          content: 'yes',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: SITE_NAME },
        { property: 'og:title', content: SITE_TITLE },
        { property: 'og:description', content: SITE_DESCRIPTION },
        { property: 'og:url', content: getSeoUrl('/') },
        { property: 'og:image', content: OG_IMAGE },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: DEFAULT_OG_ALT },
        { property: 'og:locale', content: 'en_US' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: SITE_TITLE },
        { name: 'twitter:description', content: SITE_DESCRIPTION },
        { name: 'twitter:image', content: OG_IMAGE },
        { name: 'twitter:image:alt', content: DEFAULT_OG_ALT },
      ],
      links: [
        {
          rel: 'stylesheet',
          href: appCss,
        },
        {
          rel: 'icon',
          href: '/favicon.svg',
          type: 'image/svg+xml',
        },
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
          sizes: '32x32',
        },
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon-32x32.png',
          sizes: '32x32',
        },
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon-16x16.png',
          sizes: '16x16',
        },
        {
          rel: 'apple-touch-icon',
          href: '/apple-touch-icon.png',
          sizes: '180x180',
        },
        {
          rel: 'manifest',
          href: '/manifest.json',
        },
      ],
      scripts: [
        {
          children: themeScript,
        },
        {
          type: 'application/ld+json',
          children: serializeStructuredData(organizationSchema),
        },
      ],
    }),
    notFoundComponent: NotFoundError,
    errorComponent: GeneralError,
    shellComponent: RootDocument,
  }
)

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          <MDXProvider components={mdxComponents}>{children}</MDXProvider>
        </ThemeProvider>
        <AnalyticsConsent />
        <Devtools />
        <Scripts />
      </body>
    </html>
  )
}
