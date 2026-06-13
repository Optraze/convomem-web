import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { Button } from '@/components/ui/button'

import { MemoryTerminal } from './memory-terminal'

/* ─────────────────────────────────────────────────────────────────────────
   DemoModal — an accessible dialog that hosts the live pipeline demo. Keeps
   the heavy interactive trace off the main page. Handles: Esc to close, click-
   outside to close, body scroll lock, focus move-in + restore, and a basic
   focus trap. ──────────────────────────────────────────────────────────── */

export function DemoModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const reduce = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const prevFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    prevFocus.current = document.activeElement as HTMLElement
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (!focusables || focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', onKey)
      prevFocus.current?.focus?.()
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-120 flex items-start sm:items-center justify-center p-0 sm:p-6">
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/70 backdrop-blur-md"
            aria-hidden
          />
          {/* panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="ConvoMem live pipeline demo"
            initial={
              reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.985 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.985 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full sm:max-w-3xl h-full sm:h-auto sm:max-h-[88vh] flex flex-col bg-surface border border-border-strong sm:rounded-2xl overflow-hidden shadow-2xl shadow-black/10"
          >
            {/* header */}
            <div className="relative flex items-center justify-between px-5 py-3.5 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex items-center justify-center w-6 h-6 rounded-[6px] bg-foreground"
                  aria-hidden
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-background" />
                </span>
                <div>
                  <p
                    className="text-foreground leading-none"
                    style={{ fontSize: '13px', fontWeight: 600 }}
                  >
                    Live pipeline
                  </p>
                  <span className="inline-flex items-center gap-1.5 mt-1.5 px-2 py-0.5 rounded-full bg-muted text-hint font-mono text-[9px] tracking-[0.08em] uppercase">
                    <span className="w-1 h-1 rounded-full bg-foreground animate-pulse" />
                    real model · nothing stored
                  </span>
                </div>
              </div>
              <Button
                ref={closeRef}
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={onClose}
                aria-label="Close demo"
              >
                <X size={16} />
              </Button>
              {/* accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
            </div>
            {/* body */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-5">
              <MemoryTerminal />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
