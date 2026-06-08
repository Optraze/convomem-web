import { useState } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from '@tanstack/react-router'

import { Logo } from '@workspace/ui/components/logo.tsx'

import { useMarketingNavigation } from '../hooks/use-marketing-navigation.ts'

const navItems = [
  { label: 'Try it', hash: 'try' },
  { label: 'In the wild', hash: 'scenarios' },
  { label: 'Pricing', hash: 'pricing' },
] as const

export function MarketingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { jumpToSection } = useMarketingNavigation({
    onNavigate: () => setMobileOpen(false),
  })

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-5 sm:px-8">
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2.5"
        >
          <Logo />
          <span className="font-mono text-[14px] font-semibold tracking-[-0.01em]">
            ConvoMem
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((n) => (
            <Link
              key={n.hash}
              to="/"
              hash={n.hash}
              onClick={() => jumpToSection(n.hash)}
              className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/docs"
            className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            Docs
          </Link>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/contact"
            className="hidden px-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Contact
          </Link>
          <Link
            to="/contact"
            className="flex items-center gap-1.5 rounded-md bg-foreground px-3.5 py-1.5 font-medium text-[13px] text-background transition-opacity hover:opacity-90"
          >
            Talk to sales <ArrowRight size={13} />
          </Link>
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
            <Link
              key={n.hash}
              to="/"
              hash={n.hash}
              onClick={() => jumpToSection(n.hash)}
              className="block w-full text-left text-[13px] text-muted-foreground hover:text-foreground"
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/docs"
            onClick={() => setMobileOpen(false)}
            className="block w-full text-left text-[13px] text-muted-foreground hover:text-foreground"
          >
            Docs
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileOpen(false)}
            className="block w-full text-left text-[13px] text-muted-foreground hover:text-foreground"
          >
            Contact
          </Link>
        </motion.div>
      )}
    </nav>
  )
}
