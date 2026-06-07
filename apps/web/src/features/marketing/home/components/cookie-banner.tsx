import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!localStorage.getItem('cm-cookie-consent')) setVisible(true)
  }, [])
  if (!visible) return null
  const set = (v: string) => {
    localStorage.setItem('cm-cookie-consent', v)
    setVisible(false)
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-border bg-background/95 px-5 py-4 backdrop-blur-xl"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-start justify-between gap-4 px-5 sm:flex-row sm:items-center">
        <p
          className="text-subtle/80"
          style={{ fontSize: '12.5px', lineHeight: 1.6 }}
        >
          We keep only essential cookies to run the site, plus optional
          analytics to improve it. Your call.
        </p>
        <div className="flex flex-shrink-0 items-center gap-2">
          <button
            onClick={() => set('essential')}
            className="rounded-md border border-border px-3 py-1.5 text-subtle/85 transition-colors hover:bg-muted hover:text-foreground"
            style={{ fontSize: '12px' }}
          >
            Essential only
          </button>
          <button
            onClick={() => set('all')}
            className="rounded-md bg-foreground px-3 py-1.5 text-background transition-opacity hover:opacity-90"
            style={{ fontSize: '12px', fontWeight: 500 }}
          >
            Accept all
          </button>
        </div>
      </div>
    </motion.div>
  )
}
