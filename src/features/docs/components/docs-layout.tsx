import { useState } from 'react'
import { MenuIcon, XIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import type React from 'react'
import type { Toc } from '@/lib/content'
import type { DocSearchEntry, ResolvedNavGroup } from '../nav'

import { ContentFooter } from '@/components/content-footer'
import { Logo } from '@/components/logo.tsx'

import { DocsSearch } from './docs-search'
import { DocsSidebar } from './docs-sidebar'
import { OnThisPage } from './on-this-page'

const APP_URL = 'https://app.convomem.com'

const headerLinks = [
  { label: 'Docs', to: '/docs' as const },
  { label: 'Blog', to: '/blog' as const },
  { label: 'Changelog', to: '/changelog' as const },
]

export function DocsLayout({
  nav,
  searchIndex,
  currentSlug,
  toc,
  children,
}: {
  nav: ResolvedNavGroup[]
  searchIndex: DocSearchEntry[]
  currentSlug: string
  toc?: Toc
  children: React.ReactNode
}) {
  const [mobileNav, setMobileNav] = useState(false)
  const hasToc = toc !== undefined && toc.length > 0

  return (
    <div className="min-h-svh">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileNav((o) => !o)}
            aria-label="Toggle navigation"
            className="-ml-1 grid size-8 place-items-center rounded-md hover:bg-muted lg:hidden"
          >
            {mobileNav ? (
              <XIcon className="size-5" />
            ) : (
              <MenuIcon className="size-5" />
            )}
          </button>
          <Link to="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="font-mono text-[14px] font-semibold tracking-[-0.01em]">
              ConvoMem
            </span>
          </Link>
          <nav className="ml-4 hidden items-center gap-6 md:flex">
            {headerLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-[13px] text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2.5">
            <DocsSearch index={searchIndex} />
            <a
              href={`${APP_URL}/register`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-md bg-foreground px-3.5 py-1.5 font-medium text-[13px] text-background transition-opacity hover:opacity-90 sm:block"
            >
              Get started
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[15rem_minmax(0,1fr)_15rem]">
          {/* Left sidebar (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-14 max-h-[calc(100svh-3.5rem)] overflow-y-auto py-8 pr-2">
              <DocsSidebar nav={nav} currentSlug={currentSlug} />
            </div>
          </aside>

          {/* Center content */}
          <main className="min-w-0 py-8 lg:py-10">{children}</main>

          {/* Right rail (xl) */}
          {hasToc && (
            <aside className="hidden xl:block">
              <div className="sticky top-14 max-h-[calc(100svh-3.5rem)] overflow-y-auto py-10">
                <OnThisPage toc={toc} />
              </div>
            </aside>
          )}
        </div>
      </div>

      <ContentFooter />

      {/* Mobile sidebar drawer */}
      {mobileNav && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            tabIndex={-1}
            className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileNav(false)}
          />
          <div className="absolute top-14 bottom-0 left-0 w-72 max-w-[80%] overflow-y-auto border-r border-border bg-background p-6">
            <DocsSidebar
              nav={nav}
              currentSlug={currentSlug}
              onNavigate={() => setMobileNav(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
