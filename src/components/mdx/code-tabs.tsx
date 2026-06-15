import { createContext, useContext, useEffect, useState } from 'react'

import type React from 'react'

import curlIcon from '@/assets/icons/curl.svg'
import pythonIcon from '@/assets/icons/python.svg'
import rustIcon from '@/assets/icons/rust.svg'
import typescriptIcon from '@/assets/icons/typescript.svg'
import { cn } from '@/lib/utils'

const LANGUAGES = ['curl', 'typescript', 'python', 'rust'] as const
type Language = (typeof LANGUAGES)[number]

const LANGUAGE_LABELS: Record<Language, string> = {
  curl: 'cURL',
  typescript: 'TypeScript',
  python: 'Python',
  rust: 'Rust',
}

const STORAGE_KEY = 'convomem-docs-lang'

const LANGUAGE_ICONS: Record<Language, string> = {
  curl: curlIcon,
  typescript: typescriptIcon,
  python: pythonIcon,
  rust: rustIcon,
}

// ── Context for global language sync ───────────────────

interface LanguageContextValue {
  active: Language
  setActive: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const useLanguage = () => useContext(LanguageContext)

// ── Provider ───────────────────────────────────────────

/**
 * Wraps the docs layout to provide global language switching.
 * All CodeTabs instances inside share the same active language.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<Language>('typescript')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && (LANGUAGES as readonly string[]).includes(stored)) {
      setActive(stored as Language)
    }
  }, [])

  const handleChange = (lang: Language) => {
    setActive(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang)
    }
  }

  return (
    <LanguageContext.Provider value={{ active, setActive: handleChange }}>
      {children}
    </LanguageContext.Provider>
  )
}

// ── CodeTabs ───────────────────────────────────────────

interface CodeTabProps {
  language: Language
  filename?: string
  children: React.ReactNode
}

export function CodeTabs({ children }: { children: React.ReactNode }) {
  const ctx = useLanguage()
  const active = ctx?.active ?? 'typescript'

  const tabs = Array.isArray(children) ? children : [children]
  const validTabs = tabs.filter(
    (tab): tab is React.ReactElement<CodeTabProps> =>
      tab != null && typeof tab === 'object' && 'props' in tab && LANGUAGES.includes(tab.props.language),
  )

  if (validTabs.length === 0) return null

  const activeTab = validTabs.find((tab) => tab.props.language === active) ?? validTabs[0]

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Language tabs */}
      <div className="flex items-center gap-1 border-b border-border bg-muted/30 px-2 pt-2">
        {validTabs.map((tab) => {
          const lang = tab.props.language
          const isActive = lang === active
          return (
            <button
              key={lang}
              type="button"
              onClick={() => ctx?.setActive(lang)}
              className={cn(
                'flex items-center gap-2 rounded-t-lg px-3 py-2 text-sm font-medium transition-all',
                isActive
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
              )}
            >
              <img
                src={LANGUAGE_ICONS[lang]}
                alt=""
                className="h-4 w-4"
                aria-hidden="true"
              />
              {LANGUAGE_LABELS[lang]}
            </button>
          )
        })}
      </div>

      {/* Code content */}
      <div className="relative">
        {activeTab.props.filename && (
          <div className="absolute top-0 left-0 z-10 border-b border-r border-border bg-muted/60 px-3 py-1 font-mono text-xs text-muted-foreground backdrop-blur-sm">
            {activeTab.props.filename}
          </div>
        )}
        <div className="[&>pre]:!m-0 [&>pre]:!rounded-none [&>pre]:!border-0 [&>pre]:!bg-transparent">
          {activeTab.props.children}
        </div>
      </div>
    </div>
  )
}

export function CodeTab(_props: CodeTabProps) {
  return null
}
