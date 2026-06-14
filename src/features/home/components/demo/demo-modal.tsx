import { X } from 'lucide-react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog'

import { MemoryTerminal } from './memory-terminal'

export function DemoModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPortal>
        <DialogOverlay className="bg-background/70" />
        <DialogPrimitive.Popup className="fixed top-1/2 left-1/2 z-50 flex h-full w-full -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden border border-border-strong bg-popover shadow-2xl shadow-black/10 outline-none duration-200 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 sm:h-auto sm:max-h-[88vh] sm:w-full sm:max-w-3xl sm:rounded-2xl">
          {/* header */}
          <div className="relative flex items-center justify-between px-5 py-3.5 border-b border-border shrink-0">
            <div className="flex items-center gap-3">
              <span
                className="inline-flex items-center justify-center w-6 h-6 rounded-[6px] bg-foreground"
                aria-hidden
              >
                <span className="w-1.5 h-1.5 rounded-full bg-background" />
              </span>
              <div>
                <DialogTitle
                  className="text-foreground leading-none"
                  style={{ fontSize: '13px', fontWeight: 600 }}
                >
                  Live pipeline
                </DialogTitle>
                <span className="inline-flex items-center justify-center gap-1 px-2 mt-0.5 rounded-full bg-muted text-hint font-mono text-[9px] tracking-[0.08em] uppercase">
                  <span className="h-1 w-1 rounded-full bg-foreground animate-blink" />
                  real model · nothing stored
                </span>
              </div>
            </div>
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Close demo"
                />
              }
            >
              <X size={16} />
            </DialogClose>
            {/* accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-foreground/20 to-transparent" />
          </div>
          {/* body */}
          <div className="flex-1 overflow-y-auto scrollbar-hide p-5">
            <MemoryTerminal />
          </div>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  )
}
