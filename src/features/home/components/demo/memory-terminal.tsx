import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Check,
  Database,
  FileText,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
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
  {
    label: 'Call',
    text: customerExample.voice,
    channel: 'VOICE' as const,
    icon: Phone,
  },
  {
    label: 'Chat',
    text: customerExample.chat,
    channel: 'CHAT' as const,
    icon: MessageSquare,
  },
  {
    label: 'Email',
    text: customerExample.emailMessage,
    channel: 'EMAIL' as const,
    icon: Mail,
  },
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
    retry,
    previewLocally,
  } = useDemoPipeline()
  const [text, setText] = useState<string>(customerExample.voice)
  const [selectedExample, setSelectedExample] = useState<number | null>(0)
  const [drag, setDrag] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const regionRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (phase === 'idle' || phase === 'mapping' || phase === 'running')
      regionRef.current
        ?.closest('.customer-demo-body')
        ?.scrollTo({ top: 0, behavior: 'instant' })
  }, [phase])
  const onFile = (file?: File) => {
    if (!file || phase !== 'idle') return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => {
      prepareCsv(String(reader.result || ''))
    }
    reader.readAsText(file)
  }
  const resetAll = () => {
    reset()
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
      ref={regionRef}
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
            <h2>See what a conversation becomes.</h2>
            <p>
              Try a customer story below, or edit the message to make it your
              own.
            </p>
            <fieldset
              className="demo-message-examples"
              aria-label="Choose a customer conversation"
            >
              {examples.map((example, index) => (
                <button
                  type="button"
                  key={example.label}
                  aria-pressed={selectedExample === index}
                  onClick={() => {
                    setText(example.text)
                    setSelectedExample(index)
                  }}
                >
                  <example.icon size={15} />
                  {example.label}
                </button>
              ))}
            </fieldset>
            <div className="demo-message-label">
              <label htmlFor="demo-message">Customer message</label>
              <span>{text.length.toLocaleString()} / 4,000</span>
            </div>
            <textarea
              id="demo-message"
              value={text}
              maxLength={4000}
              rows={5}
              onChange={(event) => {
                setText(event.target.value)
              }}
              onKeyDown={(event) => {
                if (
                  (event.metaKey || event.ctrlKey) &&
                  event.key === 'Enter' &&
                  text.trim() &&
                  !rateLimited &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault()
                  run(text, {
                    channel:
                      selectedExample === null
                        ? 'CHAT'
                        : examples[selectedExample].channel,
                  })
                }
              }}
              placeholder="Paste a customer message…"
              aria-describedby="demo-message-help"
            />
            <div className="demo-compose-actions">
              <button
                type="button"
                className="demo-primary-action"
                disabled={!text.trim() || rateLimited}
                onClick={() =>
                  text.trim() &&
                  run(text, {
                    channel:
                      selectedExample === null
                        ? 'CHAT'
                        : examples[selectedExample].channel,
                  })
                }
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
                <p>
                  Import your own CSV, or run five ready-made conversations.
                </p>
                <div>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                  >
                    Import CSV
                    <FileText size={12} />
                  </button>
                  <button
                    type="button"
                    disabled={rateLimited}
                    onClick={() => run(SAMPLE_CSV, { csv: true })}
                  >
                    Run sample conversations
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
              Uses the live capture extractor and memory-policy checks. No
              customer records are saved.
            </p>
          </aside>
        </div>
      ) : phase === 'mapping' && csvTable ? (
        <div className="demo-mapping">
          <div className="demo-state-heading">
            <div>
              <span className="demo-step-eyebrow">IMPORT / REVIEW</span>
              <h2>Review your import.</h2>
              <p>
                {fileName || 'Your CSV'} · Check the messages before running.
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
                  : phase === 'error'
                    ? 'Your live run could not be completed. Retry, or edit your input.'
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
                  ? 'Local preview · no AI'
                  : phase === 'running'
                    ? 'Live · processing'
                    : phase === 'error'
                      ? 'Live · interrupted'
                      : 'Live model'}
              </span>
              {phase === 'running' && (
                <button type="button" onClick={resetAll}>
                  Cancel run
                </button>
              )}
              {phase !== 'running' && (
                <button type="button" onClick={resetAll}>
                  <RotateCcw size={12} />
                  {phase === 'error' ? 'Edit input' : 'Try another message'}
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
            <ConvCard
              key={conversation.index}
              c={conversation}
              n={index}
              running={phase === 'running'}
            />
          ))}
          {insights && (
            <InsightsPanel ins={insights} title="Across all conversations" />
          )}
          {error && (
            <div className="demo-failure" role="alert">
              <p>{error}</p>
              <div>
                <button
                  type="button"
                  className="demo-primary-action"
                  onClick={retry}
                >
                  Retry live extraction <RotateCcw size={14} />
                </button>
                <button
                  type="button"
                  className="demo-local-preview"
                  onClick={previewLocally}
                >
                  See a local preview instead (no AI)
                </button>
              </div>
            </div>
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
