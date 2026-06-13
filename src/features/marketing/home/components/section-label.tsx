/* Section header: index number + hairline + label, left-aligned */
export function SectionLabel({
  index,
  label,
}: {
  index: string
  label: string
}) {
  return (
    <div className="mb-7 flex items-center gap-4">
      <span className="tnum font-mono text-[11px] tracking-[0.2em] text-hint/70">
        {index}
      </span>
      <span className="h-px w-12 bg-foreground/15" />
      <span className="font-mono text-[11px] tracking-[0.24em] text-subtle/60 uppercase">
        {label}
      </span>
    </div>
  )
}
