import type { HTMLAttributes } from 'react'

import { cn } from '@workspace/ui/lib/utils'

function Logo({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="logo"
      aria-hidden="true"
      className={cn(
        'inline-flex size-5.5 items-center justify-center rounded-[5px] bg-foreground',
        className
      )}
      {...props}
    >
      <span className="block size-[6.6px] rounded-full bg-background" />
    </span>
  )
}

export { Logo }
