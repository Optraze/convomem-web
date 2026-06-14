import { useRef, useState } from 'react'
import { CheckIcon, CopyIcon } from 'lucide-react'

import type React from 'react'

import { cn } from '@/lib/utils'

/**
 * Wraps the <pre> emitted by rehype-pretty-code with a copy-to-clipboard
 * button. The button reads the rendered <code> text on click, so it works
 * regardless of how Shiki tokenized the source.
 */
export function CodeBlock({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    const code = preRef.current?.querySelector('code')?.textContent ?? ''
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="group/code relative">
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'Copied' : 'Copy code'}
        className="absolute top-2.5 right-2.5 z-10 grid size-8 place-items-center rounded-md border border-border bg-background/80 text-muted-foreground opacity-0 backdrop-blur transition group-hover/code:opacity-100 hover:text-foreground focus-visible:opacity-100"
      >
        {copied ? (
          <CheckIcon className="size-4 text-emerald-500" />
        ) : (
          <CopyIcon className="size-4" />
        )}
      </button>
      <pre ref={preRef} className={cn(className)} {...props}>
        {children}
      </pre>
    </div>
  )
}
