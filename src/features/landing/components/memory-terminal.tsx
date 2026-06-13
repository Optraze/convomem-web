import { useRef, useState } from 'react'
import {
  Activity,
  ArrowRight,
  Check,
  Loader2,
  Minus,
  RotateCcw,
  ShieldCheck,
  Upload,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

import type {
  ConvState,
  DemoFact,
  InsightsResult,
  StageEvent,
} from './use-demo-pipeline'

import { Button } from '@/components/ui/button'

import { CsvMapper } from './csv-mapper'
import { MAX_CONVERSATIONS, SAMPLE_CSV } from './extractor'
import { useDemoPipeline } from './use-demo-pipeline'

const SENT: Record<DemoFact['sentiment'], { mark: string; label: string }> = {
  POSITIVE: { mark: '+', label: 'positive' },
  NEGATIVE: { mark: '−', label: 'negative' },
  NEUTRAL: { mark: '·', label: 'neutral' },
}

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
    desc: 'pulls candidate facts + self-validates',
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
    desc: 'detects + masks sensitive data before storage',
  },
  {
    key: 'reconcile',
    stage: 5,
    label: 'Reconcile & dedup',
    desc: 'merges against stored memory (production only)',
  },
]

type RowStatus = 'pending' | 'running' | 'done' | 'skipped'

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
        {status === 'skipped' && <Minus size={12} className="text-hint" />}
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
function PipelineTrace({
  stages,
  done,
}: {
  stages: StageEvent[]
  done: boolean
}) {
  const byKey = new Map(stages.map((s) => [s.key, s]))
  return (
    <div className="px-3.5 py-2 border-b border-border bg-surface/60">
      {STAGE_SEQUENCE.map((row) => {
        const ev = byKey.get(row.key)
        const status: RowStatus = ev
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
            active={ev?.status === 'running'}
          />
        )
      })}
    </div>
  )
}

function FactRow({ fact, index }: { fact: DemoFact; index: number }) {
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

function ConvCard({ c, n }: { c: ConvState; n: number }) {
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

function InsightsPanel({
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

export function MemoryTerminal() {
  const {
    phase,
    mode,
    convs,
    insights,
    csvTable,
    error,
    rateLimited,
    retryAfter,
    run,
    prepareCsv,
    runMapped,
    reset,
  } = useDemoPipeline()
  const [text, setText] = useState('')
  const [drag, setDrag] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const onFile = (file?: File) => {
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    // CSV uploads open the column-mapping step (typed text / sample run directly).
    reader.onload = () => {
      setText('')
      prepareCsv(String(reader.result || ''))
    }
    reader.readAsText(file)
  }

  const resetAll = () => {
    reset()
    setText('')
    setFileName(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const showInput = phase === 'idle'
  const totalFacts = convs.reduce((n, c) => n + c.facts.length, 0)

  return (
    // biome-ignore lint/a11y/useSemanticElements: section tag not suitable here
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: drag-and-drop container
    <div
      role="region"
      tabIndex={-1}
      aria-label="Demo pipeline terminal"
      onDragOver={(e) => {
        e.preventDefault()
        setDrag(true)
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDrag(false)
        onFile(e.dataTransfer.files?.[0])
      }}
      className={`relative rounded-xl border bg-surface overflow-hidden transition-colors ${drag ? 'border-foreground' : 'border-border-strong'}`}
    >
      {/* top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-foreground/25 to-transparent" />
      {/* terminal chrome */}
      <div className="relative flex items-center justify-between px-4 py-2.5 border-b border-border">
        <div className="flex items-center gap-3">
          {/* window controls */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-border-strong/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-border-strong/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-border-strong/60" />
          </div>
          <span className="font-mono text-subtle text-[12px]">
            memory.pipeline
          </span>
        </div>
        <div className="flex items-center gap-3">
          {phase === 'running' && (
            <span className="font-mono text-hint text-[10px] tracking-[0.14em] uppercase scan-text">
              live · processing
            </span>
          )}
          {phase === 'mapping' && (
            <span className="font-mono text-hint text-[10px] tracking-[0.12em] uppercase">
              map · preview
            </span>
          )}
          {(phase === 'done' || phase === 'error') && (
            <>
              <span className="font-mono text-hint text-[10px] tracking-[0.12em] uppercase">
                {mode === 'offline' ? 'offline preview' : 'live · real model'}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetAll}
                className="font-mono text-[10px] tracking-[0.12em] uppercase"
              >
                <RotateCcw size={11} /> reset
              </Button>
            </>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showInput ? (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 sm:p-5"
          >
            <label
              htmlFor="demo-message"
              className="font-mono block text-hint text-[10px] tracking-[0.18em] uppercase mb-2.5"
            >
              paste a real message — run it through the real pipeline
            </label>
            <textarea
              id="demo-message"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (
                  (e.metaKey || e.ctrlKey) &&
                  e.key === 'Enter' &&
                  text.trim()
                )
                  run(text)
              }}
              rows={3}
              placeholder="Try: &quot;Hey — my order #4471 still hasn't shipped and it's been a week. Pretty frustrated honestly.&quot;"
              className="w-full resize-none bg-background border border-border rounded-lg px-3.5 py-3 text-foreground placeholder:text-hint/80 focus:outline-none focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10 transition-all"
              style={{ fontSize: '13px', lineHeight: 1.6 }}
            />
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2.5">
              <Button
                type="button"
                onClick={() => text.trim() && run(text)}
                disabled={!text.trim() || rateLimited}
                className="group"
              >
                {rateLimited ? (
                  <>Retry in {retryAfter}s</>
                ) : (
                  <>
                    Run the pipeline
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileRef.current?.click()}
              >
                <Upload size={13} /> Drop a CSV
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => prepareCsv(SAMPLE_CSV)}
                className="font-mono text-[11px] sm:ml-1"
              >
                or load sample →
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.txt,text/csv,text/plain"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0] ?? undefined)}
              />
            </div>
            <p className="font-mono mt-3 flex items-center gap-1.5 text-hint text-[10px] leading-relaxed">
              <ShieldCheck size={10} className="text-hint/80" />
              {fileName ? <>file · {fileName} · </> : null}
              up to {MAX_CONVERSATIONS} conversations · nothing is stored
            </p>
            {rateLimited && (
              <p className="font-mono mt-2 text-subtle text-[10px] leading-relaxed">
                Rate limited · retry in {retryAfter}s
              </p>
            )}
          </motion.div>
        ) : phase === 'mapping' && csvTable ? (
          <motion.div
            key="mapping"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CsvMapper table={csvTable} onRun={runMapped} onCancel={resetAll} />
          </motion.div>
        ) : (
          <motion.div
            key="output"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 sm:p-5 space-y-3 max-h-150 overflow-y-auto scrollbar-hide"
          >
            {convs.map((c, i) => (
              <ConvCard key={c.index} c={c} n={i} />
            ))}
            {insights && (
              <InsightsPanel ins={insights} title="across all conversations" />
            )}
            {error && (
              <p className="font-mono text-subtle text-[11px] px-1">{error}</p>
            )}
            {phase === 'done' && (
              <div className="flex items-center justify-between pt-1">
                <span className="font-mono text-hint text-[11px]">
                  {totalFacts} facts · {convs.length}{' '}
                  {convs.length === 1 ? 'conversation' : 'conversations'}
                </span>
                <span className="font-mono inline-flex items-center gap-1.5 text-hint text-[10px] tracking-[0.12em] uppercase">
                  <ShieldCheck size={11} /> nothing stored
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
