import { useEffect, useMemo, useRef, useState } from 'react'
import { FileTextIcon, HashIcon, SearchIcon, XIcon } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

import type { DocSearchEntry } from '../nav'
import type { DocSearchHit } from '../search'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

import { searchDocs } from '../search'

export function DocsSearch({ index }: { index: DocSearchEntry[] }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const hits = useMemo(() => searchDocs(index, query), [index, query])

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

  useEffect(() => {
    if (open)
      document
        .getElementById(`docs-hit-${active}`)
        ?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  const go = (hit: DocSearchHit) => {
    setOpen(false)
    navigate({
      to: '/docs/$slug',
      params: { slug: hit.slug },
      hash: hit.hash,
    })
  }

  const onListKey = (e: React.KeyboardEvent) => {
    if (!hits.length) return
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
            aria-label="Search documentation"
            className="docs-search-trigger flex items-center gap-2 rounded-md border border-border bg-muted/40 px-2.5 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-muted sm:w-56"
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
        className="resource-surface docs-search-dialog top-[12vh] max-w-lg translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-lg"
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
            role="combobox"
            aria-expanded="true"
            aria-controls="docs-search-results"
            aria-autocomplete="list"
            aria-activedescendant={
              hits[active] ? `docs-hit-${active}` : undefined
            }
            className="min-w-0 flex-1 bg-transparent py-3.5 text-sm outline-none placeholder:text-muted-foreground"
          />
          <DialogClose className="docs-search-close" aria-label="Close search">
            <XIcon size={18} />
          </DialogClose>
        </div>
        <div
          id="docs-search-results"
          role="listbox"
          aria-label="Documentation results"
          className="max-h-80 overflow-y-auto p-2"
        >
          {hits.length === 0 && (
            <div
              role="presentation"
              className="px-3 py-6 text-center text-sm text-muted-foreground"
            >
              No results for “{query}”.
            </div>
          )}
          {hits.map((hit, i) => (
            <div role="presentation" key={`${hit.slug}-${hit.hash ?? 'root'}`}>
              <button
                type="button"
                role="option"
                id={`docs-hit-${i}`}
                aria-selected={i === active}
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
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
