import { useEffect, useRef, useState } from 'react'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const banner = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!localStorage.getItem('cm-cookie-consent')) setVisible(true)
  }, [])
  useEffect(() => {
    if (!visible) return
    const element = banner.current
    if (!element) return
    const previousPadding = document.body.style.paddingBottom
    const resize = () => {
      document.body.style.paddingBottom = `${element.getBoundingClientRect().height}px`
    }
    const observer = new ResizeObserver(resize)
    observer.observe(element)
    resize()
    return () => {
      observer.disconnect()
      document.body.style.paddingBottom = previousPadding
    }
  }, [visible])
  if (!visible) return null
  const set = (v: string) => {
    localStorage.setItem('cm-cookie-consent', v)
    window.dispatchEvent(new Event('cm-consent-change'))
    setVisible(false)
  }
  return (
    <section
      ref={banner}
      aria-label="Cookie preferences"
      className="cm-cookie fixed inset-x-0 bottom-0 z-[100] border-t px-5 py-4"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-start justify-between gap-4 px-5 sm:flex-row sm:items-center">
        <p className="text-[12.5px] leading-[1.6]">
          <span className="cm-cookie-desktop">
            We keep only essential cookies to run the site, plus optional
            analytics to improve it. Your call.
          </span>
          <span className="cm-cookie-compact">
            Essential cookies keep ConvoMem running. Optional analytics are your
            choice.
          </span>
        </p>
        <div className="flex flex-shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => set('essential')}
            className="cm-cookie-essential rounded-md border px-3 py-1.5 text-xs"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => set('all')}
            className="cm-cookie-accept rounded-md px-3 py-1.5 font-medium text-xs"
          >
            Accept all
          </button>
        </div>
      </div>
    </section>
  )
}
