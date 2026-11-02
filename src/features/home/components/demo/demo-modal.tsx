import { X } from 'lucide-react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'

import { Logo } from '@/components/logo'
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
        <DialogOverlay className="customer-demo-backdrop" />
        <DialogPrimitive.Popup className="cm-light-surface customer-demo-dialog">
          <div className="customer-demo-header">
            <Logo appearance="light" />
            <div>
              <DialogTitle>Try customer memory</DialogTitle>
              <p>A conversation in. Useful context out.</p>
            </div>
            <DialogClose
              className="customer-demo-close"
              aria-label="Close demo"
            >
              <X size={19} />
            </DialogClose>
          </div>
          <div className="customer-demo-body">
            <MemoryTerminal />
          </div>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  )
}
