import { Activity } from 'lucide-react'
import { motion } from 'motion/react'

import type { InsightsResult } from './use-demo-pipeline'

import { SENT } from './sentiment'

export function InsightsPanel({
  ins,
  title = 'conversation ended → insights',
  nested = false,
}: {
  ins: InsightsResult
  title?: string
  nested?: boolean
}) {
  const tone = ins.overallSentiment
  const Wrapper = nested ? 'div' : motion.div
  const wrapperProps = nested
    ? {}
    : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }
  return (
    <Wrapper
      {...wrapperProps}
      className={
        nested
          ? 'border-t border-border'
          : 'rounded-lg border border-border-strong bg-surface overflow-hidden'
      }
    >
      <div
        className={`flex items-center gap-2 px-3.5 py-2 border-b border-border ${nested ? 'bg-surface/60' : 'bg-muted/40'}`}
      >
        <Activity size={12} className="text-foreground" />
        <span className="font-mono text-subtle text-[11px]">{title}</span>
      </div>
      <div className="px-3.5 py-3 space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-hint text-[10px] tracking-[0.14em] uppercase">
            sentiment
          </span>
          <span
            className="text-foreground"
            style={{ fontSize: '12.5px', fontWeight: 600 }}
          >
            {SENT[tone].mark} {tone.toLowerCase()}
          </span>
          <span className="font-mono text-hint tnum text-[11px]">
            {ins.sentimentScore > 0 ? '+' : ''}
            {ins.sentimentScore.toFixed(2)}
          </span>
        </div>
        {ins.insights.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {ins.insights.map((it) => (
              <span
                key={`insight-${it.summary}`}
                className="font-mono inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-border text-[10px] text-subtle"
              >
                <span className="w-1 h-1 rounded-full bg-foreground" />
                {it.type.replace(/_/g, ' ')}
                {it.summary ? ` · ${it.summary}` : ''}
              </span>
            ))}
          </div>
        )}
        {ins.summary && (
          <p
            className="text-muted-foreground"
            style={{ fontSize: '12px', lineHeight: 1.6 }}
          >
            {ins.summary}
          </p>
        )}
      </div>
    </Wrapper>
  )
}
