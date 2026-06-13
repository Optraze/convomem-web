import { cn } from '@/lib/utils'

/* Crosshair marker: a tiny technical-drawing "+" used at frame corners.
   Monochrome instrument detail — the futuristic device, not a terminal. */
export function Crosshair({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('text-border-strong absolute h-3 w-3', className)}
    >
      <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
      <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current" />
    </span>
  )
}
