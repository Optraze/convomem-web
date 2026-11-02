import { ArrowUpRight } from 'lucide-react'
import { Link, useLocation } from '@tanstack/react-router'

import { Logo } from '@/components/logo'
import { ThemeSwitcher } from '@/components/theme-switcher'

export function MarketingFooter({
  appearance = 'light',
}: {
  appearance?: 'light' | 'dark'
} = {}) {
  const isHome = useLocation({
    select: (location) => location.pathname === '/',
  })
  return (
    <footer className="cm-footer" data-surface={appearance}>
      <div className="cm-footer-inner">
        <div className="cm-footer-top">
          <div>
            <Link to="/" hash="top" className="cm-brand">
              <Logo appearance={appearance} aria-hidden="true" />
              <span>ConvoMem</span>
            </Link>
            <p>
              The memory behind <br />
              better customer relationships.
            </p>
          </div>
          <div>
            <h3>PRODUCT</h3>
            <Link to="/" hash="features">
              Why ConvoMem
            </Link>
            <Link to="/" hash="try">
              Live demo
            </Link>
            <Link to="/" hash="pricing">
              Pricing
            </Link>
          </div>
          <div>
            <h3>EXPLORE</h3>
            <Link to="/docs">
              Documentation <ArrowUpRight size={12} />
            </Link>
            <Link to="/blog">Journal</Link>
            <Link to="/changelog">Changelog</Link>
            <Link to="/contact">Get in touch</Link>
          </div>
          <div>
            <h3>THE FINE PRINT</h3>
            <Link to="/privacy">Privacy policy</Link>
            <Link to="/terms">Terms of service</Link>
            {!isHome && <ThemeSwitcher />}
          </div>
        </div>
        <div className="cm-footer-bottom">
          <span>
            © {new Date().getFullYear()} ConvoMem. A product by{' '}
            <a href="https://optraze.com">Optraze ↗</a>
          </span>
          <span>
            <i /> Built for the next conversation.
          </span>
        </div>
      </div>
    </footer>
  )
}
