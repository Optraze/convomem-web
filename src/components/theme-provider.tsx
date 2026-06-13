'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import type React from 'react'

export type Theme = 'dark' | 'light' | 'system'
type ResolvedTheme = Exclude<Theme, 'system'>

const DEFAULT_THEME = 'system'
const THEME_STORAGE_KEY = 'vite-ui-theme'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

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
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Theme | null
    if (stored) {
      setThemeState(stored)
    }
  }, [storageKey])

  const resolvedTheme: ResolvedTheme = useMemo(() => {
    if (theme === 'system') {
      if (typeof window === 'undefined') return 'light'
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }
    return theme as ResolvedTheme
  }, [theme])

  useEffect(() => {
    const root = window.document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = (currentResolvedTheme: ResolvedTheme) => {
      root.classList.remove('light', 'dark')
      root.classList.add(currentResolvedTheme)
      root.style.colorScheme = currentResolvedTheme
    }

    applyTheme(resolvedTheme)

    if (theme === 'system') {
      const onSystemChange = () => {
        const resolved = mediaQuery.matches ? 'dark' : 'light'
        applyTheme(resolved)
      }
      mediaQuery.addEventListener('change', onSystemChange)
      return () => mediaQuery.removeEventListener('change', onSystemChange)
    }
  }, [theme, resolvedTheme])

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme)
    setThemeState(newTheme)
  }

  const resetTheme = () => {
    localStorage.removeItem(storageKey)
    setThemeState(DEFAULT_THEME)
  }

  return (
    <ThemeProviderContext.Provider
      {...props}
      value={{ theme, resolvedTheme, defaultTheme, setTheme, resetTheme }}
    >
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const themeScript = `(function(){try{var k="vite-ui-theme";var t=localStorage.getItem(k);var s=window.matchMedia("(prefers-color-scheme: dark)").matches;var r=t==="dark"||t==="light"?t:s?"dark":"light";var c=document.documentElement.classList;c.remove("light","dark");c.add(r);document.documentElement.style.colorScheme=r}catch(e){}})();`
