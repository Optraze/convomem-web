import { useRef, useState } from 'react'
import {
  ArrowRight,
  Check,
  Database,
  FileText,
  Loader2,
  MessageSquare,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Upload,
} from 'lucide-react'

import { customerExample } from '../../customer-example'
import { ConvCard } from './conv-card'
import { CsvMapper } from './csv-mapper'
import { MAX_CONVERSATIONS, SAMPLE_CSV } from './extractor'
import { InsightsPanel } from './insights-panel'
import { useDemoPipeline } from './use-demo-pipeline'

const examples = [
  { label: 'Earlier call', text: customerExample.voice },
  { label: 'Returning customer', text: customerExample.chat },
  { label: 'Follow-up preference', text: customerExample.emailMessage },
]

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
    if (!file || phase !== 'idle') return
    setFileName(file.name)
    const reader = new FileReader()
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
  const totalFacts = convs.reduce(
    (count, conversation) => count + conversation.facts.length,
    0
  )
  return (
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: file drop supplements the keyboard-accessible Import CSV button
    <section
      aria-label="Customer memory demo"
      className={`demo-terminal ${drag ? 'demo-terminal-dragging' : ''}`}
      onDragOver={(event) => {
        event.preventDefault()
        if (phase === 'idle') setDrag(true)
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(event) => {
        event.preventDefault()
        setDrag(false)
        onFile(event.dataTransfer.files?.[0])
      }}
    >
      {phase === 'idle' ? (
        <div className="demo-input-layout">
          <div className="demo-compose">
            <span className="demo-step-eyebrow">01 / YOUR CONVERSATION</span>
            <h2>Start with a conversation.</h2>
            <p>Choose an example, or add a customer message of your own.</p>
            <label htmlFor="demo-message">Customer message</label>
            <textarea
              id="demo-message"
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if (
                  (event.metaKey || event.ctrlKey) &&
                  event.key === 'Enter' &&
                  text.trim() &&
                  !rateLimited &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault()
                  run(text)
                }
              }}
              rows={5}
              placeholder="Tell us what the customer said. Preferences, plans, questions, and concerns are a good place to start."
              aria-describedby="demo-message-help"
            />
            <div className="demo-example-row">
              <span>Try an example</span>
              {examples.map((example) => (
                <button
                  type="button"
                  key={example.label}
                  onClick={() => setText(example.text)}
                  aria-label={`Use ${example.label.toLowerCase()} example`}
                >
                  {example.label}
                </button>
              ))}
            </div>
            <div className="demo-compose-actions">
              <button
                type="button"
                className="demo-primary-action"
                disabled={!text.trim() || rateLimited}
                onClick={() => text.trim() && run(text)}
              >
                {rateLimited ? (
                  `Retry in ${retryAfter}s`
                ) : (
                  <>
                    Extract memory
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
              <span>Ctrl / ⌘ + Enter</span>
            </div>
            <p className="demo-privacy-note" id="demo-message-help">
              <ShieldCheck size={13} />
              Up to {MAX_CONVERSATIONS} conversations. Nothing is stored.
            </p>
            {rateLimited && (
              <p className="demo-input-error" role="alert">
                Please wait {retryAfter} seconds before trying again.
              </p>
            )}
            <div className="demo-csv-option">
              <Upload size={20} />
              <div>
                <strong>Have a transcript file?</strong>
                <p>Import a CSV and map its columns before running.</p>
                <div>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                  >
                    Import CSV
                    <FileText size={12} />
                  </button>
                  <button type="button" onClick={() => prepareCsv(SAMPLE_CSV)}>
                    Try a sample CSV
                  </button>
                </div>
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.txt,text/csv,text/plain"
              className="hidden"
              onChange={(event) => onFile(event.target.files?.[0] ?? undefined)}
            />
          </div>
          <aside className="demo-guide">
            <span className="demo-guide-icon">
              <Database size={22} />
            </span>
            <span className="demo-step-eyebrow">02 / WHAT YOU’LL SEE</span>
            <h3>
              From words
              <br />
              to useful memory.
            </h3>
            <div>
              <span>
                <Check size={14} />
              </span>
              <div>
                <strong>Customer facts</strong>
                <p>Preferences, plans, and details worth remembering.</p>
              </div>
            </div>
            <div>
              <span>
                <Sparkles size={14} />
              </span>
              <div>
                <strong>Conversation signals</strong>
                <p>Intent, sentiment, and issues found in the message.</p>
              </div>
            </div>
            <div>
              <span>
                <FileText size={14} />
              </span>
              <div>
                <strong>A visible processing trace</strong>
                <p>See the steps behind the result, as they happen.</p>
              </div>
            </div>
            <p className="demo-guide-note">
              <MessageSquare size={14} />
              The live demo uses a model. If the service is unavailable, results
              are clearly marked as a local preview.
            </p>
          </aside>
        </div>
      ) : phase === 'mapping' && csvTable ? (
        <div className="demo-mapping">
          <div className="demo-state-heading">
            <div>
              <span className="demo-step-eyebrow">IMPORT / REVIEW</span>
              <h2>Connect your columns.</h2>
              <p>
                {fileName ? fileName : 'Sample CSV'} · Preview the conversations
                before running.
              </p>
            </div>
          </div>
          <CsvMapper table={csvTable} onRun={runMapped} onCancel={resetAll} />
        </div>
      ) : (
        <div className="demo-results">
          <div className="demo-state-heading">
            <div>
              <span className="demo-step-eyebrow">
                {phase === 'running'
                  ? 'EXTRACTING CUSTOMER MEMORY'
                  : 'YOUR RESULTS'}
              </span>
              <h2>
                {phase === 'running'
                  ? 'Finding what matters.'
                  : phase === 'error'
                    ? 'The demo needs another try.'
                    : 'Your conversation, understood.'}
              </h2>
              <p>
                {phase === 'running'
                  ? 'Facts and signals appear here as the conversation is processed.'
                  : `${totalFacts} ${totalFacts === 1 ? 'fact' : 'facts'} across ${convs.length} ${convs.length === 1 ? 'conversation' : 'conversations'}.`}
              </p>
            </div>
            <div className="demo-result-actions">
              <span
                className={`demo-mode-badge ${mode === 'offline' ? 'demo-mode-offline' : ''}`}
              >
                {phase === 'running' ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <span />
                )}
                {mode === 'offline'
                  ? 'Local preview'
                  : phase === 'running'
                    ? 'Live · processing'
                    : 'Live model'}
              </span>
              {phase !== 'running' && (
                <button type="button" onClick={resetAll}>
                  <RotateCcw size={12} />
                  Try another message
                </button>
              )}
            </div>
          </div>
          {mode === 'offline' && (
            <p className="demo-offline-notice" role="status">
              The live service is unavailable. These results are a local
              heuristic preview, rather than a live model response.
            </p>
          )}
          {convs.map((conversation, index) => (
            <ConvCard key={conversation.index} c={conversation} n={index} />
          ))}
          {insights && (
            <InsightsPanel ins={insights} title="Across all conversations" />
          )}
          {error && (
            <p className="demo-input-error" role="alert">
              {error}
            </p>
          )}
          {phase === 'running' && convs.length === 0 && (
            <div className="demo-starting" role="status">
              <Loader2 size={22} className="animate-spin" />
              <span>Connecting to the live extraction service…</span>
            </div>
          )}
          {phase === 'done' && (
            <div className="demo-results-footer">
              <ShieldCheck size={13} />
              Demo complete. Nothing is stored.
            </div>
          )}
        </div>
      )}
    </section>
  )
}
