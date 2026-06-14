import type {
  Convo,
  ConvState,
  InsightsResult,
  StageEvent,
} from './use-demo-pipeline-types'

import { extractFacts } from './extractor'

/* Collapse a conversation's turns into one text blob for the local heuristic. */
export const convText = (c: Convo): string =>
  c.messages?.length
    ? c.messages.map((m) => m.content).join('\n')
    : (c.message ?? '')

/* Build a heuristic insights object from a set of extracted facts. */
export function heuristicInsights(
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
export function localFallback(conversations: Convo[]): {
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
