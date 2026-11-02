import type { SVGProps } from 'react'

import { cn } from '@/lib/utils'

type LogoProps = SVGProps<SVGSVGElement> & {
  appearance?: 'auto' | 'light' | 'dark'
}

function Logo({ className, appearance = 'auto', ...props }: LogoProps) {
  const background =
    appearance === 'light'
      ? '#141414'
      : appearance === 'dark'
        ? '#fafafa'
        : undefined
  const foreground =
    appearance === 'light'
      ? '#fafafa'
      : appearance === 'dark'
        ? '#141414'
        : undefined
  return (
    <svg
      viewBox="0 0 22 22"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      role="img"
      aria-label="Convomem"
      className={cn('size-6', className)}
      {...props}
    >
      <style>
        {`.convomem-logo-bg{fill:#141414}.convomem-logo-fg{fill:#fafafa}html.dark .convomem-logo-bg{fill:#fafafa}html.dark .convomem-logo-fg{fill:#141414}`}
      </style>
      <rect
        className="convomem-logo-bg"
        style={{ fill: background }}
        width="22"
        height="22"
        rx="5"
      />
      <circle
        className="convomem-logo-fg"
        style={{ fill: foreground }}
        cx="11"
        cy="11"
        r="3.3"
      />
    </svg>
  )
}

export { Logo }
