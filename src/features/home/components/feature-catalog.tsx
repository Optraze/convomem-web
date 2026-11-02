// biome-ignore-all lint/a11y/noNoninteractiveTabindex: Active ARIA tabpanels are keyboard destinations in the tabs pattern.
import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { ArrowUpRight, BookOpen, Check, Minus, Plus } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import { featureGroups } from '../feature-catalog'
import { useCompactViewport } from '../hooks/use-compact-viewport'

export function FeatureCatalog() {
  const [active, setActive] = useState(0)
  const [mobileActive, setMobileActive] = useState<number | null>(null)
  const compact = useCompactViewport(1000)
  const section = useRef<HTMLElement>(null)
  const categoryButtons = useRef<(HTMLButtonElement | null)[]>([])
  const select = (index: number) => {
    setActive(index)
    document.getElementById(`catalog-tab-${index}`)?.focus()
  }
  const toggleCategory = (index: number) => {
    const current = categoryButtons.current[index]
    const previous =
      mobileActive === null ? null : categoryButtons.current[mobileActive]
    // If closing an earlier category removes content above this row, keep the
    // tapped row anchored rather than moving the user to unrelated content.
    const oldTop = current?.getBoundingClientRect().top
    const collapsingAbove =
      previous && current && previous.offsetTop < current.offsetTop
    const update = () =>
      setMobileActive((previousIndex) =>
        previousIndex === index ? null : index
      )
    if (collapsingAbove && oldTop !== undefined) {
      section.current?.setAttribute('data-instant', 'true')
      flushSync(update)
      const nextTop = current?.getBoundingClientRect().top
      if (nextTop !== undefined)
        window.scrollBy({ top: nextTop - oldTop, behavior: 'instant' })
      requestAnimationFrame(() =>
        section.current?.removeAttribute('data-instant')
      )
    } else update()
  }
  return (
    <section className="p-catalog p-wrap" id="feature-catalog" ref={section}>
      <div className="p-section-head">
        <div>
          <span className="p-kicker">THINK BIGGER THAN A MEMORY STORE</span>
          <h2>
            <span className="p-catalog-heading-wide">
              An entire toolkit.
              <br />
              One customer <em>story.</em>
            </span>
            <span className="p-catalog-heading-compact">
              The full <em>platform.</em>
            </span>
          </h2>
        </div>
        <p>
          <span className="p-catalog-heading-wide">
            Forty capabilities. Five connected disciplines. Everything you need
            to turn conversations into customer intelligence.
          </span>
          <span className="p-catalog-heading-compact">
            Five connected areas. Choose what you want to explore.
          </span>
        </p>
      </div>
      <div className="p-catalog-layout">
        <div
          className="p-catalog-tabs"
          role="tablist"
          aria-label="ConvoMem capability categories"
          aria-orientation="vertical"
        >
          {featureGroups.map((group, index) => (
            <button
              type="button"
              role="tab"
              id={`catalog-tab-${index}`}
              aria-controls={`catalog-panel-${index}`}
              aria-selected={active === index}
              tabIndex={active === index ? 0 : -1}
              key={group.id}
              onClick={() => setActive(index)}
              onKeyDown={(event) => {
                if (
                  ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)
                ) {
                  event.preventDefault()
                  select(
                    event.key === 'Home'
                      ? 0
                      : event.key === 'End'
                        ? featureGroups.length - 1
                        : (index +
                            (event.key === 'ArrowDown'
                              ? 1
                              : featureGroups.length - 1)) %
                          featureGroups.length
                  )
                }
              }}
            >
              <span className="p-tab-index">0{index + 1}</span>
              <span>{group.title}</span>
            </button>
          ))}
          <Link to="/docs" className="p-catalog-docs">
            Get into the details <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="p-catalog-content">
          {featureGroups.map((group, index) => {
            const mobileOpen = mobileActive === index
            const visible = compact ? mobileOpen : active === index
            return (
              <div
                className="p-catalog-group"
                data-mobile-open={mobileOpen}
                key={group.id}
              >
                <button
                  className="p-catalog-category"
                  type="button"
                  ref={(node) => {
                    categoryButtons.current[index] = node
                  }}
                  id={`catalog-category-${index}`}
                  aria-expanded={mobileOpen}
                  aria-controls={`catalog-panel-${index}`}
                  onClick={() => toggleCategory(index)}
                >
                  <span className="p-category-number">0{index + 1}</span>
                  <span className="p-category-name">
                    <strong>{group.title}</strong>
                    <small>{group.features.length} capabilities</small>
                  </span>
                  {mobileOpen ? <Minus size={20} /> : <Plus size={20} />}
                </button>
                <section
                  className="p-catalog-panel"
                  id={`catalog-panel-${index}`}
                  role={compact ? 'region' : 'tabpanel'}
                  aria-labelledby={
                    compact
                      ? `catalog-category-${index}`
                      : `catalog-tab-${index}`
                  }
                  tabIndex={compact ? undefined : 0}
                  hidden={!compact && !visible}
                  aria-hidden={!visible}
                  inert={!visible}
                >
                  <div className="p-catalog-panel-clip">
                    <div className="p-catalog-panel-body">
                      <div className="p-catalog-panel-title">
                        <span>
                          0{index + 1} / {group.title}
                        </span>
                        <span>{group.features.length} CAPABILITIES</span>
                      </div>
                      <p className="p-catalog-summary">{group.summary}</p>
                      <div className="p-catalog-features">
                        {group.features.map((feature, featureIndex) => (
                          <article
                            key={feature.title}
                            style={{ animationDelay: `${featureIndex * 24}ms` }}
                          >
                            <Check size={15} />
                            <div>
                              <h3>{feature.title}</h3>
                              <p>{feature.description}</p>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )
          })}
        </div>
      </div>
      <Link to="/docs" className="p-catalog-mobile-docs">
        <BookOpen size={16} />
        <span>Explore the full documentation</span>
      </Link>
      <p className="p-catalog-note">
        Availability and usage limits vary by plan. Dashboard capabilities are
        distinct from the public SDK and integration API.
      </p>
    </section>
  )
}
