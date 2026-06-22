import { MDXProvider } from '@mdx-js/react'
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'

import type { QueryClient } from '@tanstack/react-query'
import type React from 'react'

import { Devtools } from '@/components/devtools'
import { mdxComponents } from '@/components/mdx-components'
import { ThemeProvider, themeScript } from '@/components/theme-provider'
import { GeneralError } from '@/features/errors/general-error'
import { NotFoundError } from '@/features/errors/not-found'
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
          rel: 'preload',
          href: '/assets/inter-latin-wght-normal-Dx4kXJAl.woff2',
          as: 'font',
          type: 'font/woff2',
          crossOrigin: 'anonymous',
        },
        {
          rel: 'preload',
          href: '/assets/jetbrains-mono-latin-wght-normal-B9CIFXIH.woff2',
          as: 'font',
          type: 'font/woff2',
          crossOrigin: 'anonymous',
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
          src: 'https://www.googletagmanager.com/gtag/js?id=G-47DNQJVNV6',
          async: true,
        },
        {
          children: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-47DNQJVNV6');`,
        },
        {
          children: themeScript,
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: SITE_NAME,
            url: getSeoUrl('/'),
            logo: getSeoUrl('/logo.svg'),
          }),
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
        <Devtools />
        <Scripts />
      </body>
    </html>
  )
}
