import { useState } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'
import { motion } from 'motion/react'

import { Logo } from '@workspace/ui/components/logo.tsx'

import { useMarketingNavigation } from '../hooks/use-marketing-navigation.ts'

const navItems = [
  { label: 'Try it', id: 'try' },
  { label: 'In the wild', id: 'scenarios' },
  { label: 'Pricing', id: 'pricing' },
] as const

export function MarketingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { go, jumpToSection } = useMarketingNavigation({
    onNavigate: () => setMobileOpen(false),
  })

  return (
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
  )
}
