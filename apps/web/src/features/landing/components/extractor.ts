/* ─────────────────────────────────────────────────────────────────────────
   Client-side memory extractor — a faithful, dependency-free mirror of the
   server capture pipeline (apps/api/src/services/capture.service.js).

   This runs entirely in the browser so the landing-page demo never needs an
   API key, never hits a rate limit, and always works on whatever a visitor
   pastes or drops in. It is a heuristic — not the real LLM — but it produces
   the same record shape: { content, memoryType, sentiment, confidence,
   isSensitive, tags }. Capped at MAX_CONVERSATIONS to keep the demo honest.
   ──────────────────────────────────────────────────────────────────────── */

export const MAX_CONVERSATIONS = 5

/** Mirrors the Prisma enum used server-side. */
export type MemoryType =
  | 'fact'
  | 'preference'
  | 'intent'
  | 'goal'
  | 'temporary'
  | 'decision'
  | 'context'
  | 'technical'

export type Sentiment = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'

export interface Fact {
  content: string
  memoryType: MemoryType
  sentiment: Sentiment
  confidence: number // 0..1
  isSensitive: boolean // PII detected → would be redacted at rest
  tags: string[]
}

export interface ConversationResult {
  id: string
  source: string // "chat" | "voice" | "email" | "sms"
  transcript: string // the raw (already PII-masked) message
  facts: Fact[]
  reply: string // the agent's memory-aware next turn
}

/* ── PII patterns: detected and masked BEFORE anything is "stored" ───────── */
const PII = [
  { re: /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g, mask: '‹email›' },
  { re: /\b(?:\+?\d[\s-]?){9,13}\d\b/g, mask: '‹phone›' },
  { re: /\b(?:\d[ -]?){13,16}\b/g, mask: '‹card›' },
]

function maskPII(text: string): { masked: string; hadPII: boolean } {
  let masked = text
  let hadPII = false
  for (const { re, mask } of PII) {
    if (re.test(masked)) {
      hadPII = true
      masked = masked.replace(re, mask)
    }
    re.lastIndex = 0
  }
  return { masked, hadPII }
}

/* ── Lexical signals → memoryType + sentiment, ordered by specificity ────── */
interface Rule {
  test: RegExp
  type: MemoryType
  sentiment?: Sentiment
  label: (m: RegExpMatchArray, raw: string) => string
  tags: (m: RegExpMatchArray) => string[]
}

const RULES: Rule[] = [
  {
    test: /\border\s*#?\s*(\d{3,6})\b/i,
    type: 'context',
    label: (m) => `order #${m[1]}`,
    tags: (m) => ['order', m[1], 'order-status'],
  },
  {
    test: /\b(?:i\s*(?:'m| am)|my name is|this is)\s+([A-Z][a-z]+)\b/,
    type: 'fact',
    label: (m) => `customer name · ${m[1]}`,
    tags: (m) => ['name', 'identity', m[1].toLowerCase()],
  },
  {
    test: /\b(?:prefer|rather|i'?d like|i like|always use)\s+([a-z][a-z\s]{2,24})/i,
    type: 'preference',
    label: (m) => `prefers ${m[1].trim().toLowerCase()}`,
    tags: (m) => [
      'preference',
      ...m[1].trim().toLowerCase().split(/\s+/).slice(0, 3),
    ],
  },
  {
    test: /\b(?:cancel|cancelling|refund|unsubscribe|downgrade)\b/i,
    type: 'intent',
    sentiment: 'NEGATIVE',
    label: (m) => `intent · ${m[0].toLowerCase()} requested`,
    tags: () => ['churn-risk', 'cancellation', 'retention'],
  },
  {
    test: /\b(?:renew|renewal|upgrade|upgrading|expand|add\s+seats?)\b/i,
    type: 'intent',
    sentiment: 'POSITIVE',
    label: (m) => `intent · ${m[0].toLowerCase()}`,
    tags: () => ['expansion', 'upsell', 'renewal'],
  },
  {
    test: /\b(?:we\s+(?:decided|agreed|chose|signed)|going with|we'?ll go with)\b[^.!?]*/i,
    type: 'decision',
    label: (m) => m[0].trim().toLowerCase().slice(0, 56),
    tags: () => ['decision', 'commitment'],
  },
  {
    test: /\$\s?(\d[\d,]*(?:\.\d{2})?)\b/,
    type: 'context',
    label: (m) => `amount · $${m[1]}`,
    tags: (m) => ['amount', 'billing', m[1].replace(/,/g, '')],
  },
  {
    test: /\b(?:next\s+(?:week|month|quarter)|tomorrow|Q[1-4]\s*20\d{2}|by\s+\w+day)\b/i,
    type: 'temporary',
    label: (m) => `timeframe · ${m[0].toLowerCase()}`,
    tags: (m) => [
      'timeframe',
      'follow-up',
      m[0].toLowerCase().replace(/\s+/g, '-'),
    ],
  },
  {
    test: /\b(?:want to|plan to|going to|i'?ll|we'?ll|need to)\s+([a-z][a-z\s]{3,30})/i,
    type: 'intent',
    label: (m) => `intends to ${m[1].trim().toLowerCase()}`,
    tags: (m) => [
      'intent',
      ...m[1].trim().toLowerCase().split(/\s+/).slice(0, 2),
    ],
  },
  {
    test: /\b(?:API|SDK|webhook|integration|endpoint|latency|deploy|database|self-?host)\b/i,
    type: 'technical',
    label: (m) => `technical · ${m[0].toLowerCase()}`,
    tags: (m) => ['technical', m[0].toLowerCase()],
  },
]

const NEG =
  /\b(frustrat|angry|disappoint|terrible|awful|broken|not work|delayed?|late|stuck|annoy|worst|hate|unhappy|wrong|fail)/i
const POS =
  /\b(love|great|awesome|perfect|thank|happy|excellent|amazing|fantastic|appreciate|brilliant|smooth)/i

function sentimentOf(text: string): Sentiment {
  if (NEG.test(text)) return 'NEGATIVE'
  if (POS.test(text)) return 'POSITIVE'
  return 'NEUTRAL'
}

const STOP = new Set(
  'the a an and or but to of in on for with my your our is are was it i we you'.split(
    ' '
  )
)
function keywords(text: string): string[] {
  return [
    ...new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 3 && !STOP.has(w))
    ),
  ].slice(0, 4)
}

/** Extract structured facts from one raw customer message. */
export function extractFacts(raw: string): Fact[] {
  const { masked, hadPII } = maskPII(raw)
  const baseSentiment = sentimentOf(raw)
  const facts: Fact[] = []
  const seen = new Set<string>()

  for (const rule of RULES) {
    const m = masked.match(rule.test)
    if (!m) continue
    const content = rule.label(m, masked)
    const key = content.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    facts.push({
      content,
      memoryType: rule.type,
      sentiment: rule.sentiment ?? baseSentiment,
      confidence:
        Math.round(
          (0.78 + Math.min(0.2, content.length / 240) + (m[1] ? 0.04 : 0)) * 100
        ) / 100,
      isSensitive:
        hadPII && /name|email|phone|card/.test(rule.tags(m).join(' ')),
      tags: rule.tags(m).slice(0, 5),
    })
  }

  // Always surface the emotional read — it is the signal customers care about.
  if (
    baseSentiment !== 'NEUTRAL' &&
    !facts.some((f) => f.sentiment === baseSentiment)
  ) {
    facts.push({
      content: `sentiment · ${baseSentiment === 'NEGATIVE' ? 'frustrated' : 'positive'}`,
      memoryType: 'context',
      sentiment: baseSentiment,
      confidence: 0.86,
      isSensitive: false,
      tags: ['sentiment', baseSentiment.toLowerCase()],
    })
  }

  // Fallback so every message yields at least one record.
  if (facts.length === 0) {
    facts.push({
      content: masked.length > 64 ? `${masked.slice(0, 61).trim()}…` : masked,
      memoryType: 'fact',
      sentiment: baseSentiment,
      confidence: 0.72,
      isSensitive: hadPII,
      tags: keywords(masked),
    })
  }

  return facts.slice(0, 6)
}

/** Compose a memory-aware "next turn" reply that cites the captured facts. */
export function composeReply(facts: Fact[]): string {
  const order = facts.find((f) => /order/.test(f.content))
  const neg = facts.find((f) => f.sentiment === 'NEGATIVE')
  const intent = facts.find((f) => f.memoryType === 'intent')
  const name = facts
    .find((f) => /name ·/.test(f.content))
    ?.content.split('· ')[1]

  const hi = name ? `Welcome back, ${name}.` : 'Welcome back.'
  if (order && neg)
    return `${hi} I see ${order.content} is still delayed — let me make this right before we go further.`
  if (intent)
    return `${hi} Last time you mentioned wanting to ${intent.content.replace(/^(intends to|intent · )/, '')} — want to pick up there?`
  if (neg)
    return `${hi} I know last time was frustrating — I've got the full history, so you won't have to repeat yourself.`
  return `${hi} I already have your history on file — no need to start from scratch.`
}

/* ── CSV / transcript parsing ─────────────────────────────────────────────
   Accepts real CSVs (quoted fields, commas inside quotes) and raw pasted
   text. Detects a message-bearing column; otherwise treats each line as a
   conversation. Hard-capped at MAX_CONVERSATIONS. ──────────────────────── */

function parseCSVLine(line: string): string[] {
  const out: string[] = []
  let cur = ''
  let q = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (q) {
      if (c === '"' && line[i + 1] === '"') {
        cur += '"'
        i++
      } else if (c === '"') q = false
      else cur += c
    } else if (c === '"') q = true
    else if (c === ',') {
      out.push(cur)
      cur = ''
    } else cur += c
  }
  out.push(cur)
  return out.map((s) => s.trim())
}

const SOURCES = ['chat', 'voice', 'email', 'sms']

export function parseConversations(
  input: string
): { text: string; source: string }[] {
  const lines = input
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length === 0) return []

  const rows = lines.map(parseCSVLine)
  const header = rows[0].map((h) => h.toLowerCase())
  const looksLikeHeader = header.some((h) =>
    /message|conversation|transcript|text|content|body|utterance/.test(h)
  )

  let conversations: { text: string; source: string }[] = []

  if (looksLikeHeader && rows.length > 1) {
    const msgIdx = header.findIndex((h) =>
      /message|conversation|transcript|text|content|body|utterance/.test(h)
    )
    const chIdx = header.findIndex((h) => /channel|source|type/.test(h))
    conversations = rows
      .slice(1)
      .filter((r) => r[msgIdx])
      .map((r, i) => ({
        text: r[msgIdx],
        source:
          chIdx >= 0 && r[chIdx]
            ? r[chIdx].toLowerCase()
            : SOURCES[i % SOURCES.length],
      }))
  } else {
    // No header → each non-empty line (first cell) is its own conversation.
    conversations = rows
      .map((r) => r.find((cell) => cell.length > 0) ?? '')
      .filter((t) => t.length > 1)
      .map((text, i) => ({ text, source: SOURCES[i % SOURCES.length] }))
  }

  return conversations.slice(0, MAX_CONVERSATIONS)
}

/* ── Column mapping (product-style CSV import) ─────────────────────────────
   The demo's CSV uploader mirrors the in-product ingestion wizard: parse the
   raw table, let the user map columns, group rows into multi-turn
   conversations, and preview them as chat bubbles before running. ───────── */

export type DemoRole = 'user' | 'assistant'
export interface CsvTable {
  columns: string[]
  rows: string[][]
}
export interface CsvMapping {
  conversationCol: string
  roleCol: string
  messageCol: string
  channelCol: string
}
export interface MappedMessage {
  role: DemoRole
  content: string
}
export interface MappedConversation {
  messages: MappedMessage[]
  channel: string
}

const HEADER_HINT =
  /message|conversation|transcript|text|content|body|utterance|role|speaker|sender|channel|source/i
const CHANNELS = ['VOICE', 'CHAT', 'SMS', 'EMAIL']

/** Parse raw CSV/TSV text into a column/row table. Detects a header row; if
 *  none is present, synthesizes "column N" names so mapping still works. */
export function parseCsvTable(input: string): CsvTable {
  const lines = input
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length === 0) return { columns: [], rows: [] }
  const grid = lines.map(parseCSVLine)
  const width = Math.max(...grid.map((r) => r.length))
  const norm = grid.map((r) =>
    Array.from({ length: width }, (_, i) => r[i] ?? '')
  )
  const first = norm[0]
  const hasHeader = norm.length > 1 && first.some((c) => HEADER_HINT.test(c))
  if (hasHeader)
    return { columns: first.map((c) => c || '—'), rows: norm.slice(1) }
  return {
    columns: Array.from({ length: width }, (_, i) => `column ${i + 1}`),
    rows: norm,
  }
}

/** Best-effort auto-detection of which column is which, by header name. */
export function guessMapping(columns: string[]): CsvMapping {
  const find = (re: RegExp, exclude?: string) => {
    const hit = columns.find((c) => re.test(c) && c !== exclude)
    return hit ?? ''
  }
  const messageCol =
    find(/message|content|text|transcript|body|utterance/i) ||
    columns.find(
      (c) => !/id$|role|speaker|channel|source|date|time/i.test(c)
    ) ||
    columns[0] ||
    ''
  return {
    messageCol,
    conversationCol: find(
      /conversation|session|thread|ticket|case|chat.?id|\bid\b/i,
      messageCol
    ),
    roleCol: find(/role|speaker|sender|author|direction|from/i, messageCol),
    channelCol: find(/channel|source|medium|type/i, messageCol),
  }
}

/** Map a free-text role value to the binary role the pipeline understands. */
export function normalizeRole(v: string): DemoRole {
  return /agent|assistant|bot|support|\brep\b|system|admin|operator/i.test(
    v || ''
  )
    ? 'assistant'
    : 'user'
}

function normalizeChannel(v: string): string {
  const up = (v || '').trim().toUpperCase()
  return CHANNELS.includes(up) ? up : 'CHAT'
}

/** Group mapped rows into conversations. With a conversation column, rows that
 *  share an id become one multi-turn conversation (in row order). Without one,
 *  each row is its own single-message conversation. */
export function groupConversations(
  table: CsvTable,
  mapping: CsvMapping
): MappedConversation[] {
  const ci = (name: string) => table.columns.indexOf(name)
  const msgI = ci(mapping.messageCol)
  if (msgI < 0) return []
  const convI = ci(mapping.conversationCol)
  const roleI = ci(mapping.roleCol)
  const chI = ci(mapping.channelCol)

  const order: string[] = []
  const groups = new Map<string, MappedConversation>()

  table.rows.forEach((r, rowIdx) => {
    const content = (r[msgI] || '').trim()
    if (!content) return
    const key = convI >= 0 ? r[convI] || `row-${rowIdx}` : `row-${rowIdx}`
    if (!groups.has(key)) {
      order.push(key)
      groups.set(key, {
        messages: [],
        channel: chI >= 0 ? normalizeChannel(r[chI]) : 'CHAT',
      })
    }
    const g = groups.get(key)!
    if (g.messages.length < 20) {
      g.messages.push({
        role: roleI >= 0 ? normalizeRole(r[roleI]) : 'user',
        content,
      })
    }
  })

  return order
    .map((k) => groups.get(k)!)
    .filter((c) => c.messages.length > 0)
    .slice(0, MAX_CONVERSATIONS)
}

export function buildResults(input: string): ConversationResult[] {
  return parseConversations(input).map((c, i) => {
    const { masked } = maskPII(c.text)
    const facts = extractFacts(c.text)
    return {
      id: `cust_${(0xa7ce + i * 0x131).toString(16).slice(0, 4)}`,
      source: SOURCES.includes(c.source) ? c.source : 'chat',
      transcript: masked,
      facts,
      reply: composeReply(facts),
    }
  })
}

/* Sample dataset for the "load sample" affordance — realistic, varied. */
export const SAMPLE_CSV = `channel,message
chat,"Hey — my order #4471 still hasn't shipped and it's been a week. Pretty frustrated honestly."
voice,"Hi this is Maria, I'd like to renew our plan but want to add 5 seats next month."
email,"We decided to go with the annual contract. Send the invoice to billing@acme.co please."
sms,"The webhook integration keeps timing out, latency is over 3s. Can someone help?"
chat,"Loved the onboarding — smooth. Thinking about upgrading to the Scale tier in Q3 2026."`
