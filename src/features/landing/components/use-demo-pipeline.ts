import { useCallback, useEffect, useRef, useState } from 'react'

import type { CsvTable, MappedConversation } from './extractor'

import { extractFacts, parseConversations, parseCsvTable } from './extractor'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://api.convomem.com'

/* ─────────────────────────────────────────────────────────────────────────
   use-demo-pipeline — drives the live demo against the REAL backend pipeline
   (POST /api/v1/demo/capture, Server-Sent Events) and falls back to the local
   in-browser heuristic if the server is unreachable, so the landing page is
   never broken by a backend outage.

   The backend streams real pipeline events: stage (running/done/skipped),
   fact, done-conv, insights, done, error. We accumulate them into per-
   conversation state plus a conversation-end insights object. ───────────── */

const DEMO_URL = `${BASE_URL}/api/v1/demo/capture`

export type StageStatus = 'running' | 'done' | 'skipped'
export interface StageEvent {
  stage: number
  key: string
  label: string
  status: StageStatus
  detail?: string
}
export interface DemoFact {
  content: string
  memoryType: string
  category?: string | null
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'
  confidence: number
  durability?: number
  expiresAt?: string | null
  isSensitive: boolean
  tags: string[]
}
export interface ConvState {
  index: number
  channel: string
  stages: StageEvent[]
  facts: DemoFact[]
  redactedCount: number
  done: boolean
  insights?: InsightsResult
}
export interface Insight {
  type: string
  summary: string
  severity?: 'low' | 'medium' | 'high'
}
export interface InsightsResult {
  overallSentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'
  sentimentScore: number
  insights: Insight[]
  summary: string
}
export type Phase = 'idle' | 'mapping' | 'running' | 'done' | 'error'
export type Mode = 'live' | 'offline'

interface State {
  phase: Phase
  mode: Mode
  convs: ConvState[]
  insights: InsightsResult | null
  error: string | null
  csvTable: CsvTable | null
  rateLimited: boolean
  retryAfter: number
}

const INITIAL: State = {
  phase: 'idle',
  mode: 'live',
  convs: [],
  insights: null,
  error: null,
  csvTable: null,
  rateLimited: false,
  retryAfter: 0,
}

type Convo = {
  message?: string
  messages?: { role: 'user' | 'assistant'; content: string }[]
  channel: 'VOICE' | 'CHAT' | 'SMS' | 'EMAIL'
}

/* Collapse a conversation's turns into one text blob for the local heuristic. */
const convText = (c: Convo): string =>
  c.messages?.length
    ? c.messages.map((m) => m.content).join('\n')
    : (c.message ?? '')

/* Build a heuristic insights object from a set of extracted facts. */
function heuristicInsights(
  facts: ReturnType<typeof extractFacts>
): InsightsResult {
  const neg = facts.filter((f) => f.sentiment === 'NEGATIVE').length
  const pos = facts.filter((f) => f.sentiment === 'POSITIVE').length
  return {
    overallSentiment:
      neg > pos ? 'NEGATIVE' : pos > neg ? 'POSITIVE' : 'NEUTRAL',
    sentimentScore: facts.length
      ? Math.round(((pos - neg) / facts.length) * 100) / 100
      : 0,
    insights: [
      ...(neg
        ? [
            {
              type: 'complaint',
              summary: `${neg} negative signal${neg === 1 ? '' : 's'} detected`,
              severity: 'medium' as const,
            },
          ]
        : []),
      ...(facts.some((f) => f.memoryType === 'intent')
        ? [
            {
              type: 'buying_intent',
              summary: 'Forward-looking intent expressed',
              severity: 'low' as const,
            },
          ]
        : []),
    ],
    summary: 'Offline preview — connect to run the live pipeline.',
  }
}

/* Map the local heuristic output into the same shape as the live pipeline,
   so the UI renders identically when the backend is unavailable. */
function localFallback(conversations: Convo[]): {
  convs: ConvState[]
  insights: InsightsResult | null
} {
  const perConv = conversations.map((c) => extractFacts(convText(c)))
  const convs: ConvState[] = conversations.map((c, i) => {
    const facts = perConv[i]
    return {
      index: i,
      channel: c.channel,
      stages: [
        {
          stage: 1,
          key: 'extract',
          label: 'Extraction',
          status: 'done',
          detail: `${facts.length} facts`,
        } as StageEvent,
        {
          stage: 4,
          key: 'pii',
          label: 'PII redaction',
          status: 'done',
          detail: facts.some((f) => f.isSensitive) ? 'PII masked' : 'clean',
        } as StageEvent,
      ],
      facts: facts.map((f) => ({
        content: f.content,
        memoryType: f.memoryType,
        sentiment: f.sentiment,
        confidence: f.confidence,
        isSensitive: f.isSensitive,
        tags: f.tags,
      })),
      redactedCount: 0,
      done: true,
      insights: heuristicInsights(facts),
    }
  })
  // Aggregate only when there is more than one conversation (matches live).
  const insights =
    conversations.length > 1 ? heuristicInsights(perConv.flat()) : null
  return { convs, insights }
}

function parseSSE(buffer: string): {
  events: { event: string; data: unknown }[]
  rest: string
} {
  const events: { event: string; data: unknown }[] = []
  const parts = buffer.split('\n\n')
  const rest = parts.pop() ?? ''
  for (const part of parts) {
    const ev = part.match(/^event: (.+)$/m)?.[1]
    const dataLine = part.match(/^data: (.+)$/m)?.[1]
    if (!ev || !dataLine) continue
    try {
      events.push({ event: ev, data: JSON.parse(dataLine) })
    } catch {
      /* skip */
    }
  }
  return { events, rest }
}

export function useDemoPipeline() {
  const [state, setState] = useState<State>(INITIAL)
  const abortRef = useRef<AbortController | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const rateLimitedRef = useRef(false)

  useEffect(() => {
    if (state.retryAfter <= 0) {
      rateLimitedRef.current = false
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      return
    }
    rateLimitedRef.current = true
    timerRef.current = setInterval(() => {
      setState((s) => {
        if (s.retryAfter <= 1) {
          rateLimitedRef.current = false
          if (timerRef.current) clearInterval(timerRef.current)
          timerRef.current = null
          return { ...s, retryAfter: 0, rateLimited: false }
        }
        return { ...s, retryAfter: s.retryAfter - 1 }
      })
    }, 1000)
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [state.retryAfter])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setState(INITIAL)
  }, [])

  const upsertConv = (idx: number, patch: (c: ConvState) => ConvState) => {
    // Guard: events not tied to a conversation (e.g. the conversation-end
    // insights stage) carry no index — never let them spawn a phantom card.
    if (typeof idx !== 'number' || Number.isNaN(idx)) return
    setState((s) => {
      const convs = [...s.convs]
      const existing = convs.find((c) => c.index === idx)
      if (existing) {
        convs[convs.indexOf(existing)] = patch(existing)
      } else {
        convs.push(
          patch({
            index: idx,
            channel: 'CHAT',
            stages: [],
            facts: [],
            redactedCount: 0,
            done: false,
          })
        )
        convs.sort((a, b) => a.index - b.index)
      }
      return { ...s, convs }
    })
  }

  // Core executor: streams the real pipeline for an already-built conversation
  // list. `run`, `runMapped`, and the CSV path all funnel through here.
  const execute = useCallback(async (conversations: Convo[]) => {
    if (conversations.length === 0) return
    if (rateLimitedRef.current) return

    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac
    setState({ ...INITIAL, phase: 'running', mode: 'live' })

    try {
      const res = await fetch(DEMO_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversations, insights: true }),
        signal: ac.signal,
      })
      if (res.status === 429) {
        const retryAfter = Number(res.headers.get('retry-after')) || 60
        setState({
          ...INITIAL,
          error: `Rate limited — try again in ${retryAfter}s`,
          rateLimited: true,
          retryAfter,
        })
        return
      }
      if (!res.ok || !res.body) throw new Error(`demo endpoint ${res.status}`)

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const { events, rest } = parseSSE(buffer)
        buffer = rest
        for (const { event, data } of events) {
          const d = data as Record<string, unknown>
          switch (event) {
            case 'conv-start':
              upsertConv(d.index as number, (c) => ({
                ...c,
                channel: (d.channel as string) || c.channel,
              }))
              break
            case 'stage': {
              const ev: StageEvent = {
                stage: d.stage as number,
                key: d.key as string,
                label: d.label as string,
                status: d.status as StageStatus,
                detail: d.detail as string | undefined,
              }
              upsertConv(d.index as number, (c) => {
                const stages = [...c.stages]
                const at = stages.findIndex((s) => s.key === ev.key)
                if (at >= 0) stages[at] = ev
                else stages.push(ev)
                return { ...c, stages }
              })
              break
            }
            case 'fact':
              upsertConv(d.index as number, (c) => ({
                ...c,
                facts: [...c.facts, d.fact as DemoFact],
              }))
              break
            case 'done-conv':
              upsertConv(d.index as number, (c) => ({
                ...c,
                done: true,
                redactedCount: (d.redactedCount as number) || 0,
              }))
              break
            case 'conv-insights':
              upsertConv(d.index as number, (c) => ({
                ...c,
                insights: data as InsightsResult,
              }))
              break
            case 'insights':
              setState((s) => ({ ...s, insights: data as InsightsResult }))
              break
            case 'error':
              setState((s) => ({
                ...s,
                phase: 'error',
                error: (d.message as string) || 'Pipeline error',
              }))
              break
            case 'done':
              setState((s) => ({
                ...s,
                phase: s.phase === 'error' ? 'error' : 'done',
              }))
              break
          }
        }
      }
      setState((s) => (s.phase === 'running' ? { ...s, phase: 'done' } : s))
    } catch (_err) {
      if (ac.signal.aborted) return
      // Backend unreachable → seamless offline heuristic so the page still works.
      const { convs, insights } = localFallback(conversations)
      setState({ ...INITIAL, phase: 'done', mode: 'offline', convs, insights })
    }
  }, [])

  // Typed message → one conversation. Sample CSV → split by row (no mapping UI).
  const run = useCallback(
    (input: string, opts?: { csv?: boolean }) => {
      const conversations: Convo[] = opts?.csv
        ? parseConversations(input).map((c) => ({
            message: c.text,
            channel: (['voice', 'chat', 'sms', 'email'].includes(c.source)
              ? c.source.toUpperCase()
              : 'CHAT') as Convo['channel'],
          }))
        : input.trim()
          ? [{ message: input.trim(), channel: 'CHAT' }]
          : []
      return execute(conversations)
    },
    [execute]
  )

  // Uploaded CSV → parse into a table and open the column-mapping step.
  const prepareCsv = useCallback(
    (text: string) => {
      const table = parseCsvTable(text)
      if (table.columns.length === 0 || table.rows.length === 0) {
        return execute(
          text.trim() ? [{ message: text.trim(), channel: 'CHAT' }] : []
        )
      }
      setState({ ...INITIAL, phase: 'mapping', csvTable: table })
    },
    [execute]
  )

  // Confirmed column mapping → run the grouped, multi-turn conversations.
  const runMapped = useCallback(
    (conversations: MappedConversation[]) => {
      return execute(
        conversations.map((c) => ({
          messages: c.messages,
          channel: c.channel as Convo['channel'],
        }))
      )
    },
    [execute]
  )

  return { ...state, run, prepareCsv, runMapped, reset }
}
