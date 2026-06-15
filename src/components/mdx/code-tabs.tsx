import { createContext, useContext, useEffect, useState } from 'react'

import type React from 'react'

import curlIcon from '@/assets/icons/curl.svg'
import pythonIcon from '@/assets/icons/python.svg'
import rustIcon from '@/assets/icons/rust.svg'
import typescriptIcon from '@/assets/icons/typescript.svg'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
      tab != null &&
      typeof tab === 'object' &&
      'props' in tab &&
      LANGUAGES.includes(tab.props.language)
  )

  if (validTabs.length === 0) return null

  const activeValue = validTabs.some((tab) => tab.props.language === active)
    ? active
    : validTabs[0].props.language

  return (
    <Tabs
      value={activeValue}
      onValueChange={(value) => ctx?.setActive(value as Language)}
      className="my-6 flex-col gap-0 overflow-hidden rounded-xl border border-border bg-card shadow-sm"
    >
      <TabsList className="h-auto w-full justify-start gap-1 rounded-none border-b border-border bg-muted/30 px-2 pt-2 pb-0 group-data-horizontal/tabs:h-auto">
        {validTabs.map((tab) => {
          const lang = tab.props.language
          return (
            <TabsTrigger
              key={lang}
              value={lang}
              className="flex-none gap-2 !rounded-t-lg !rounded-b-none px-3 py-2"
            >
              <img
                src={LANGUAGE_ICONS[lang]}
                alt=""
                className="h-4 w-4"
                aria-hidden="true"
              />
              {LANGUAGE_LABELS[lang]}
            </TabsTrigger>
          )
        })}
      </TabsList>

      {validTabs.map((tab) => (
        <TabsContent
          key={tab.props.language}
          value={tab.props.language}
          className="[&_[data-rehype-pretty-code-figure]]:!my-0 [&_pre]:!m-0 [&_pre]:!rounded-none [&_pre]:!border-0 [&_pre]:!bg-transparent"
        >
          {tab.props.children}
        </TabsContent>
      ))}
    </Tabs>
  )
}

export function CodeTab(_props: CodeTabProps) {
  return null
}
