import type { SVGProps } from 'react'

import { cn } from '@workspace/ui/lib/utils'

function Logo({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      id="convomem-logo"
      viewBox="0 0 22 22"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      role="img"
      aria-label="Convomem"
      className={cn('size-6', className)}
      {...props}
    >
      <style>
        {`.convomem-logo-bg{fill:#141414}.convomem-logo-fg{fill:#fafafa}@media (prefers-color-scheme: dark){.convomem-logo-bg{fill:#fafafa}.convomem-logo-fg{fill:#141414}}`}
      </style>
      <rect className="convomem-logo-bg" width="22" height="22" rx="5" />
      <circle className="convomem-logo-fg" cx="11" cy="11" r="3.3" />
    </svg>
  )
}

export { Logo }
