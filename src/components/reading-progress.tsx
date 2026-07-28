import { useEffect, useState } from 'react'

/**
 * Thin scroll-progress bar pinned under the navbar.
 *
 * Reads progress off the document rather than a ref so it stays correct
 * regardless of which element actually scrolls. Hidden from assistive tech —
 * it duplicates information the scrollbar already conveys.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const scrollable = document.body.scrollHeight - window.innerHeight
      setProgress(scrollable <= 0 ? 0 : (window.scrollY / scrollable) * 100)
    }

    // rAF-throttled: scroll fires far more often than we can usefully paint.
    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-px bg-transparent"
    >
      <div
        className="h-full origin-left bg-foreground/40 transition-[width] duration-75 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
