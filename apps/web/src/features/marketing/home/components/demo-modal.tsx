/* TODO: replace with the real demo modal. */
export function DemoModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-border bg-background p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm text-muted-foreground">Demo modal placeholder.</p>
      </div>
    </div>
  )
}
