import { useCallback, useEffect, useRef, useState } from 'react'

import type { MappedConversation } from './extractor'
import type {
  Convo,
  ConvState,
  DemoFact,
  StageEvent,
  StageStatus,
  State,
} from './use-demo-pipeline-types'

import { readDemoStream, readInsights } from './demo-stream'
import { parseConversations, parseCsvTable } from './extractor'
import { localFallback } from './use-demo-pipeline-fallback'
import { INITIAL } from './use-demo-pipeline-types'

export type {
  ConvState,
  DemoFact,
  Insight,
  InsightsResult,
  Mode,
  Phase,
  StageEvent,
  StageStatus,
} from './use-demo-pipeline-types'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://api.convomem.com'

/* ─────────────────────────────────────────────────────────────────────────
   use-demo-pipeline — drives the live demo against the REAL backend pipeline
   (POST /api/v1/demo/capture, Server-Sent Events) and offers a separately labelled local
   preview only when the visitor explicitly chooses it after a live error.

   The backend streams real pipeline events: stage (running/done/skipped),
   fact, done-conv, insights, done, error. We accumulate them into per-
   conversation state plus a conversation-end insights object. ───────────── */

const DEMO_URL = `${BASE_URL}/api/v1/demo/capture`

export function useDemoPipeline() {
  const [state, setState] = useState<State>(INITIAL)
  const abortRef = useRef<AbortController | null>(null)
  const lastRequest = useRef<Convo[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const rateLimitedRef = useRef(false)
  useEffect(() => () => abortRef.current?.abort(), [])

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
    lastRequest.current = []
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setState(INITIAL)
  }, [])

  const upsertConv = useCallback(
    (idx: number, patch: (c: ConvState) => ConvState) => {
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
    },
    []
  )

  // Core executor: streams the real pipeline for an already-built conversation
  // list. `run`, `runMapped`, and the CSV path all funnel through here.
  const execute = useCallback(
    async (conversations: Convo[]) => {
      if (conversations.length === 0) return
      if (rateLimitedRef.current) return

      abortRef.current?.abort()
      const ac = new AbortController()
      abortRef.current = ac
      lastRequest.current = conversations
      setState({ ...INITIAL, phase: 'running', mode: 'live' })

      try {
        const res = await fetch(DEMO_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversations, insights: true }),
          signal: ac.signal,
        })
        if (ac.signal.aborted || abortRef.current !== ac) return
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
        if (!res.ok)
          throw new Error(
            res.status === 400
              ? 'Check your input: up to 5 conversations, 20 messages each, and 4,000 characters per message.'
              : 'The live service is unavailable. Please retry in a moment.'
          )

        for await (const { event, data } of readDemoStream(res)) {
          if (ac.signal.aborted || abortRef.current !== ac) return
          const d = data
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
                insights: readInsights(data),
              }))
              break
            case 'insights':
              setState((s) => ({ ...s, insights: readInsights(data) }))
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
      } catch (_err) {
        if (ac.signal.aborted) return
        setState((s) => ({
          ...s,
          phase: 'error',
          mode: 'live',
          error:
            _err instanceof Error &&
            _err.message.startsWith('Check your input:')
              ? _err.message
              : 'The live run could not be completed. Your input has not been saved. Please retry.',
        }))
      }
    },
    [upsertConv]
  )

  // Typed message → one conversation. Sample CSV → split by row (no mapping UI).
  const run = useCallback(
    (input: string, opts?: { csv?: boolean; channel?: Convo['channel'] }) => {
      const conversations: Convo[] = opts?.csv
        ? parseConversations(input).map((c) => ({
            message: c.text,
            channel: (['voice', 'chat', 'sms', 'email'].includes(c.source)
              ? c.source.toUpperCase()
              : 'CHAT') as Convo['channel'],
          }))
        : input.trim()
          ? [{ message: input.trim(), channel: opts?.channel || 'CHAT' }]
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

  const retry = () => execute(lastRequest.current)
  const previewLocally = () => {
    abortRef.current?.abort()
    const { convs, insights } = localFallback(lastRequest.current)
    setState({ ...INITIAL, phase: 'done', mode: 'offline', convs, insights })
  }

  return { ...state, run, prepareCsv, runMapped, reset, retry, previewLocally }
}
