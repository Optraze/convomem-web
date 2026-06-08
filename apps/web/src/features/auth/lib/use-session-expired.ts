import { useCallback, useEffect, useState } from 'react'

import { isTokenExpired, tokenStore } from '@/features/auth/lib/api.ts'

/**
 * Monitors the access token and returns `true` when the session is expired.
 *
 * Checks:
 * 1. On mount — if the stored token is already expired.
 * 2. Every 30 seconds — catches tokens that expire while the tab is open.
 * 3. On `storage` event — catches logout from another tab.
 * 4. On `focus` event — catches expiry while the tab was backgrounded.
 */
export function useSessionExpired(): boolean {
  const [expired, setExpired] = useState(() => {
    const token = tokenStore.getAccessToken()
    return !token || isTokenExpired(token)
  })

  const check = useCallback(() => {
    const token = tokenStore.getAccessToken()
    if (!token || isTokenExpired(token)) {
      setExpired(true)
    }
  }, [])

  useEffect(() => {
    // Re-check when tab regains focus (token may have expired in background)
    window.addEventListener('focus', check)
    // Re-check when storage changes (logout from another tab)
    window.addEventListener('storage', check)

    const id = window.setInterval(check, 30_000)

    return () => {
      window.removeEventListener('focus', check)
      window.removeEventListener('storage', check)
      window.clearInterval(id)
    }
  }, [check])

  return expired
}
