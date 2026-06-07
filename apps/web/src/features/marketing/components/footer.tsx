import { Logo } from '@workspace/ui/components/logo.tsx'
import { ThemeSwitcher } from '@workspace/ui/components/theme-switcher'

import { useMarketingNavigation } from '../hooks/use-marketing-navigation.ts'

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

export function MarketingFooter() {
  const { go, jumpToSection } = useMarketingNavigation()

  return (
    <footer className="border-t border-border bg-background px-5 py-12 sm:px-8">
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <div className="mb-10 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 flex items-start justify-between gap-6 md:col-span-1 md:flex-col md:justify-start">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Logo />
                <span className="font-mono text-[13px] font-semibold text-foreground">
                  ConvoMem
                </span>
              </div>
              <p
                className="max-w-55 text-hint/80"
                style={{ fontSize: '12px', lineHeight: 1.6 }}
              >
                The memory layer for conversational AI. API-first. On-prem
                available.
              </p>
            </div>
            <ThemeSwitcher />
          </div>

          {footerColumns.map((column) => (
            <div key={column.heading}>
              <p className="mb-3 font-mono text-[11px] tracking-[0.16em] text-hint/70 uppercase">
                {column.heading}
              </p>
              <div className="space-y-2">
                {column.items.map((item) => (
                  <button
                    key={item.label}
                    onClick={() =>
                      'href' in item
                        ? go(item.href)
                        : jumpToSection(item.action)
                    }
                    className="block text-hint/75 transition-colors hover:text-foreground"
                    style={{ fontSize: '12px' }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-border pt-8 sm:flex-row">
          <p className="font-mono text-[11px] text-hint/60">
            © {new Date().getFullYear()} ConvoMem
          </p>
          <p className="font-mono text-[11px] tracking-[0.12em] text-hint/60">
            API-first · On-prem on Custom · Zero lock-in
          </p>
        </div>
      </div>
    </footer>
  )
}
