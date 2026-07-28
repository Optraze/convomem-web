import { cn } from '@/lib/utils'

/** "ConvoMem Team" -> "CT", "Ada Lovelace" -> "AL". Falls back to one letter. */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

interface AuthorBylineProps {
  author?: string
  date?: string
  readingTime: number
  className?: string
}

/**
 * Byline for long-form content: who wrote it, when, and how long it takes.
 * Uses a generated initials avatar — the site ships no author images, and a
 * consistent monogram reads better than a placeholder face.
 */
export function AuthorByline({
  author,
  date,
  readingTime,
  className,
}: AuthorBylineProps) {
  const name = author ?? 'ConvoMem'

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span
        aria-hidden="true"
        className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-muted font-mono text-[11px] font-semibold text-muted-foreground"
      >
        {initials(name)}
      </span>
      <div className="min-w-0 text-[13px] leading-tight">
        <p className="font-medium text-foreground">{name}</p>
        <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-muted-foreground">
          {date && (
            <time dateTime={date}>
              {new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}
          {date && <span aria-hidden="true">·</span>}
          <span>{readingTime} min read</span>
        </p>
      </div>
    </div>
  )
}
