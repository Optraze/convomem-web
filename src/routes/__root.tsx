import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'

import type { QueryClient } from '@tanstack/react-query'
import type React from 'react'

import { Devtools } from '@/components/devtools'
import { ThemeProvider, themeScript } from '@/components/theme-provider'
import {
  getSeoUrl,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TITLE,
} from '@/lib/seo'
import appCss from '@/styles.css?url'

const OG_IMAGE = getSeoUrl('/og-image.png')

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
          name: 'keywords',
          content: SITE_KEYWORDS,
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
        { property: 'og:image:alt', content: SITE_TITLE },
        { property: 'og:locale', content: 'en_US' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: SITE_TITLE },
        { name: 'twitter:description', content: SITE_DESCRIPTION },
        { name: 'twitter:image', content: OG_IMAGE },
        { name: 'twitter:image:alt', content: SITE_TITLE },
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
      ],
    }),
    notFoundComponent: () => (
      <main className="container mx-auto p-4 pt-16">
        <h1>404</h1>
        <p>The requested page could not be found.</p>
      </main>
    ),
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
        <ThemeProvider>{children}</ThemeProvider>
        <Devtools />
        <Scripts />
      </body>
    </html>
  )
}
