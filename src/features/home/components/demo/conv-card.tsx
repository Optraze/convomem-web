import { ShieldCheck } from 'lucide-react'

import type { ConvState } from './use-demo-pipeline'

import { FactRow } from './fact-row'
import { InsightsPanel } from './insights-panel'
import { PipelineTrace } from './pipeline-trace'

export function ConvCard({ c, n }: { c: ConvState; n: number }) {
  return (
    <div className="rounded-lg border border-border bg-background overflow-hidden">
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-border bg-muted/40">
        <span className="font-mono text-subtle text-[11px]">
          conversation {String(n + 1).padStart(2, '0')}{' '}
          <span className="text-hint">· {c.channel.toLowerCase()}</span>
        </span>
        <span className="font-mono text-hint tnum text-[10px]">
          {c.facts.length} {c.facts.length === 1 ? 'fact' : 'facts'}
        </span>
      </div>

      {/* the REAL pipeline, as a detailed live trace */}
      <PipelineTrace stages={c.stages} done={c.done} />

      {/* facts stream in here */}
      {c.facts.length > 0 && (
        <ul className="px-3.5 py-1.5">
          {c.facts.map((f, i) => (
            <FactRow key={f.content} fact={f} index={i} />
          ))}
        </ul>
      )}
      {c.done && c.facts.length === 0 && (
        <p className="font-mono px-3.5 py-3 text-hint text-[11px]">
          no durable facts in this message
        </p>
      )}
      {c.redactedCount > 0 && (
        <p className="px-3.5 py-2 border-t border-border flex items-center gap-1.5">
          <ShieldCheck size={11} className="text-hint" />
          <span className="font-mono text-hint text-[10px]">
            {c.redactedCount} sensitive fact{c.redactedCount === 1 ? '' : 's'}{' '}
            held back (PII)
          </span>
        </p>
      )}

      {/* this conversation's own insights (sentiment · intent · complaints) */}
      {c.insights && <InsightsPanel ins={c.insights} nested />}
    </div>
  )
}
