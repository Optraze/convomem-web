import { useRef } from 'react'
import { ChevronDown } from 'lucide-react'

import type { Toc } from '@/lib/content'

import { OnThisPage } from './on-this-page'

export function MobileToc({ toc }: { toc?: Toc }) {
  const details = useRef<HTMLDetailsElement>(null)
  if (!toc?.length) return null
  return (
    <details ref={details} className="docs-mobile-toc">
      <summary>
        On this page
        <ChevronDown size={16} />
      </summary>
      <OnThisPage
        toc={toc}
        onNavigate={() => {
          if (details.current) details.current.open = false
        }}
      />
    </details>
  )
}
