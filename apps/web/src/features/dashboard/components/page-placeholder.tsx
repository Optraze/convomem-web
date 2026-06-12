type PagePlaceholderProps = {
  title: string
  description?: string
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <h1 className="font-semibold text-2xl tracking-[-0.03em]">{title}</h1>
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
      <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-border p-10">
        <p className="text-muted-foreground text-sm">Coming soon</p>
      </div>
    </div>
  )
}
