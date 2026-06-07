'use client'

import type { Theme } from './theme-provider'

import type React from 'react'
import { useEffect } from 'react'

import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'

import { cn } from '@workspace/ui/lib/utils'

import { useTheme } from './theme-provider'

const THEMES: Array<Theme> = ['system', 'light', 'dark']

const OPTIONS: Array<{
  value: Theme
  icon: typeof SunIcon
  label: string
}> = [
  { value: 'system', icon: MonitorIcon, label: 'System' },
  { value: 'light', icon: SunIcon, label: 'Light' },
  { value: 'dark', icon: MoonIcon, label: 'Dark' },
]

function cycleTheme(current: Theme, setTheme: (theme: Theme) => void): void {
  const idx = THEMES.indexOf(current)
  setTheme(THEMES[(idx + 1) % THEMES.length])
}

export function ThemeSwitcher({
  className,
}: {
  className?: string
}): React.ReactElement {
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'd' && event.key !== 'D') return

      const target = event.target as HTMLElement | null
      const tag = target?.tagName
      if (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        event.isComposing
      ) {
        return
      }

      event.preventDefault()
      cycleTheme(theme, setTheme)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setTheme, theme])

  return (
    <div className={cn('group relative inline-flex', className)}>
      <div
        role="radiogroup"
        aria-label="Theme"
        className="inline-flex items-center gap-0.5 rounded-full bg-muted p-1"
      >
        {OPTIONS.map(({ value, icon: Icon, label }) => {
          const active = theme === value

          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={label}
              onClick={() => setTheme(value)}
              className={cn(
                'relative inline-flex size-7 items-center justify-center rounded-full transition-colors',
                active
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="size-3.5" aria-hidden="true" />
            </button>
          )
        })}
      </div>

      <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-md bg-foreground px-2.5 py-1.5 text-[10px] font-medium whitespace-nowrap text-background opacity-0 transition-opacity group-hover:opacity-100">
        Or press D
        <div className="absolute top-full left-1/2 -mt-px -translate-x-1/2 border-4 border-transparent border-t-foreground" />
      </div>
    </div>
  )
}
