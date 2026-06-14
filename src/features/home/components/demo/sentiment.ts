import type { DemoFact } from './use-demo-pipeline'

export const SENT: Record<
  DemoFact['sentiment'],
  { mark: string; label: string }
> = {
  POSITIVE: { mark: '+', label: 'positive' },
  NEGATIVE: { mark: '−', label: 'negative' },
  NEUTRAL: { mark: '·', label: 'neutral' },
}
