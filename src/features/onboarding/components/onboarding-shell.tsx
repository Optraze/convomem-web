import { Link } from '@tanstack/react-router'
import { Check, Layers, Sparkles, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Logo } from '@/components/logo'
import { SITE_NAME } from '@/lib/seo.ts'

const ONBOARDING_STEPS = [
  { num: 1, label: 'Organization', hint: 'Name your workspace' },
  { num: 2, label: 'About you', hint: 'Your role & use case' },
  { num: 3, label: 'Preferences', hint: 'Timezone & privacy' },
] as const

const VALUE_PROPS = [
  { Icon: Layers, text: 'Memory that persists across every channel' },
  { Icon: Sparkles, text: 'Ask your data anything with an AI analyst' },
  { Icon: ShieldCheck, text: 'Enterprise-grade security & tenant isolation' },
]

function VerticalStepper({ current }: { current: number }) {
  return (
    <ol className="flex flex-col gap-1.5">
      {ONBOARDING_STEPS.map((s) => {
        const state =
          current > s.num ? 'done' : current === s.num ? 'active' : 'upcoming'
        const filled = state !== 'upcoming'

        return (
          <li
            key={s.num}
            aria-current={state === 'active' ? 'step' : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
              state === 'active'
                ? 'border border-border bg-background shadow-sm shadow-black/[0.03]'
                : 'border border-transparent'
            }`}
          >
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums transition-all ${
                filled
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-black/20'
                  : 'border border-border bg-background text-muted-foreground'
              }`}
            >
              {state === 'done' ? <Check size={13} strokeWidth={3} /> : s.num}
            </span>
            <div className="min-w-0">
              <div
                className={`text-[13px] font-medium leading-tight ${
                  state === 'active'
                    ? 'text-foreground'
                    : state === 'done'
                      ? 'text-muted-foreground'
                      : 'text-muted-foreground/60'
                }`}
              >
                {s.label}
              </div>
              <div
                className={`text-[11.5px] leading-tight ${
                  state === 'active'
                    ? 'text-muted-foreground'
                    : 'text-muted-foreground/40'
                }`}
              >
                {s.hint}
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function MobileStepper({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 lg:hidden" aria-hidden>
      {ONBOARDING_STEPS.map((s) => (
        <div
          key={s.num}
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            current >= s.num ? 'bg-primary' : 'bg-border'
          }`}
        />
      ))}
    </div>
  )
}

type OnboardingShellProps = {
  current: number
  icon?: LucideIcon
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function OnboardingShell({
  current,
  icon: Icon,
  title,
  subtitle,
  children,
}: OnboardingShellProps) {
  return (
    <div className="grid min-h-dvh w-full bg-background lg:grid-cols-[22rem_1fr]">
      {/* Left brand rail (desktop) */}
      <aside className="relative hidden flex-col justify-between overflow-hidden border-border border-r bg-gradient-to-b from-surface to-accent/60 p-10 lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              'radial-gradient(circle at center, var(--border) 1px, transparent 1.3px)',
            backgroundSize: '24px 24px',
            maskImage:
              'radial-gradient(ellipse 90% 60% at 30% 0%, #000 15%, transparent 80%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 90% 60% at 30% 0%, #000 15%, transparent 80%)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 -top-10 size-72 rounded-full bg-indigo-400/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -left-10 size-72 rounded-full bg-violet-400/10 blur-3xl"
        />

        <div className="relative flex items-center gap-2.5">
          <Logo className="size-8" />
          <span className="font-semibold text-lg tracking-[-0.03em]">
            {SITE_NAME}
          </span>
        </div>

        <div className="relative">
          <p className="mb-6 max-w-[15rem] text-[15px] font-semibold leading-snug tracking-tight text-foreground">
            A couple of quick steps and your workspace is ready.
          </p>
          <VerticalStepper current={current} />
        </div>

        <ul className="relative flex flex-col gap-3">
          {VALUE_PROPS.map(({ Icon: Vp, text }) => (
            <li
              key={text}
              className="flex items-center gap-2.5 text-[12.5px] text-muted-foreground"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                <Vp
                  size={13}
                  className="text-muted-foreground"
                  strokeWidth={1.75}
                />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </aside>

      {/* Right form panel */}
      <main className="flex flex-col overflow-y-auto px-5 py-8 sm:px-10">
        {/* Mobile header */}
        <div className="mb-8 flex flex-col gap-4 lg:hidden">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo className="size-8" />
            <span className="font-semibold text-lg tracking-[-0.03em]">
              {SITE_NAME}
            </span>
          </Link>
          <MobileStepper current={current} />
        </div>

        <div className="m-auto w-full max-w-[30rem] py-4">
          <div className="mb-7 flex items-start gap-3.5">
            {Icon && (
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-gradient-to-b from-surface to-accent shadow-sm shadow-black/[0.03]">
                <Icon
                  size={19}
                  className="text-foreground"
                  strokeWidth={1.75}
                />
              </div>
            )}
            <div className="pt-0.5">
              <h1 className="text-[22px] font-semibold leading-tight tracking-[-0.025em] text-foreground">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}
