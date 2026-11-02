import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import { Logo } from '@/components/logo'

export function MarketingNavbar({
  appearance = 'light',
}: {
  appearance?: 'light' | 'dark'
} = {}) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        document.getElementById('marketing-menu-toggle')?.focus()
      }
    }
    const closeWhenNavigationFits = () => {
      const toggle = document.getElementById('marketing-menu-toggle')
      if (toggle && getComputedStyle(toggle).display === 'none') setOpen(false)
    }
    window.addEventListener('resize', closeWhenNavigationFits)
    window.addEventListener('keydown', close)
    return () => {
      window.removeEventListener('resize', closeWhenNavigationFits)
      window.removeEventListener('keydown', close)
    }
  }, [open])
  return (
    <header className="cm-header" data-surface={appearance}>
      <a className="cm-skip-link" href="#main-content">
        Skip to content
      </a>
      <nav className="cm-nav" aria-label="Main navigation">
        <Link
          to="/"
          hash="top"
          className="cm-brand"
          onClick={() => setOpen(false)}
        >
          <Logo appearance={appearance} aria-hidden="true" />
          <span>ConvoMem</span>
        </Link>
        <div className="cm-nav-links">
          <Link
            to="/"
            hash="feature-catalog"
            activeOptions={{ exact: true, includeHash: true }}
            activeProps={{ className: 'cm-section-active' }}
          >
            Platform
          </Link>
          <Link
            to="/"
            hash="how-it-works"
            activeOptions={{ exact: true, includeHash: true }}
            activeProps={{ className: 'cm-section-active' }}
          >
            How it works
          </Link>
          <Link
            to="/"
            hash="analytics"
            activeOptions={{ exact: true, includeHash: true }}
            activeProps={{ className: 'cm-section-active' }}
          >
            Intelligence
          </Link>
          <Link
            to="/"
            hash="pricing"
            activeOptions={{ exact: true, includeHash: true }}
            activeProps={{ className: 'cm-section-active' }}
          >
            Pricing
          </Link>
          <Link to="/docs">
            Developers <ArrowUpRight size={12} />
          </Link>
        </div>
        <div className="cm-nav-actions">
          <a className="cm-login" href="https://app.convomem.com/login">
            Log in
          </a>
          <a className="cm-nav-cta" href="https://app.convomem.com/register">
            Get started <ArrowUpRight size={14} />
          </a>
          <button
            id="marketing-menu-toggle"
            className="cm-menu-toggle"
            type="button"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </nav>
      {open && (
        <nav
          id="mobile-navigation"
          className="cm-mobile-nav"
          aria-label="Mobile navigation"
        >
          {[
            { label: 'Platform', hash: 'feature-catalog' },
            { label: 'Intelligence', hash: 'analytics' },
            { label: 'How it works', hash: 'how-it-works' },
            { label: 'Pricing', hash: 'pricing' },
          ].map((item) => (
            <Link
              key={item.hash}
              to="/"
              hash={item.hash}
              activeOptions={{ exact: true, includeHash: true }}
              activeProps={{ className: 'cm-section-active' }}
              onClick={() => setOpen(false)}
            >
              {item.label}
              <ArrowUpRight size={16} />
            </Link>
          ))}
          <Link to="/docs" onClick={() => setOpen(false)}>
            Developers
          </Link>
          <Link to="/contact" onClick={() => setOpen(false)}>
            Contact
          </Link>
          <a href="https://app.convomem.com/login">Log in</a>
          <a
            className="cm-mobile-start"
            href="https://app.convomem.com/register"
          >
            Start your free trial <ArrowUpRight size={16} />
          </a>
        </nav>
      )}
    </header>
  )
}
