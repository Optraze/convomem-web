'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)

  // Hydrate from localStorage on mount (avoids SSR/client drift).
  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Theme | null
    if (stored) {
      setThemeState(stored)
    }
  }, [storageKey])

  // Apply the resolved theme to <html> and follow system changes when in
  // "system" mode.
  useEffect(() => {
    const root = window.document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = (currentTheme: Theme) => {
      root.classList.remove('light', 'dark')
      const resolved =
        currentTheme === 'system'
          ? mediaQuery.matches
            ? 'dark'
            : 'light'
          : currentTheme
      root.classList.add(resolved)
      root.style.colorScheme = resolved
    }

    applyTheme(theme)

    if (theme === 'system') {
      const onSystemChange = () => applyTheme('system')
      mediaQuery.addEventListener('change', onSystemChange)
      return () => mediaQuery.removeEventListener('change', onSystemChange)
    }
  }, [theme])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      setThemeState(newTheme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
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

/**
 * Inline IIFE that resolves the initial theme from localStorage (or system
 * preference) and writes the `.dark` / `.light` class to <html> *before*
 * React hydrates, preventing flash of unstyled content. Place in the <head>
 * via the root route's `head().scripts` so it runs synchronously before
 * any rendered markup.
 *
 * The storage key is hardcoded to `vite-ui-theme` to match the provider's
 * default. If you customise `storageKey` on <ThemeProvider>, regenerate this
 * script with the same key.
 */
export const themeScript = `(function(){try{var k="vite-ui-theme";var t=localStorage.getItem(k);var s=window.matchMedia("(prefers-color-scheme: dark)").matches;var r=t==="dark"||t==="light"?t:s?"dark":"light";var c=document.documentElement.classList;c.remove("light","dark");c.add(r);document.documentElement.style.colorScheme=r}catch(e){}})();`
