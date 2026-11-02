import { useState } from 'react'
import { ArrowUpRight, MenuIcon, XIcon } from 'lucide-react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { Link } from '@tanstack/react-router'

import type React from 'react'
import type { Toc } from '@/lib/content'
import type { DocSearchEntry, ResolvedNavGroup } from '../nav'

import { ResourceHeader, resourceLinks } from '@/components/resource-header'
import { ResourceFooter } from '@/components/resource-layout'
import {
  Dialog,
  DialogClose,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { DocsSearch } from './docs-search'
import { DocsSidebar } from './docs-sidebar'
import { OnThisPage } from './on-this-page'

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
  const hasToc = !!toc?.length
  return (
    <Dialog open={mobileNav} onOpenChange={setMobileNav}>
      <div className="docs-shell resource-surface">
        <a className="docs-skip" href="#docs-content">
          Skip to content
        </a>
        <ResourceHeader
          active="docs"
          search={<DocsSearch index={searchIndex} />}
          menu={
            <DialogTrigger
              render={
                <button
                  type="button"
                  className="docs-menu"
                  aria-label="Open documentation navigation"
                />
              }
            >
              <MenuIcon size={20} />
            </DialogTrigger>
          }
        />
        <div className="docs-columns" data-has-toc={hasToc}>
          <aside className="docs-left-rail">
            <div>
              <DocsSidebar nav={nav} currentSlug={currentSlug} />
              <div className="docs-sidebar-help">
                <span>Building something?</span>
                <Link to="/contact">
                  Talk to the team
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          </aside>
          <main className="docs-main" id="docs-content">
            {children}
          </main>
          {toc && hasToc && (
            <aside className="docs-right-rail">
              <OnThisPage toc={toc} />
            </aside>
          )}
        </div>
        <ResourceFooter />
      </div>
      <DialogPortal>
        <DialogOverlay className="docs-nav-backdrop" />
        <DialogPrimitive.Popup className="docs-nav-drawer resource-surface">
          <div className="docs-drawer-heading">
            <DialogTitle>Documentation</DialogTitle>
            <DialogClose aria-label="Close documentation navigation">
              <XIcon size={20} />
            </DialogClose>
          </div>
          <nav className="docs-drawer-resources" aria-label="Resources">
            {resourceLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileNav(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <DocsSidebar
            nav={nav}
            currentSlug={currentSlug}
            onNavigate={() => setMobileNav(false)}
          />
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  )
}
