import type React from 'react'

const BACKGROUND = '#f7f5ef'

/** Clamp very long titles so they never overflow the 1200×630 canvas. */
export function clampTitle(title: string, max = 90): string {
  return title.length > max ? `${title.slice(0, max - 1).trimEnd()}…` : title
}

export function formatOgDate(date?: string): string {
  if (!date) return ''
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Shared chrome for every OG template: light brand background, brand mark, an
 * optional category badge, and the convomem.com footer. Children render in the
 * middle band.
 */
export function Frame({
  badge,
  children,
}: {
  badge?: string
  children: React.ReactNode
}) {
  return (
    <div
      tw="w-full h-full flex flex-col justify-between p-12"
      style={{ background: BACKGROUND, fontFamily: "'Inter', sans-serif" }}
    >
      <div tw="flex items-center justify-between">
        <div tw="flex items-center gap-3">
          <div
            tw="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: '#141414' }}
          >
            <div tw="w-3 h-3 rounded-full" style={{ background: '#fafafa' }} />
          </div>
          <span tw="text-[#172037] text-xl font-semibold">ConvoMem</span>
        </div>
        {badge && (
          <span
            tw="text-[#294bff] text-sm px-3 py-1 rounded-full"
            style={{
              border: '1px solid #cdd7ef',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {badge}
          </span>
        )}
      </div>

      <div tw="flex flex-col">{children}</div>

      <div tw="flex items-center gap-2">
        <div tw="w-2 h-2 rounded-full bg-[#294bff]" />
        <span
          tw="text-[#627087] text-sm"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          convomem.com
        </span>
      </div>
    </div>
  )
}
