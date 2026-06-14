import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import type { ResolvedNavItem } from '../nav'

export function DocPager({
  prev,
  next,
}: {
  prev: ResolvedNavItem | null
  next: ResolvedNavItem | null
}) {
  if (!prev && !next) return null
  return (
    <nav className="mt-12 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
      {prev ? (
        <Link
          to="/docs/$slug"
          params={{ slug: prev.slug }}
          className="group flex flex-col rounded-lg border border-border p-4 transition-colors hover:bg-muted/40"
        >
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ArrowLeftIcon className="size-3.5" /> Previous
          </span>
          <span className="mt-1 font-medium text-foreground">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          to="/docs/$slug"
          params={{ slug: next.slug }}
          className="group flex flex-col rounded-lg border border-border p-4 text-right transition-colors hover:bg-muted/40"
        >
          <span className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
            Next <ArrowRightIcon className="size-3.5" />
          </span>
          <span className="mt-1 font-medium text-foreground">{next.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}
