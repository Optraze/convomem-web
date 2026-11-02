import { useCallback, useSyncExternalStore } from 'react'

const getServerSnapshot = () => false

export function useCompactViewport(maxWidth = 700) {
  const query = `(max-width: ${maxWidth}px)`
  const subscribe = useCallback(
    (listener: () => void) => {
      const media = window.matchMedia(query)
      media.addEventListener('change', listener)
      return () => media.removeEventListener('change', listener)
    },
    [query]
  )
  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query]
  )
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
