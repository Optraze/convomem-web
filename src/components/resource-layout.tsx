import { Link } from '@tanstack/react-router'

import type { ReactNode } from 'react'

import { Logo } from './logo'
import { ResourceHeader } from './resource-header'

export function ResourceFooter({
  appearance = 'auto',
}: {
  appearance?: 'auto' | 'light' | 'dark'
} = {}) {
  return (
    <footer className="resource-footer">
      <div>
        <Link to="/" className="resource-footer-brand">
          <Logo appearance={appearance} aria-hidden="true" />
          ConvoMem
        </Link>
        <p>
          © {new Date().getFullYear()} ConvoMem. A product by{' '}
          <a href="https://optraze.com" target="_blank" rel="noreferrer">
            Optraze
          </a>
          .
        </p>
      </div>
      <nav aria-label="Resource footer">
        <Link to="/docs">Docs</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/changelog">Changelog</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/privacy">Privacy</Link>
        <Link to="/terms">Terms</Link>
      </nav>
    </footer>
  )
}

export function ResourceLayout({
  active,
  children,
}: {
  active: 'blog' | 'changelog'
  children: ReactNode
}) {
  return (
    <div className={`resource-surface editorial-shell ${active}-shell`}>
      <a className="docs-skip" href="#resource-content">
        Skip to content
      </a>
      <ResourceHeader active={active} />
      {children}
      <ResourceFooter />
    </div>
  )
}
