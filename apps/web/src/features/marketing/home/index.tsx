import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, ArrowUpRight, Check, Menu, X } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

import { useNavigate } from '@tanstack/react-router'

import { Logo } from '@workspace/ui/components/logo.tsx'
import { ThemeSwitcher } from '@workspace/ui/components/theme-switcher'

import { CookieBanner } from './components/cookie-banner.tsx'
import { Crosshair } from './components/crosshair.tsx'
import { DemoModal } from './components/demo-modal.tsx'
import { FaqItem } from './components/faq-item.tsx'
import { MemoryRail } from './components/memory-rail.tsx'
import { ScenarioPlayer } from './components/scenario-player.tsx'
import { SectionLabel } from './components/section-label.tsx'
import {
  capabilities,
  EASE,
  enterprisePlans,
  faqs,
  pipeline,
  SECTIONS,
} from './data.ts'
import { useActiveSection } from './hooks/use-active-section.ts'

const navItems = [
  { label: 'Try it', id: 'try' },
  { label: 'In the wild', id: 'scenarios' },
  { label: 'Pricing', id: 'pricing' },
] as const

const trustItems = ['7-day trial', 'No card', 'On-prem on Custom'] as const

const heroStats = [
  { value: '∞', label: 'memory / customer' },
  { value: '4', label: 'channels unified' },
  { value: '<20ms', label: 'to recall · p95' },
  { value: '0', label: 'vendor lock-in' },
] as const

const pipelineSignal = [
  'extract',
  'filter',
  'score',
  'redact',
  'reconcile',
  'insights',
] as const

const footerColumns = [
  {
    heading: 'Product',
    items: [
      { label: 'Try it', action: 'try' },
      { label: 'Pricing', action: 'pricing' },
      { label: 'Docs', href: '/docs' },
    ],
  },
  {
    heading: 'Resources',
    items: [
      { label: 'Docs', href: '/docs' },
      { label: 'API Reference', href: '/docs' },
      { label: 'Contact', href: '/contact' },
      { label: 'Support', href: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    items: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Cookies', href: '/privacy' },
    ],
  },
] as const

export function Home() {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [demoOpen, setDemoOpen] = useState(false)
  const sectionIds = useMemo(() => SECTIONS.map((section) => section.id), [])
  const active = useActiveSection(sectionIds)

  useEffect(() => {
    if (!document.getElementById('ld-faq')) {
      const script = document.createElement('script')
      script.id = 'ld-faq'
      script.type = 'application/ld+json'
      script.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      })
      document.head.appendChild(script)
    }
    return () => document.getElementById('ld-faq')?.remove()
  }, [])

  const go = (href: string) => {
    setMobileOpen(false)
    void navigate({ href })
  }

  const jumpToSection = (id: string) => {
    setMobileOpen(false)
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground antialiased">
      <MemoryRail active={active} onJump={jumpToSection} />

      <nav className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-5 sm:px-8">
          <button
            onClick={() => jumpToSection('top')}
            className="flex items-center gap-2.5"
          >
            <Logo />
            <span className="font-mono text-[14px] font-semibold tracking-[-0.01em]">
              ConvoMem
            </span>
          </button>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((n) => (
              <button
                key={n.id}
                onClick={() => jumpToSection(n.id)}
                className="text-muted-foreground transition-colors hover:text-foreground"
                style={{ fontSize: '13px' }}
              >
                {n.label}
              </button>
            ))}
            <button
              onClick={() => go('/docs')}
              className="text-muted-foreground transition-colors hover:text-foreground"
              style={{ fontSize: '13px' }}
            >
              Docs
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => go('/login')}
              className="hidden px-2 text-muted-foreground transition-colors hover:text-foreground sm:block"
              style={{ fontSize: '13px' }}
            >
              Sign in
            </button>
            <button
              onClick={() => go('/register')}
              className="flex items-center gap-1.5 rounded-md bg-foreground px-3.5 py-1.5 text-background transition-opacity hover:opacity-90"
              style={{ fontSize: '13px', fontWeight: 500 }}
            >
              Start free <ArrowRight size={13} />
            </button>
            <button
              onClick={() => setMobileOpen((open) => !open)}
              className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-muted md:hidden"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 border-t border-border bg-background/95 px-5 py-4 backdrop-blur-xl md:hidden"
          >
            {navItems.map((n) => (
              <button
                key={n.id}
                onClick={() => jumpToSection(n.id)}
                className="block w-full text-left text-muted-foreground hover:text-foreground"
                style={{ fontSize: '13px' }}
              >
                {n.label}
              </button>
            ))}
            <button
              onClick={() => go('/docs')}
              className="block w-full text-left text-muted-foreground hover:text-foreground"
              style={{ fontSize: '13px' }}
            >
              Docs
            </button>
            <button
              onClick={() => go('/contact')}
              className="block w-full text-left text-muted-foreground hover:text-foreground"
              style={{ fontSize: '13px' }}
            >
              Contact
            </button>
          </motion.div>
        )}
      </nav>

      <main className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <section id="top" className="relative pt-20 pb-12 sm:pt-44 sm:pb-28">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[640px] overflow-hidden [mask-image:linear-gradient(to_bottom,black,transparent_85%)]">
            <div className="bg-blueprint absolute inset-0 text-foreground opacity-[0.08]" />
            {!reduce && (
              <div className="sweep-line absolute inset-x-0 top-0 h-px bg-foreground/[0.12]" />
            )}
          </div>

          <div className="relative">
            <Crosshair className="-top-3 -left-1.5" />
            <Crosshair className="-top-3 -right-1.5" />

            <div className="grid items-end gap-14 lg:grid-cols-[1fr_auto] lg:gap-20">
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <div className="mb-6 flex items-center gap-4 sm:mb-10">
                  <span className="tnum font-mono text-[11px] tracking-[0.2em] text-hint/60">
                    00
                  </span>
                  <span className="h-px w-12 bg-foreground/15" />
                  <span className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
                    Memory layer for conversational AI
                  </span>
                </div>

                <h1
                  className="text-balance"
                  style={{
                    fontWeight: 600,
                    letterSpacing: '-0.045em',
                    lineHeight: 0.94,
                  }}
                >
                  <span
                    className="block text-foreground"
                    style={{ fontSize: 'clamp(26px, 5.4vw, 66px)' }}
                  >
                    Every customer conversation,
                  </span>
                  <span
                    className="block text-foreground"
                    style={{
                      fontSize: 'clamp(34px, 10.5vw, 124px)',
                      letterSpacing: '-0.06em',
                    }}
                  >
                    remembered.
                  </span>
                </h1>

                <p
                  className="mt-6 max-w-md text-muted-foreground sm:mt-9"
                  style={{
                    fontSize: 'clamp(14px, 1.5vw, 16px)',
                    lineHeight: 1.7,
                  }}
                >
                  Voice bots, chat bots, and support agents forget every caller
                  the moment a session ends. ConvoMem gives them durable
                  customer memory — so the next interaction starts with context,
                  not repetition.
                </p>

                <div className="mt-6 flex flex-col items-start gap-3 sm:mt-9 sm:flex-row sm:items-center">
                  <button
                    onClick={() => go('/register')}
                    className="group flex items-center gap-2 rounded-md bg-foreground px-5 py-2.5 text-background transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{ fontSize: '14px', fontWeight: 500 }}
                  >
                    Start free trial
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </button>
                  <button
                    onClick={() => setDemoOpen(true)}
                    className="group border-border-strong flex items-center gap-2 rounded-md border px-5 py-2.5 text-foreground transition-all hover:bg-muted active:scale-[0.98]"
                    style={{ fontSize: '14px', fontWeight: 500 }}
                  >
                    Try the live demo
                    <ArrowUpRight
                      size={15}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-5 sm:mt-6">
                  {trustItems.map((t) => (
                    <span
                      key={t}
                      className="flex items-center gap-1.5 font-mono text-[11px] text-hint/75"
                    >
                      <Check size={11} className="text-foreground" /> {t}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.dl
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
                className="hidden grid-cols-1 border-l border-border lg:grid"
              >
                {heroStats.map((s) => (
                  <div
                    key={s.label}
                    className="border-b border-border py-4 pr-2 pl-8 last:border-0"
                  >
                    <dd className="tnum font-mono leading-none font-semibold tracking-[-0.03em] text-foreground">
                      <span style={{ fontSize: 'clamp(24px,2.4vw,36px)' }}>
                        {s.value}
                      </span>
                    </dd>
                    <dt className="mt-2.5 font-mono text-[10px] tracking-[0.16em] text-hint/70 uppercase">
                      {s.label}
                    </dt>
                  </div>
                ))}
              </motion.dl>
            </div>
          </div>
        </section>

        <section id="try" className="border-t border-border py-14 sm:py-28">
          <SectionLabel index="01" label="Try it" />
          <div className="max-w-2xl">
            <h2
              className="text-balance text-foreground"
              style={{
                fontSize: 'clamp(22px, 3.6vw, 44px)',
                fontWeight: 600,
                letterSpacing: '-0.04em',
                lineHeight: 1.05,
              }}
            >
              Run a message through the real pipeline.
            </h2>
            <p
              className="mt-6 text-muted-foreground"
              style={{ fontSize: '15px', lineHeight: 1.7 }}
            >
              Paste a message or drop a small CSV. It runs the same capture,
              scoring, redaction, reconciliation, and insight pipeline we use in
              production — streamed back live. Nothing is stored.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
              <button
                onClick={() => setDemoOpen(true)}
                className="group inline-flex items-center gap-2.5 rounded-md bg-foreground px-6 py-3 text-background transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ fontSize: '14px', fontWeight: 500 }}
              >
                Run the live demo
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </button>
              <button
                onClick={() => go('/docs')}
                className="group inline-flex items-center gap-2 px-3 py-3 text-muted-foreground transition-colors hover:text-foreground"
                style={{ fontSize: '14px', fontWeight: 500 }}
              >
                Read the docs
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </button>
            </div>

            <p className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] tracking-[0.14em] text-hint/75">
              {pipelineSignal.map((s, i) => (
                <span key={s} className="flex items-center gap-2">
                  {i > 0 && <span className="text-ghost/70">→</span>}
                  <span>{s}</span>
                </span>
              ))}
            </p>
          </div>
        </section>

        <section id="scenarios" className="py-12 sm:py-20">
          <SectionLabel index="02" label="In the wild" />
          <div className="grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
            <div className="lg:sticky lg:top-24">
              <h2
                className="text-balance text-foreground"
                style={{
                  fontSize: 'clamp(22px, 3.4vw, 40px)',
                  fontWeight: 600,
                  letterSpacing: '-0.035em',
                  lineHeight: 1.1,
                }}
              >
                What it feels like for your customer.
              </h2>
              <p
                className="mt-5 max-w-sm text-muted-foreground"
                style={{ fontSize: '14px', lineHeight: 1.75 }}
              >
                Three real moments — a returning caller, a frustrated customer,
                an expansion. In each one, the agent already knows the story.
              </p>
            </div>
            <ScenarioPlayer />
          </div>
        </section>

        <section
          id="features"
          className="border-t border-border py-12 sm:py-24"
        >
          <SectionLabel index="03" label="Capabilities" />
          <h2
            className="mb-10 text-balance text-foreground"
            style={{
              fontSize: 'clamp(22px, 3.4vw, 40px)',
              fontWeight: 600,
              letterSpacing: '-0.035em',
              lineHeight: 1.1,
            }}
          >
            Customer intelligence,
            <br className="hidden sm:block" /> assembled automatically.
          </h2>

          <div role="list" className="border-t border-border">
            {capabilities.map((c, i) => (
              <motion.div
                role="listitem"
                key={c.term}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
                className="group -mx-4 grid grid-cols-1 gap-x-8 gap-y-2 rounded-md border-b border-border px-4 py-6 transition-colors hover:bg-muted/40 md:grid-cols-[auto_1fr_auto] md:items-baseline"
              >
                <div className="flex items-baseline gap-4 md:w-64">
                  <span className="tnum font-mono text-[11px] text-hint/60">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3
                    className="text-foreground transition-transform group-hover:translate-x-0.5"
                    style={{
                      fontSize: '17px',
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {c.term}
                  </h3>
                </div>
                <p
                  className="max-w-xl text-muted-foreground"
                  style={{ fontSize: '13.5px', lineHeight: 1.7 }}
                >
                  {c.desc}
                </p>
                <span className="font-mono text-[11px] whitespace-nowrap text-hint/70 md:text-right">
                  {c.tag}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        <section
          id="how-it-works"
          className="border-t border-border py-12 sm:py-24"
        >
          <SectionLabel index="04" label="Pipeline" />
          <h2
            className="mb-10 text-balance text-foreground"
            style={{
              fontSize: 'clamp(22px, 3.4vw, 40px)',
              fontWeight: 600,
              letterSpacing: '-0.035em',
              lineHeight: 1.1,
            }}
          >
            Three steps. Zero friction.
          </h2>

          <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
            {pipeline.map((p) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45 }}
                className="bg-background p-7"
              >
                <div className="mb-6 flex items-baseline justify-between">
                  <span className="tnum font-mono text-[clamp(30px,5vw,52px)] leading-none font-semibold tracking-[-0.04em] text-foreground">
                    {p.step}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-hint/60 uppercase">
                    step
                  </span>
                </div>
                <h3
                  className="mb-2 text-foreground"
                  style={{ fontSize: '16px', fontWeight: 600 }}
                >
                  {p.title}
                </h3>
                <p
                  className="text-muted-foreground"
                  style={{ fontSize: '13.5px', lineHeight: 1.75 }}
                >
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="pricing" className="border-t border-border py-12 sm:py-24">
          <SectionLabel index="05" label="Pricing" />
          <h2
            className="mb-10 text-balance text-foreground"
            style={{
              fontSize: 'clamp(22px, 3.4vw, 40px)',
              fontWeight: 600,
              letterSpacing: '-0.035em',
              lineHeight: 1.1,
            }}
          >
            Transparent. No surprises.
          </h2>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {enterprisePlans.map((plan) => {
              const hi = plan.highlighted
              return (
                <div
                  key={plan.name}
                  className={`relative flex flex-col p-6 ${
                    hi ? 'bg-foreground text-background' : 'bg-background'
                  }`}
                >
                  {hi && (
                    <span className="absolute top-6 right-6 font-mono text-[9px] tracking-[0.18em] text-background/60 uppercase">
                      popular
                    </span>
                  )}
                  <h3
                    style={{ fontSize: '14px', fontWeight: 600 }}
                    className={hi ? 'text-background' : 'text-foreground'}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`mt-1 ${
                      hi ? 'text-background/55' : 'text-muted-foreground'
                    }`}
                    style={{ fontSize: '12px' }}
                  >
                    {plan.description}
                  </p>
                  <div className="mt-5 mb-5">
                    {plan.price !== null ? (
                      <>
                        <span
                          className={`tnum font-mono ${
                            hi ? 'text-background' : 'text-foreground'
                          }`}
                        >
                          <span
                            style={{
                              fontSize: '34px',
                              fontWeight: 600,
                              letterSpacing: '-0.04em',
                            }}
                          >
                            ${plan.price}
                          </span>
                        </span>
                        <span
                          className={`ml-1 ${
                            hi ? 'text-background/45' : 'text-hint/70'
                          }`}
                          style={{ fontSize: '13px' }}
                        >
                          /{plan.period}
                        </span>
                      </>
                    ) : (
                      <span
                        className={`font-mono ${
                          hi ? 'text-background' : 'text-foreground'
                        }`}
                        style={{
                          fontSize: '26px',
                          fontWeight: 600,
                          letterSpacing: '-0.03em',
                        }}
                      >
                        Custom
                      </span>
                    )}
                  </div>
                  <ul className="mb-6 flex-1 space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check
                          size={12}
                          className={`mt-0.5 flex-shrink-0 ${
                            hi ? 'text-background/70' : 'text-foreground'
                          }`}
                        />
                        <span
                          style={{ fontSize: '12px', lineHeight: 1.5 }}
                          className={
                            hi ? 'text-background/75' : 'text-subtle/80'
                          }
                        >
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() =>
                      go(plan.price !== null ? '/register' : '/contact')
                    }
                    className={`w-full rounded-md py-2 transition-all ${
                      hi
                        ? 'bg-background text-foreground hover:opacity-90'
                        : 'border-border-strong border text-foreground hover:bg-muted'
                    }`}
                    style={{ fontSize: '13px', fontWeight: 500 }}
                  >
                    {plan.cta}
                  </button>
                </div>
              )
            })}
          </div>
        </section>

        <section id="faq" className="border-t border-border py-12 sm:py-24">
          <SectionLabel index="06" label="Questions" />
          <h2
            className="mb-8 text-balance text-foreground"
            style={{
              fontSize: 'clamp(22px, 3.4vw, 40px)',
              fontWeight: 600,
              letterSpacing: '-0.035em',
              lineHeight: 1.1,
            }}
          >
            Questions, answered.
          </h2>
          <div className="border-b border-border">
            {faqs.map((f, i) => (
              <FaqItem
                key={f.q}
                q={f.q}
                a={f.a}
                index={String(i + 1).padStart(2, '0')}
              />
            ))}
          </div>
        </section>

        <section className="border-t border-border py-14 sm:py-28">
          <div className="border-border-strong bg-surface relative overflow-hidden rounded-2xl border px-5 py-10 text-center sm:px-12 sm:py-14">
            <div className="bg-blueprint pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] text-foreground opacity-[0.4]" />
            <div className="relative">
              <p className="mb-4 font-mono text-[11px] tracking-[0.24em] text-hint/70 uppercase sm:mb-5">
                Every conversation remembered · from the first call
              </p>
              <h2
                className="mx-auto max-w-2xl text-balance text-foreground"
                style={{
                  fontSize: 'clamp(22px, 4.5vw, 52px)',
                  fontWeight: 600,
                  letterSpacing: '-0.04em',
                  lineHeight: 1.05,
                }}
              >
                Stop introducing your AI to the same customer twice.
              </h2>
              <p
                className="mx-auto mt-5 max-w-md text-muted-foreground"
                style={{ fontSize: '14px', lineHeight: 1.7 }}
              >
                Start your 7-day free trial. No credit card. On-prem deployment
                available on the Custom tier.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => go('/register')}
                  className="flex items-center gap-2 rounded-md bg-foreground px-6 py-2.5 text-background transition-opacity hover:opacity-90"
                  style={{ fontSize: '14px', fontWeight: 500 }}
                >
                  Start free trial <ArrowRight size={15} />
                </button>
                <button
                  onClick={() => go('/contact')}
                  className="border-border-strong flex items-center gap-2 rounded-md border px-6 py-2.5 text-foreground transition-colors hover:bg-muted"
                  style={{ fontSize: '14px', fontWeight: 500 }}
                >
                  Talk to sales
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background px-5 py-12 sm:px-8">
        <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
          <div className="mb-10 grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4 flex items-center gap-2">
                <Logo />
                <span className="font-mono text-[13px] font-semibold text-foreground">
                  ConvoMem
                </span>
              </div>
              <p
                className="max-w-[220px] text-hint/80"
                style={{ fontSize: '12px', lineHeight: 1.6 }}
              >
                The memory layer for conversational AI. API-first. On-prem
                available.
              </p>
            </div>
            {footerColumns.map((col) => (
              <div key={col.heading}>
                <p className="mb-3 font-mono text-[11px] tracking-[0.16em] text-hint/70 uppercase">
                  {col.heading}
                </p>
                <div className="space-y-2">
                  {col.items.map((it) => (
                    <button
                      key={it.label}
                      onClick={() =>
                        'href' in it ? go(it.href) : jumpToSection(it.action)
                      }
                      className="block text-hint/75 transition-colors hover:text-foreground"
                      style={{ fontSize: '12px' }}
                    >
                      {it.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center justify-between gap-3 border-t border-border pt-8 sm:flex-row">
            <p className="font-mono text-[11px] text-hint/60">
              © 2026 ConvoMem
            </p>
            <ThemeSwitcher />
            <p className="font-mono text-[11px] tracking-[0.12em] text-hint/60">
              API-first · On-prem on Custom · Zero lock-in
            </p>
          </div>
        </div>
      </footer>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
      <CookieBanner />
    </div>
  )
}
