declare module 'virtual:reading-times' {
  import type { ContentType } from '@/lib/content'

  const readingTimes: Record<ContentType, Record<string, number>>
  export default readingTimes
}
