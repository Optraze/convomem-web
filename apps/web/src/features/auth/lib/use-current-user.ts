import { useEffect, useRef, useState } from 'react'

import type { AuthUser } from './api'

import { tokenStore } from './api'

/**
 * Returns the currently logged-in user, or null.
 * Reactively updates on login/logout via storage + custom auth-change events.
 * Uses JSON comparison to avoid infinite re-renders from new object references.
 */
export function useCurrentUser() {
  const [user, setUser] = useState<AuthUser | null>(() => tokenStore.getUser())
  const lastJson = useRef<string | null>(JSON.stringify(user))

  useEffect(() => {
    const handleChange = () => {
      const next = tokenStore.getUser()
      const nextJson = JSON.stringify(next)
      if (nextJson !== lastJson.current) {
        lastJson.current = nextJson
        setUser(next)
      }
    }

    window.addEventListener('storage', handleChange)
    window.addEventListener('auth-change', handleChange)
    return () => {
      window.removeEventListener('storage', handleChange)
      window.removeEventListener('auth-change', handleChange)
    }
  }, [])

  return user
}
