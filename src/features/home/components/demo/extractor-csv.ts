/* ─────────────────────────────────────────────────────────────────────────
   CSV / transcript parsing for the live demo. Accepts real CSVs (quoted
   fields, commas inside quotes) and raw pasted text. Detects a message-
   bearing column; otherwise treats each line as a conversation. The column-
   mapping helpers mirror the in-product ingestion wizard: parse the raw
   table, let the user map columns, group rows into multi-turn conversations,
   and preview them as chat bubbles before running. ───────────────────────── */

export const MAX_CONVERSATIONS = 5

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

/* ── Column mapping (product-style CSV import) ─────────────────────────── */

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
function normalizeRole(v: string): DemoRole {
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
    const g = groups.get(key)
    if (g && g.messages.length < 20) {
      g.messages.push({
        role: roleI >= 0 ? normalizeRole(r[roleI]) : 'user',
        content,
      })
    }
  })

  return order
    .map((k) => groups.get(k))
    .filter((g): g is MappedConversation => Boolean(g))
    .filter((c) => c.messages.length > 0)
    .slice(0, MAX_CONVERSATIONS)
}

/* Sample dataset for the "load sample" affordance — realistic, varied. */
export const SAMPLE_CSV = `channel,message
chat,"Hey — my order #4471 still hasn't shipped and it's been a week. Pretty frustrated honestly."
voice,"Hi this is Maria, I'd like to renew our plan but want to add 5 seats next month."
email,"We decided to go with the annual contract. Send the invoice to billing@acme.co please."
sms,"The webhook integration keeps timing out, latency is over 3s. Can someone help?"
chat,"Loved the onboarding — smooth. Thinking about upgrading to the Scale tier in Q3 2026."`
