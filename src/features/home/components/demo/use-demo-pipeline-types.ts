import type { CsvTable } from './extractor'

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

export interface State {
  phase: Phase
  mode: Mode
  convs: ConvState[]
  insights: InsightsResult | null
  error: string | null
  csvTable: CsvTable | null
  rateLimited: boolean
  retryAfter: number
}

export const INITIAL: State = {
  phase: 'idle',
  mode: 'live',
  convs: [],
  insights: null,
  error: null,
  csvTable: null,
  rateLimited: false,
  retryAfter: 0,
}

export type Convo = {
  message?: string
  messages?: { role: 'user' | 'assistant'; content: string }[]
  channel: 'VOICE' | 'CHAT' | 'SMS' | 'EMAIL'
}
