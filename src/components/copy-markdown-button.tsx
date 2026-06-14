import { useState } from 'react'
import { CheckIcon, CopyIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

export function CopyMarkdownButton({
  mdUrl,
  className,
}: {
  mdUrl: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  const onClick = async () => {
    try {
      const res = await fetch(mdUrl)
      const text = await res.text()
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard access can be denied by the browser — fail silently.
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
        className
      )}
    >
      {copied ? (
        <CheckIcon className="size-3" />
      ) : (
        <CopyIcon className="size-3" />
      )}
      {copied ? 'Copied' : 'Copy as Markdown'}
    </button>
  )
}
