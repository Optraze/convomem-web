import { motion, useReducedMotion } from 'motion/react'
import { ShieldCheck } from 'lucide-react'

const MONO = { fontFamily: "'JetBrains Mono', monospace" } as const

/* ─────────────────────────────────────────────────────────────────────────
   RecordPreview — a calm, STATIC snapshot of what one message becomes. Lives
   in the hero as a visual anchor (the interactive pipeline lives in its own
   section). One inbound message → a handful of extracted memory facts → the
   agent's memory-aware next turn. No interaction, no scroll. ────────────── */

const FACTS = [
  { fact: 'order #4471 · delayed', type: 'context' },
  { fact: 'prefers email over phone', type: 'preference' },
  { fact: 'renewal due · Q3 2026', type: 'intent' },
  { fact: 'sentiment · frustrated → resolved', type: 'signal' },
]

export function RecordPreview() {
  const reduce = useReducedMotion()
  return (
    <div className="rounded-xl border border-border-strong bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <span style={MONO} className="text-subtle text-[12px]">
            memory.record
          </span>
          <span style={MONO} className="text-hint text-[11px]">
            · cust_a7ce
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-foreground caret-blink" />
          <span
            style={MONO}
            className="text-hint text-[10px] tracking-[0.16em] uppercase"
          >
            live
          </span>
        </div>
      </div>

      {/* incoming message */}
      <div className="px-4 py-3.5 border-b border-border">
        <p
          style={MONO}
          className="text-hint text-[10px] tracking-[0.18em] uppercase mb-2"
        >
          incoming · chat
        </p>
        <p
          className="text-foreground"
          style={{ fontSize: '12.5px', lineHeight: 1.65 }}
        >
          “Hey — my order&nbsp;<span className="text-subtle">#4471</span> still
          hasn&apos;t shipped and it&apos;s been a week. Pretty frustrated
          honestly.”
        </p>
      </div>

      {/* extracted facts */}
      <div className="px-4 py-3.5">
        <div className="flex items-center justify-between mb-2.5">
          <p
            style={MONO}
            className="text-hint text-[10px] tracking-[0.18em] uppercase"
          >
            extracted
          </p>
          <span
            style={MONO}
            className="inline-flex items-center gap-1 text-hint text-[9px] tracking-[0.1em] uppercase"
          >
            <ShieldCheck size={9} /> PII masked
          </span>
        </div>
        <ul className="space-y-2">
          {FACTS.map((l, i) => (
            <motion.li
              key={l.fact}
              initial={reduce ? false : { opacity: 0, x: 8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: 0.12 + i * 0.1 }}
              className="flex items-baseline justify-between gap-3"
            >
              <span className="text-foreground" style={{ fontSize: '12px' }}>
                {l.fact}
              </span>
              <span
                style={MONO}
                className="text-hint text-[10px] whitespace-nowrap"
              >
                {l.type}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* next turn */}
      <div className="px-4 py-3 border-t border-border bg-muted/40">
        <p
          className="text-subtle"
          style={{ fontSize: '12px', lineHeight: 1.55 }}
        >
          <span style={MONO} className="text-hint text-[10px]">
            next turn →
          </span>{' '}
          “Welcome back. I see <span className="text-foreground">#4471</span> is
          still delayed — let me make this right.”
        </p>
      </div>
    </div>
  )
}
