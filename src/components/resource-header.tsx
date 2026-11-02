import { useEffect, useRef } from 'react'
import { Check, Menu, Monitor, Moon, Sun } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import type { ReactNode } from 'react'

import { Logo } from './logo'
import { useTheme } from './theme-provider'

export const resourceLinks = [
  { label: 'Documentation', to: '/docs' },
  { label: 'Blog', to: '/blog' },
  { label: 'Changelog', to: '/changelog' },
] as const

export function AppearanceMenu() {
  const { theme, setTheme } = useTheme()
  const details = useRef<HTMLDetailsElement>(null)
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (details.current && !details.current.contains(event.target as Node))
        details.current.open = false
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && details.current?.open) {
        details.current.open = false
        details.current.querySelector('summary')?.focus()
        event.stopPropagation()
      }
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])
  return (
    <details className="resource-appearance" ref={details}>
      <summary aria-label="Choose color theme" title="Appearance">
        <Sun size={17} className="theme-light-icon" />
        <Moon size={17} className="theme-dark-icon" />
      </summary>
      <div className="appearance-options">
        <p>Appearance</p>
        {(
          [
            ['light', 'Light', Sun],
            ['dark', 'Dark', Moon],
            ['system', 'System', Monitor],
          ] as const
        ).map(([value, label, Icon]) => (
          <button
            type="button"
            key={value}
            aria-pressed={theme === value}
            onClick={() => {
              setTheme(value)
              if (details.current) details.current.open = false
            }}
          >
            <Icon size={16} />
            <span>{label}</span>
            {theme === value && <Check size={14} />}
          </button>
        ))}
      </div>
    </details>
  )
}

export function ResourceHeader({
  active,
  search,
  menu,
}: {
  active: 'docs' | 'blog' | 'changelog'
  search?: ReactNode
  menu?: ReactNode
}) {
  const mobile = useRef<HTMLDetailsElement>(null)
  return (
    <header className="resource-header">
      <div className="resource-header-inner">
        {menu}
        <Link to="/" hash="top" className="resource-brand">
          <Logo aria-hidden="true" />
          <span>ConvoMem</span>
        </Link>
        <span className="resource-divider" aria-hidden="true">
          /
        </span>
        <Link to={`/${active}`} className="resource-section">
          {active === 'docs'
            ? 'Docs'
            : active === 'blog'
              ? 'Journal'
              : 'Changelog'}
        </Link>
        <nav className="resource-links" aria-label="Resources">
          {resourceLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              aria-current={link.to === `/${active}` ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="resource-header-actions">
          {search}
          <AppearanceMenu />
          <a className="resource-dashboard" href="https://app.convomem.com">
            Dashboard
          </a>
          {!menu && (
            <details className="resource-mobile-nav" ref={mobile}>
              <summary aria-label="Open resources navigation">
                <Menu size={20} />
              </summary>
              <nav aria-label="Mobile resources">
                {resourceLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => {
                      if (mobile.current) mobile.current.open = false
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </details>
          )}
        </div>
      </div>
    </header>
  )
}
