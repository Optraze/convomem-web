import { Link } from '@tanstack/react-router'

import { ThemeSwitcher } from '@/components/theme-switcher'

const linkGroups = [
  {
    heading: 'Resources',
    items: [
      { label: 'Blog', to: '/blog' },
      { label: 'Docs', to: '/docs' },
      { label: 'Changelog', to: '/changelog' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    items: [
      { label: 'Privacy', to: '/privacy' },
      { label: 'Terms', to: '/terms' },
    ],
  },
] as const

export function ContentFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="space-y-3">
          {linkGroups.map((group) => (
            <div key={group.heading} className="flex items-baseline gap-3">
              <span className="shrink-0 font-mono text-[11px] tracking-[0.16em] text-hint/90 uppercase">
                {group.heading}
              </span>
              <span className="h-0 flex-1 border-t border-dotted border-border" />
              <div className="flex shrink-0 items-center gap-2 text-xs text-hint/75">
                {group.items.map((item, i) => (
                  <span key={item.to} className="flex items-center gap-2">
                    <Link
                      to={item.to}
                      className="transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                    {i < group.items.length - 1 && (
                      <span className="text-border">/</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <p className="font-mono text-[11px] text-hint/80">
            © {new Date().getFullYear()} ConvoMem
          </p>
          <ThemeSwitcher />
        </div>
      </div>

      <div
        className="mx-auto max-w-7xl overflow-hidden px-4 pt-8 sm:px-6"
        aria-hidden="true"
      >
        <p className="text-[clamp(4rem,16vw,14.5rem)] leading-none font-bold tracking-tight text-foreground/[0.04] text-center select-none">
          ConvoMem
        </p>
      </div>
    </footer>
  )
}
