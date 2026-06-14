/* ─────────────────────────────────────────────────────────────────────────
   Client-side memory extractor — a faithful, dependency-free mirror of the
   server capture pipeline's fact-extraction stage.

   This runs entirely in the browser so the landing-page demo never needs an
   API key, never hits a rate limit, and always works on whatever a visitor
   pastes or drops in. It is a heuristic — not the real LLM — but it produces
   the same record shape: { content, memoryType, sentiment, confidence,
   isSensitive, tags }. ──────────────────────────────────────────────────── */

/** Mirrors the Prisma enum used server-side. */
type MemoryType =
  | 'fact'
  | 'preference'
  | 'intent'
  | 'goal'
  | 'temporary'
  | 'decision'
  | 'context'
  | 'technical'

type Sentiment = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'

interface Fact {
  content: string
  memoryType: MemoryType
  sentiment: Sentiment
  confidence: number // 0..1
  isSensitive: boolean // PII detected → would be redacted at rest
  tags: string[]
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
