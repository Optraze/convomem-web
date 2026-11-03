import type { InsightsResult } from './use-demo-pipeline-types'

/** A live result is complete only after the server's explicit terminal event. */
export async function* readDemoStream(response: Response) {
  if (
    !response.body ||
    !response.headers.get('content-type')?.includes('text/event-stream')
  )
    throw new Error('Invalid demo response')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let terminal = false
  try {
    while (true) {
      const { done, value } = await reader.read()
      buffer += done
        ? decoder.decode()
        : decoder.decode(value, { stream: true })
      while (true) {
        const boundary = /\r?\n\r?\n/.exec(buffer)
        if (!boundary) break
        const frame = buffer.slice(0, boundary.index)
        buffer = buffer.slice(boundary.index + boundary[0].length)
        const lines = frame.split(/\r?\n/)
        const event = lines
          .find((line) => line.startsWith('event:'))
          ?.slice(6)
          .trim()
        const json = lines
          .filter((line) => line.startsWith('data:'))
          .map((line) => line.slice(5).trimStart())
          .join('\n')
        if (!event || !json) continue
        const data: unknown = JSON.parse(json)
        if (!data || typeof data !== 'object' || Array.isArray(data))
          throw new Error('Invalid demo event')
        terminal = event === 'done' || event === 'error'
        yield { event, data: data as Record<string, unknown> }
        if (terminal) return
      }
      if (done) break
    }
    if (!terminal) throw new Error('Demo stream interrupted')
  } finally {
    await reader.cancel().catch(() => {})
    reader.releaseLock()
  }
}

export function readInsights(data: Record<string, unknown>): InsightsResult {
  const tone = String(data.overallSentiment || '').toUpperCase()
  return {
    overallSentiment:
      tone === 'POSITIVE' || tone === 'NEGATIVE' ? tone : 'NEUTRAL',
    sentimentScore:
      typeof data.sentimentScore === 'number' &&
      Number.isFinite(data.sentimentScore)
        ? Math.max(-1, Math.min(1, data.sentimentScore))
        : 0,
    insights: Array.isArray(data.insights)
      ? data.insights
          .filter(
            (item) =>
              item &&
              typeof item.type === 'string' &&
              typeof item.summary === 'string'
          )
          .slice(0, 5)
      : [],
    summary: typeof data.summary === 'string' ? data.summary : '',
  }
}
