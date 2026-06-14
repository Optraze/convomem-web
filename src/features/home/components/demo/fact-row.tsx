import { motion } from 'motion/react'

import type { DemoFact } from './use-demo-pipeline'

import { SENT } from './sentiment'

export function FactRow({ fact, index }: { fact: DemoFact; index: number }) {
  const s = SENT[fact.sentiment] ?? SENT.NEUTRAL
  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-3 py-2 border-b border-border last:border-0"
    >
      <span className="font-mono text-hint tnum text-[10px] mt-0.5 w-4 shrink-0">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="flex-1 min-w-0">
        <span
          className="text-foreground"
          style={{ fontSize: '12.5px', fontWeight: 500 }}
        >
          {fact.content}
        </span>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="font-mono text-hint text-[10px]">
            {fact.memoryType}
          </span>
          <span className="text-ghost">·</span>
          <span
            className="font-mono text-hint text-[10px]"
            title={`sentiment ${s.label}`}
          >
            <span className="text-subtle">{s.mark}</span> {s.label}
          </span>
          <span className="text-ghost">·</span>
          <span className="font-mono text-hint tnum text-[10px]">
            {Math.round(fact.confidence * 100)}%
          </span>
          {fact.expiresAt && (
            <>
              <span className="text-ghost">·</span>
              <span className="font-mono text-hint text-[10px]">ttl</span>
            </>
          )}
        </div>
      </div>
    </motion.li>
  )
}
