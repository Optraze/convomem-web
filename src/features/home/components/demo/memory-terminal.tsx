import { useRef, useState } from 'react'
import { ArrowRight, RotateCcw, ShieldCheck, Upload } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

import { Button } from '@/components/ui/button'

import { ConvCard } from './conv-card'
import { CsvMapper } from './csv-mapper'
import { MAX_CONVERSATIONS, SAMPLE_CSV } from './extractor'
import { InsightsPanel } from './insights-panel'
import { useDemoPipeline } from './use-demo-pipeline'

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
