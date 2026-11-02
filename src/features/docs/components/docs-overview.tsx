import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Braces,
  Terminal,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'

import type { ResolvedNavGroup } from '../nav'

import pythonIcon from '@/assets/icons/python.svg'
import rustIcon from '@/assets/icons/rust.svg'
import typescriptIcon from '@/assets/icons/typescript.svg'
import { getContentMeta } from '@/lib/content'

const sdks = [
  { label: 'TypeScript', slug: 'sdk-typescript', icon: typescriptIcon },
  { label: 'Python', slug: 'sdk-python', icon: pythonIcon },
  { label: 'Rust', slug: 'sdk-rust', icon: rustIcon },
]
export function DocsOverview({ nav }: { nav: ResolvedNavGroup[] }) {
  return (
    <div className="docs-overview">
      <div className="docs-overview-title">
        <span>DEVELOPER DOCUMENTATION</span>
        <h1>ConvoMem documentation.</h1>
        <p>
          Connect conversations, capture customer memory, and bring useful
          context to your agents. Start with a guide or go straight to the
          reference.
        </p>
      </div>
      <section className="docs-quickstart">
        <div>
          <span>
            <Terminal size={16} />
            START HERE
          </span>
          <h2>Capture your first conversation.</h2>
          <p>Follow the guide from setup to capture and customer lookup.</p>
          <Link to="/docs/$slug" params={{ slug: 'getting-started' }}>
            Open the quick start
            <ArrowRight size={17} />
          </Link>
        </div>
        <ol>
          <li>
            <span>01</span>Create your API key.
          </li>
          <li>
            <span>02</span>Connect your application.
          </li>
          <li>
            <span>03</span>Capture, then retrieve context.
          </li>
        </ol>
      </section>
      <nav className="docs-sdk-row" aria-label="Choose an integration">
        {sdks.map((sdk) => (
          <Link key={sdk.slug} to="/docs/$slug" params={{ slug: sdk.slug }}>
            <img src={sdk.icon} alt="" />
            <span>{sdk.label}</span>
            <ArrowUpRight size={14} />
          </Link>
        ))}
        <Link to="/docs/$slug" params={{ slug: 'mcp' }}>
          <Braces size={18} />
          <span>MCP server</span>
          <ArrowUpRight size={14} />
        </Link>
      </nav>
      <div className="docs-overview-groups">
        {nav.map((group) => (
          <section key={group.group}>
            <div className="docs-group-title">
              <h2>{group.group}</h2>
              <span>{group.items.length} guides</span>
            </div>
            <div className="docs-link-grid">
              {group.items.map((item) => {
                const meta = getContentMeta('docs', item.slug)
                return (
                  <Link
                    key={item.slug}
                    to="/docs/$slug"
                    params={{ slug: item.slug }}
                  >
                    <span>
                      <BookOpen size={15} />
                      {item.title}
                      <ArrowUpRight size={15} />
                    </span>
                    {meta?.frontmatter.description && (
                      <p>{meta.frontmatter.description}</p>
                    )}
                  </Link>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
