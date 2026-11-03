import { Check, Loader2, Minus } from 'lucide-react'

import type { StageEvent } from './use-demo-pipeline'

/* The full pipeline, in order — rendered as a live trace. Each row lights up
   as the real backend event for its key arrives; until then it reads "pending". */
const STAGE_SEQUENCE: {
  key: string
  stage: number
  label: string
  desc: string
}[] = [
  {
    key: 'extract',
    stage: 1,
    label: 'Extraction',
    desc: 'finds facts grounded in the conversation',
  },
  {
    key: 'environment',
    stage: 2,
    label: 'Environmental filter',
    desc: 'drops transient noise (weather, connectivity)',
  },
  {
    key: 'durability',
    stage: 3,
    label: 'Durability scoring',
    desc: 'scores each fact, assigns a TTL by memory type',
  },
  {
    key: 'pii',
    stage: 4,
    label: 'PII redaction',
    desc: 'masks or withholds sensitive details',
  },
  {
    key: 'reconcile',
    stage: 5,
    label: 'Reconcile & dedup',
    desc: 'removes duplicates within this conversation',
  },
  {
    key: 'insights',
    stage: 6,
    label: 'Conversation signals',
    desc: 'detects sentiment, intent and customer issues',
  },
]

type RowStatus = 'pending' | 'running' | 'done' | 'skipped' | 'stopped'

/* ── A single pipeline stage row in the detailed live trace ── */
function StageRow({
  stage,
  label,
  desc,
  status,
  detail,
  active,
}: {
  stage: number
  label: string
  desc: string
  status: RowStatus
  detail?: string
  active: boolean
}) {
  const dim = status === 'pending' || status === 'skipped'
  return (
    <div
      className={`flex items-start gap-3 py-2 border-b border-border last:border-0 transition-opacity ${status === 'pending' ? 'opacity-45' : 'opacity-100'}`}
    >
      <span className="w-4 shrink-0 flex items-center justify-center mt-0.5">
        {status === 'running' && (
          <Loader2 size={12} className="text-foreground animate-spin" />
        )}
        {status === 'done' && <Check size={12} className="text-foreground" />}
        {(status === 'skipped' || status === 'stopped') && (
          <Minus size={12} className="text-hint" />
        )}
        {status === 'pending' && (
          <span className="w-1.5 h-1.5 rounded-full border border-border-strong" />
        )}
      </span>
      <span className="font-mono text-hint tnum text-[10px] w-5 shrink-0 mt-0.5">
        S{stage}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3">
          <span
            className={dim ? 'text-subtle' : 'text-foreground'}
            style={{ fontSize: '12.5px', fontWeight: 500 }}
          >
            {label}
          </span>
          {detail && (
            <span
              className={`font-mono text-[10px] text-right whitespace-nowrap ${active ? 'text-foreground' : 'text-hint'}`}
            >
              {detail}
            </span>
          )}
        </div>
        <p
          className="text-hint mt-0.5"
          style={{ fontSize: '10.5px', lineHeight: 1.4 }}
        >
          {desc}
        </p>
      </div>
    </div>
  )
}

/* Render the complete pipeline sequence, merging in live events by key. */
export function PipelineTrace({
  stages,
  done,
  stopped = false,
}: {
  stages: StageEvent[]
  done: boolean
  stopped?: boolean
}) {
  const byKey = new Map(stages.map((s) => [s.key, s]))
  return (
    <div className="px-3.5 py-2 border-b border-border bg-surface/60">
      {STAGE_SEQUENCE.map((row) => {
        const ev = byKey.get(row.key)
        const status: RowStatus =
          stopped && ev?.status === 'running'
            ? 'stopped'
            : ev
              ? (ev.status as RowStatus)
              : done
                ? 'skipped'
                : 'pending'
        return (
          <StageRow
            key={row.key}
            stage={row.stage}
            label={row.label}
            desc={row.desc}
            status={status}
            detail={ev?.detail}
            active={status === 'running'}
          />
        )
      })}
    </div>
  )
}
