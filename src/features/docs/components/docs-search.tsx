import { useEffect, useMemo, useRef, useState } from 'react'
import { FileTextIcon, HashIcon, SearchIcon } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

import type { DocSearchEntry } from '../nav'

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface Hit {
  slug: string
  title: string
  /** Heading hit within a doc, if any. */
  hash?: string
  label: string
}

function search(index: DocSearchEntry[], q: string): Hit[] {
  const query = q.trim().toLowerCase()
  if (!query) {
    return index.map((e) => ({ slug: e.slug, title: e.title, label: e.title }))
  }
  const hits: Hit[] = []
  for (const e of index) {
    const inTitle =
      e.title.toLowerCase().includes(query) ||
      e.description.toLowerCase().includes(query)
    if (inTitle) hits.push({ slug: e.slug, title: e.title, label: e.title })
    for (const h of e.headings) {
      if (h.text.toLowerCase().includes(query)) {
        hits.push({
          slug: e.slug,
          title: e.title,
          hash: h.id,
          label: h.text,
        })
      }
    }
  }
  return hits.slice(0, 12)
}

export function DocsSearch({ index }: { index: DocSearchEntry[] }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const hits = useMemo(() => search(index, query), [index, query])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
    }
  }, [open])

  const go = (hit: Hit) => {
    setOpen(false)
    navigate({
      to: '/docs/$slug',
      params: { slug: hit.slug },
      hash: hit.hash,
    })
  }

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, hits.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter' && hits[active]) {
      e.preventDefault()
      go(hits[active])
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-2.5 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-muted sm:w-56"
          />
        }
      >
        <SearchIcon className="size-3.5" />
        <span className="hidden sm:inline">Search docs…</span>
        <kbd className="ml-auto hidden rounded border border-border bg-background px-1.5 font-mono text-[10px] sm:inline">
          ⌘K
        </kbd>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        initialFocus={inputRef}
        className="top-[12vh] max-w-lg translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-lg"
      >
        <DialogTitle className="sr-only">Search documentation</DialogTitle>
        <div className="flex items-center gap-2.5 border-b border-border px-4">
          <SearchIcon className="size-4 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            onKeyDown={onListKey}
            placeholder="Search documentation…"
            className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <ul className="max-h-80 overflow-y-auto p-2">
          {hits.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">
              No results for “{query}”.
            </li>
          )}
          {hits.map((hit, i) => (
            <li key={`${hit.slug}-${hit.hash ?? 'root'}`}>
              <button
                type="button"
                onClick={() => go(hit)}
                onMouseEnter={() => setActive(i)}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm',
                  i === active
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {hit.hash ? (
                  <HashIcon className="size-3.5 shrink-0 text-hint" />
                ) : (
                  <FileTextIcon className="size-3.5 shrink-0 text-hint" />
                )}
                <span className="truncate">{hit.label}</span>
                {hit.hash && (
                  <span className="ml-auto shrink-0 truncate text-xs text-hint">
                    {hit.title}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  )
}
