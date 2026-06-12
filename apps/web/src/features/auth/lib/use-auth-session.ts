import { useEffect, useState } from 'react'

import { refreshSession, tokenStore } from './api'

type AuthSessionStatus = 'authenticated' | 'checking' | 'unauthenticated'

export function useAuthSession(): AuthSessionStatus {
  const [status, setStatus] = useState<AuthSessionStatus>(() =>
    tokenStore.getAccessToken() ? 'authenticated' : 'checking'
  )

  useEffect(() => {
    let cancelled = false

    async function syncSession() {
      if (tokenStore.getAccessToken()) {
        setStatus('authenticated')
        return
      }

      const session = await refreshSession()
      if (cancelled) return

      setStatus(session ? 'authenticated' : 'unauthenticated')
    }

    syncSession()

    function handleAuthChange() {
      setStatus(
        tokenStore.getAccessToken() ? 'authenticated' : 'unauthenticated'
      )
    }

    window.addEventListener('auth-change', handleAuthChange)
    window.addEventListener('storage', handleAuthChange)

    return () => {
      cancelled = true
      window.removeEventListener('auth-change', handleAuthChange)
      window.removeEventListener('storage', handleAuthChange)
    }
  }, [])

  return status
}
