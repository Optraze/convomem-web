import { BookOpen } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import type { ResolvedNavGroup } from '../nav'

export function DocsSidebar({
  nav,
  currentSlug,
  onNavigate,
}: {
  nav: ResolvedNavGroup[]
  currentSlug: string
  onNavigate?: () => void
}) {
  return (
    <nav aria-label="Documentation" className="docs-sidebar">
      <Link
        className="docs-overview-link"
        activeOptions={{ exact: true }}
        to="/docs"
        aria-current={currentSlug === '' ? 'page' : undefined}
        onClick={onNavigate}
      >
        <BookOpen size={15} />
        Overview
      </Link>
      {nav.map((group) => (
        <div className="docs-nav-group" key={group.group}>
          <p>{group.group}</p>
          <ul>
            {group.items.map((item) => (
              <li key={item.slug}>
                <Link
                  to="/docs/$slug"
                  params={{ slug: item.slug }}
                  onClick={onNavigate}
                  aria-current={item.slug === currentSlug ? 'page' : undefined}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
