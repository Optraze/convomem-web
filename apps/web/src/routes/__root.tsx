import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'

import type { SdkContext } from '@workspace/sdk'
import type React from 'react'

import {
  ThemeProvider,
  themeScript,
} from '@workspace/ui/components/theme-provider'
import appCss from '@workspace/ui/globals.css?url'

import { Devtools } from '@/components/devtools.tsx'
import { DirectionProvider } from '@/context/direction-provider'
import { LayoutProvider } from '@/context/layout-provider'
import { SessionExpiredDialog } from '@/features/auth/components/session-expired-dialog.tsx'
import {
  getSeoUrl,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TITLE,
} from '@/lib/seo.ts'

const OG_IMAGE = getSeoUrl('/og-image.png')

export const Route = createRootRouteWithContext<SdkContext>()({
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
      // Open Graph (Facebook, LinkedIn, Slack, Discord, iMessage, …)
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
      // Twitter Card
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
      // SVG favicon (theme-aware via prefers-color-scheme media query)
      {
        rel: 'icon',
        href: '/favicon.svg',
        type: 'image/svg+xml',
      },
      // Legacy / fallback favicons
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
      // Apple touch icon (iOS home screen)
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png',
        sizes: '180x180',
      },
      // PWA manifest
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
    ],
    scripts: [
      // Runs before React hydrates; resolves theme from localStorage / system
      // preference and toggles `.dark` / `.light` on <html> synchronously.
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
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          <DirectionProvider>
            <LayoutProvider>
              {children}
              <SessionExpiredDialog />
            </LayoutProvider>
          </DirectionProvider>
        </ThemeProvider>
        <Devtools />
        <Scripts />
      </body>
    </html>
  )
}
