import type { ReactNode } from 'react'

type SectionHeadingProps = {
  children: ReactNode
  className?: string
  variant?: 'default' | 'lead'
}

const headingVariants = {
  default:
    'text-[clamp(22px,3.4vw,40px)] leading-[1.1] font-semibold tracking-[-0.035em]',
  lead: 'text-[clamp(22px,3.6vw,44px)] leading-[1.05] font-semibold tracking-[-0.04em]',
} as const

export function SectionHeading({
  children,
  className,
  variant = 'default',
}: SectionHeadingProps) {
  return (
    <h2
      className={`text-balance text-foreground ${headingVariants[variant]} ${className ?? ''}`}
    >
      {children}
    </h2>
  )
}
