import { useMemo } from 'react'

import type { Toc } from '@/lib/content'

import { cn } from '@/lib/utils'

import { useActiveHeading } from '../hooks/use-active-heading'

interface FlatHeading {
  id: string
  text: string
  depth: number
}

function flatten(toc: Toc, acc: FlatHeading[] = []): FlatHeading[] {
  for (const entry of toc) {
    if (entry.id && entry.depth <= 3) {
      acc.push({ id: entry.id, text: entry.value, depth: entry.depth })
    }
    if (entry.children) flatten(entry.children, acc)
  }
  return acc
}

export function OnThisPage({ toc }: { toc: Toc }) {
  const items = useMemo(() => flatten(toc), [toc])
  const ids = useMemo(() => items.map((i) => i.id), [items])
  const active = useActiveHeading(ids)

  if (items.length === 0) return null

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-3 font-mono text-[11px] tracking-[0.18em] text-hint/90 uppercase">
        On this page
      </p>
      <ul className="space-y-2 border-l border-border">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: (item.depth - 2) * 12 }}>
            <a
              href={`#${item.id}`}
              className={cn(
                '-ml-px block border-l border-transparent pl-3 text-[13px] leading-snug transition-colors',
                active === item.id
                  ? 'border-foreground text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
