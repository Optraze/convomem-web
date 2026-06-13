import { Link } from '@tanstack/react-router'

import { Logo } from '@/components/logo'

import { SITE_NAME } from '@/lib/seo.ts'

type AuthLayoutProps = {
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
}

export function AuthLayout({
  eyebrow,
  title,
  description,
  children,
}: AuthLayoutProps) {
  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)]">
      <aside className="hidden border-border border-r bg-surface/70 px-12 lg:flex lg:flex-col lg:justify-between lg:py-12 xl:px-16">
        <Link to="/" className="flex items-center gap-3">
          <Logo className="size-10" />
          <span className="font-semibold text-[22px] tracking-[-0.03em]">
            {SITE_NAME}
          </span>
        </Link>

        <div className="max-w-md">
          <p className="mb-4 font-mono text-[11px] tracking-[0.22em] text-hint/70 uppercase">
            {eyebrow}
          </p>
          <h1 className="font-semibold text-4xl tracking-[-0.04em] text-foreground leading-[1.08]">
            {title}
          </h1>
          <p className="mt-4 max-w-sm text-muted-foreground text-sm leading-6">
            {description}
          </p>
        </div>

        <p className="max-w-sm text-muted-foreground text-xs leading-5">
          Enterprise-grade conversation memory for AI products, support teams,
          and voice agents.
        </p>
      </aside>

      <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-8">
        <div className="w-full max-w-[420px]">
          <Link to="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <Logo className="size-9" />
            <span className="font-semibold text-lg tracking-[-0.03em]">
              {SITE_NAME}
            </span>
          </Link>

          {children}
        </div>
      </section>
    </main>
  )
}
