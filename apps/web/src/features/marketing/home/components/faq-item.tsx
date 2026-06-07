import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion } from 'motion/react'

export function FaqItem({
  q,
  a,
  index,
}: {
  q: string
  a: string
  index: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-t border-border">
      <button
        onClick={() => setOpen(!open)}
        className="group flex w-full items-start gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="tnum mt-1 font-mono text-[11px] tracking-[0.1em] text-hint/60">
          {index}
        </span>
        <span
          className="flex-1 text-foreground group-hover:text-foreground"
          style={{ fontSize: '15px', fontWeight: 500 }}
        >
          {q}
        </span>
        <ChevronDown
          size={15}
          className={`mt-1 flex-shrink-0 text-hint/70 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden"
      >
        <p
          className="max-w-2xl pb-5 pl-9 text-muted-foreground"
          style={{ fontSize: '13.5px', lineHeight: 1.75 }}
        >
          {a}
        </p>
      </motion.div>
    </div>
  )
}
