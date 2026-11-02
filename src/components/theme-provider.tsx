import { createContext, useContext, useEffect, useState } from 'react'

import type React from 'react'

export type Theme = 'dark' | 'light' | 'system'
type ResolvedTheme = Exclude<Theme, 'system'>
const DEFAULT_THEME = 'system'
const THEME_STORAGE_KEY = 'vite-ui-theme'
const isTheme = (value: unknown): value is Theme =>
  value === 'light' || value === 'dark' || value === 'system'

type ThemeProviderState = {
  defaultTheme: Theme
  resolvedTheme: ResolvedTheme
  theme: Theme
  setTheme: (theme: Theme) => void
  resetTheme: () => void
}
const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined
)

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = THEME_STORAGE_KEY,
}: {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [systemDark, setSystemDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const resolvedTheme: ResolvedTheme =
    theme === 'system' ? (systemDark ? 'dark' : 'light') : theme

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const systemChange = () => setSystemDark(media.matches)
    systemChange()
    try {
      const stored = localStorage.getItem(storageKey)
      setThemeState(isTheme(stored) ? stored : defaultTheme)
    } catch {
      setThemeState(defaultTheme)
    }
    setMounted(true)
    const storageChange = (event: StorageEvent) => {
      if (event.key === storageKey || event.key === null)
        setThemeState(isTheme(event.newValue) ? event.newValue : defaultTheme)
    }
    media.addEventListener('change', systemChange)
    window.addEventListener('storage', storageChange)
    return () => {
      media.removeEventListener('change', systemChange)
      window.removeEventListener('storage', storageChange)
    }
  }, [defaultTheme, storageKey])

  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    root.classList.toggle('dark', resolvedTheme === 'dark')
    root.classList.toggle('light', resolvedTheme === 'light')
    root.style.colorScheme = resolvedTheme
  }, [mounted, resolvedTheme])

  const setTheme = (value: Theme) => {
    setThemeState(value)
    try {
      localStorage.setItem(storageKey, value)
    } catch {
      /* Theme still works when storage is unavailable. */
    }
  }
  const resetTheme = () => {
    setThemeState(defaultTheme)
    try {
      localStorage.removeItem(storageKey)
    } catch {
      /* Theme still works for this session. */
    }
  }
  return (
    <ThemeProviderContext.Provider
      value={{ theme, resolvedTheme, defaultTheme, setTheme, resetTheme }}
    >
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}

export const themeScript = `(function(){var t;try{t=localStorage.getItem("vite-ui-theme")}catch(e){}var s=window.matchMedia("(prefers-color-scheme: dark)").matches;var r=t==="dark"||t==="light"?t:s?"dark":"light";var c=document.documentElement.classList;c.remove("light","dark");c.add(r);document.documentElement.style.colorScheme=r})();`
