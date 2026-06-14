import { Link } from '@tanstack/react-router'

import type { ResolvedNavGroup } from '../nav'

import { cn } from '@/lib/utils'

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
    <nav aria-label="Documentation" className="space-y-7">
      {nav.map((group) => (
        <div key={group.group}>
          <p className="mb-2 font-mono text-[11px] tracking-[0.18em] text-hint/90 uppercase">
            {group.group}
          </p>
          <ul className="space-y-0.5 border-l border-border">
            {group.items.map((item) => {
              const active = item.slug === currentSlug
              return (
                <li key={item.slug}>
                  <Link
                    to="/docs/$slug"
                    params={{ slug: item.slug }}
                    onClick={onNavigate}
                    className={cn(
                      '-ml-px block border-l py-1 pl-4 text-[13.5px] transition-colors',
                      active
                        ? 'border-foreground font-medium text-foreground'
                        : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
