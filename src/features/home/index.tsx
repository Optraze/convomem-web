import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Code2,
  Copy,
  FileText,
  LockKeyhole,
  Mail,
  MessageSquare,
  Phone,
  Play,
  ShieldCheck,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'

import pythonIcon from '@/assets/icons/python.svg'
import rustIcon from '@/assets/icons/rust.svg'
import typescriptIcon from '@/assets/icons/typescript.svg'
import { MarketingFooter } from '@/components/marketing-footer'
import { MarketingNavbar } from '@/components/marketing-navbar'

import { AnalyticsPreview } from './components/analytics-preview'
import { ConversationPoster } from './components/conversation-poster'
import { CookieBanner } from './components/cookie-banner'
import { CustomerStory } from './components/customer-story'
import { FeatureCatalog } from './components/feature-catalog'
import { enterprisePlans, faqs } from './data'

const DemoModal = lazy(() =>
  import('./components/demo/demo-modal').then((module) => ({
    default: module.DemoModal,
  }))
)
const snippet = `import { ConvoMem } from '@optraze/convomem-sdk'

const client = new ConvoMem({
  apiKey: process.env.CONVOMEM_API_KEY!,
})

// Recall relevant, previously captured memory.
const { context } = await client.lookup(
  'water leak and troubleshooting already tried',
  { email: 'alex@example.com' },
)

// Add the returned context to your agent's next turn.`

function CodeExample() {
  const [status, setStatus] = useState('Copy')
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current)
    },
    []
  )
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet)
      setStatus('Copied')
    } catch {
      setStatus('Copy unavailable')
    }
    if (timeout.current) clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setStatus('Copy'), 2000)
  }
  return (
    <div className="p-code">
      <div>
        <span>
          <Code2 size={15} /> agent.ts
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy TypeScript integration example"
        >
          {status === 'Copied' ? <Check size={13} /> : <Copy size={13} />}
          <span role="status">{status}</span>
        </button>
      </div>
      <pre>
        <code>
          {snippet.split('\n').map((line, index) => (
            <span
              className={line.trim().startsWith('//') ? 'p-code-comment' : ''}
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed read-only code lines never reorder
              key={`${index}-${line}`}
            >
              <i aria-hidden="true">{index + 1}</i>
              {line || ' '}
            </span>
          ))}
        </code>
      </pre>
      <footer>
        <span>TypeScript · Runs on your server</span>
        <Link to="/docs/$slug" params={{ slug: 'sdk-typescript' }}>
          Full SDK reference <ArrowUpRight size={12} />
        </Link>
      </footer>
    </div>
  )
}

export function Home() {
  const [demoOpen, setDemoOpen] = useState(false)
  const [mobilePlan, setMobilePlan] = useState('Starter')
  return (
    <div className="premium-site cm-light-surface">
      <MarketingNavbar appearance="light" />
      <main id="main-content">
        <section className="p-hero p-wrap" id="top">
          <div className="p-hero-copy">
            <span className="p-hero-label">
              <span />
              ONE CUSTOMER. EVERY CONVERSATION.
            </span>
            <h1>
              Customer
              <br />
              intelligence.
              <br />
              <em>With a memory.</em>
            </h1>
            <p>
              Unify calls, chats, texts, and emails into one customer history.
              Give your agents context—and your team the insight to act.
            </p>
            <div className="p-hero-actions">
              <a
                className="p-button p-button-blue"
                href="https://app.convomem.com/register"
              >
                Start your free trial
                <ArrowUpRight size={19} />
              </a>
              <button
                type="button"
                className="p-button p-button-outline"
                onClick={() => setDemoOpen(true)}
              >
                <Play size={12} />
                Try a conversation
              </button>
            </div>
            <span className="p-trial-note">
              7 days to explore. No credit card required.
            </span>
          </div>
          <ConversationPoster />
        </section>
        <div className="p-channel-band">
          <div className="p-wrap">
            <span>
              Every channel. <br />
              <strong>One connected story.</strong>
            </span>
            <div>
              <span>
                <Phone />
                Voice
              </span>
              <span>
                <MessageSquare />
                Chat
              </span>
              <span>
                <MessageSquare />
                SMS
              </span>
              <span>
                <Mail />
                Email
              </span>
            </div>
          </div>
        </div>
        <CustomerStory />
        <section className="p-handoff p-wrap" id="features">
          <div className="p-handoff-title">
            <span className="p-kicker">
              PASS THE CONTEXT. KEEP THE CONNECTION.
            </span>
            <h2>
              A new agent.
              <br />
              The same <em>understanding.</em>
            </h2>
          </div>
          <div className="p-handoff-body">
            <p>
              Pick up where the last conversation left off. Give your agents a
              shared memory, a useful handoff, and the context to make the next
              interaction feel personal.
            </p>
            <div>
              <span>
                <Check size={16} />
                Source-linked customer memories
              </span>
              <span>
                <Check size={16} />
                AI-written handoff briefs
              </span>
              <span>
                <Check size={16} />
                Scoped, embeddable agent context
              </span>
            </div>
            <Link
              className="p-text-link"
              to="/docs/$slug"
              params={{ slug: 'handoff' }}
            >
              See how handoffs work
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
        <AnalyticsPreview />
        <FeatureCatalog />
        <section className="p-developers" id="developers">
          <div className="p-wrap p-developer-grid">
            <div>
              <span className="p-kicker">
                BIG POSSIBILITIES. SMALL INTEGRATION.
              </span>
              <h2>
                Add memory.
                <br />
                Keep your
                <br />
                <em>stack.</em>
              </h2>
              <p>
                Your agents, with more context. Bring ConvoMem to the tools you
                already use through the API, hosted MCP, or official SDKs.
              </p>
              <Link className="p-button p-button-white" to="/docs">
                Build with ConvoMem
                <ArrowUpRight size={18} />
              </Link>
              <div className="p-sdk-links">
                <Link to="/docs/$slug" params={{ slug: 'sdk-typescript' }}>
                  <img
                    src={typescriptIcon}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                  TypeScript
                </Link>
                <Link to="/docs/$slug" params={{ slug: 'sdk-python' }}>
                  <img
                    src={pythonIcon}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                  Python
                </Link>
                <Link to="/docs/$slug" params={{ slug: 'sdk-rust' }}>
                  <img src={rustIcon} alt="" loading="lazy" decoding="async" />
                  Rust
                </Link>
                <Link to="/docs/$slug" params={{ slug: 'mcp' }}>
                  MCP ↗
                </Link>
              </div>
            </div>
            <CodeExample />
          </div>
        </section>
        <section className="p-trust p-wrap">
          <div className="p-section-head">
            <div>
              <span className="p-kicker">
                CONTEXT IS PERSONAL. TREAT IT THAT WAY.
              </span>
              <h2>
                Memory worth keeping.
                <br />
                Controls worth <em>trusting.</em>
              </h2>
            </div>
            <Link className="p-text-link" to="/privacy">
              Privacy & data control
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="p-trust-grid">
            {[
              {
                icon: FileText,
                title: 'Keep the source in sight.',
                text: 'Trace memories back to their conversations. Follow versions, changes, and the context behind every fact.',
              },
              {
                icon: ShieldCheck,
                title: 'Put sensitive data in its place.',
                text: 'Apply PII policies, role-based access, retention, and customer-data controls around your memory.',
              },
              {
                icon: LockKeyhole,
                title: 'Draw the right boundaries.',
                text: 'Organization isolation, agent scoping, and controlled recall keep customer context in the right hands.',
              },
            ].map((item) => (
              <article key={item.title}>
                <item.icon size={27} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="p-try p-wrap" id="try">
          <div>
            <span className="p-kicker">YOUR WORDS. THE REAL PIPELINE.</span>
            <h2>
              See what one
              <br />
              <em>conversation can reveal.</em>
            </h2>
            <p>
              Bring a message. See the facts, signals, and context it can
              become.
            </p>
          </div>
          <button
            type="button"
            className="p-button p-button-white"
            onClick={() => setDemoOpen(true)}
          >
            Try the live demo
            <ArrowUpRight size={21} />
          </button>
        </section>
        <section className="p-pricing p-wrap" id="pricing">
          <div className="p-section-head">
            <div>
              <span className="p-kicker">START A NEW CHAPTER</span>
              <h2>
                Room for your next
                <br />
                <em>big thing.</em>
              </h2>
            </div>
            <p>
              Start with a 7-day trial on Starter, Growth, or Pro. Find the plan
              that fits your customer relationships.
            </p>
          </div>
          <fieldset
            className="p-plan-picker"
            aria-label="Explore pricing plans"
          >
            {enterprisePlans
              .filter((plan) => plan.price !== null)
              .map((plan) => (
                <button
                  type="button"
                  key={plan.name}
                  aria-pressed={mobilePlan === plan.name}
                  onClick={() => setMobilePlan(plan.name)}
                >
                  {plan.name}
                </button>
              ))}
            <button
              className="p-plan-compare"
              type="button"
              aria-pressed={mobilePlan === 'all'}
              onClick={() => setMobilePlan('all')}
            >
              Compare all plans <ArrowRight size={15} />
            </button>
          </fieldset>
          <div className="p-plans">
            {enterprisePlans
              .filter((plan) => plan.price !== null)
              .map((plan) => (
                <article
                  className={`p-plan ${plan.highlighted ? 'p-plan-featured' : ''}`}
                  key={plan.name}
                  data-current={
                    mobilePlan === 'all' || mobilePlan === plan.name
                  }
                >
                  <div className="p-plan-top">
                    <h3>{plan.name}</h3>
                    {plan.highlighted && <span>FOR GROWING TEAMS</span>}
                  </div>
                  <p>{plan.description}</p>
                  <div className="p-plan-price">
                    <small>
                      {'pricePrefix' in plan ? plan.pricePrefix : 'Monthly'}
                    </small>
                    <strong>
                      ${plan.price?.toLocaleString('en-US')}
                      <span>/mo</span>
                    </strong>
                  </div>
                  {plan.name === 'Scale' ? (
                    <Link to="/contact" className="p-plan-action">
                      Talk to sales
                      <ArrowUpRight size={17} />
                    </Link>
                  ) : (
                    <a
                      href="https://app.convomem.com/register"
                      className="p-plan-action"
                    >
                      Try {plan.name}
                      <ArrowUpRight size={17} />
                    </a>
                  )}
                  <ul>
                    {plan.features.map((feature) => (
                      <li key={feature}>
                        <Check size={14} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
          </div>
          <div className="p-custom">
            <p>
              <strong>Something bigger in mind?</strong> Custom capacity,
              on-premises deployment on request, and a dedicated SLA.
            </p>
            <Link className="p-text-link" to="/contact">
              Let’s talk
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>
        <section className="p-faq p-wrap" id="faq">
          <div>
            <span className="p-kicker">THE THINGS YOU MIGHT BE WONDERING</span>
            <h2>
              A little more
              <br />
              <em>context.</em>
            </h2>
            <Link className="p-text-link" to="/contact">
              Ask us anything
              <ArrowUpRight size={17} />
            </Link>
          </div>
          <div>
            {faqs.map((faq) => (
              <details key={faq.q}>
                <summary>
                  {faq.q}
                  <ChevronDown size={19} />
                </summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="p-closing">
          <div className="p-wrap">
            <span className="p-kicker">
              EVERY CONVERSATION IS A CHANCE TO CONNECT.
            </span>
            <h2>
              Customer context.
              <br />
              <em>Ready for your agents.</em>
            </h2>
            <a
              className="p-button p-button-blue"
              href="https://app.convomem.com/register"
            >
              Start your free trial
              <ArrowUpRight size={21} />
            </a>
            <span className="p-trial-note">
              7 days free. No credit card required.
            </span>
            <div className="p-closing-wordmark" aria-hidden="true">
              ConvoMem
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter appearance="light" />
      {demoOpen && (
        <Suspense
          fallback={
            <div className="p-demo-loading" role="status">
              Loading live demo…
            </div>
          }
        >
          <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
        </Suspense>
      )}
      <CookieBanner />
    </div>
  )
}
