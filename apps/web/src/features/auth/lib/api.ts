import { env } from '@/env'

const apiOrigin =
  env.VITE_API_URL ??
  (typeof process !== 'undefined' ? process.env.VITE_API_URL : undefined) ??
  'https://api.convomem.com'

const BASE = `${apiOrigin.replace(/\/$/, '')}/api/v1`

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AuthUser = {
  id: string
  email: string
  name: string | null
  plan: string
  onboardedAt?: string | null
}

export type AuthResponse = {
  user: AuthUser
  accessToken: string
}

export type AuthError = {
  status: number
  code: string
  message: string
  details?: { fieldErrors?: Record<string, string[]> }
}

// ---------------------------------------------------------------------------
// JWT helpers
// ---------------------------------------------------------------------------

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split('.')[1]
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json) as Record<string, unknown>
  } catch {
    return null
  }
}

/** Returns true if the JWT is expired (or invalid/unparseable). */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token)
  if (!payload || typeof payload.exp !== 'number') return true
  // 5-second buffer to avoid edge cases near expiry
  return Date.now() >= (payload.exp - 5) * 1000
}

// ---------------------------------------------------------------------------
// Token store — access token in localStorage, refresh token in HttpOnly cookie
// ---------------------------------------------------------------------------

export const tokenStore = {
  getAccessToken: () =>
    typeof window !== 'undefined'
      ? localStorage.getItem('cm_access_token')
      : null,

  setAccessToken: (token: string) => {
    localStorage.setItem('cm_access_token', token)
  },

  getUser: (): AuthUser | null => {
    try {
      const raw = localStorage.getItem('cm_user')
      return raw ? (JSON.parse(raw) as AuthUser) : null
    } catch {
      return null
    }
  },

  setUser: (user: AuthUser) => {
    localStorage.setItem('cm_user', JSON.stringify(user))
  },

  clear: () => {
    localStorage.removeItem('cm_access_token')
    localStorage.removeItem('cm_user')
  },
}

// ---------------------------------------------------------------------------
// Token refresh — deduplicated (concurrent requests share one refresh call)
// ---------------------------------------------------------------------------

let isRefreshing = false
let refreshWaiters: ((ok: boolean) => void)[] = []

async function tryRefresh(): Promise<boolean> {
  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshWaiters.push(resolve)
    })
  }

  isRefreshing = true
  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })

    if (!res.ok) {
      for (const fn of refreshWaiters) fn(false)
      return false
    }

    const data = (await res.json()) as AuthResponse
    tokenStore.setAccessToken(data.accessToken)
    tokenStore.setUser(data.user)
    for (const fn of refreshWaiters) fn(true)
    return true
  } catch {
    for (const fn of refreshWaiters) fn(false)
    return false
  } finally {
    isRefreshing = false
    refreshWaiters = []
  }
}

// ---------------------------------------------------------------------------
// Internal request helper (with 401 → refresh → retry)
// ---------------------------------------------------------------------------

async function request<T>(
  path: string,
  init?: RequestInit,
  _retry = true
): Promise<T> {
  const token = tokenStore.getAccessToken()

  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...((init?.headers as Record<string, string>) ?? {}),
    },
  })

  // On 401: try refresh once, then retry the request
  if (res.status === 401 && _retry) {
    const ok = await tryRefresh()
    if (ok) return request<T>(path, init, false)
    tokenStore.clear()
    throw { status: 401, code: 'UNAUTHORIZED', message: 'Session expired' }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const message: string = body.error ?? 'Request failed'
    throw {
      status: res.status,
      code: body.code ?? 'UNKNOWN',
      message,
      details: body.details,
    }
  }

  const text = await res.text()
  return (text ? JSON.parse(text) : {}) as T
}

// ---------------------------------------------------------------------------
// Auth API — endpoints not yet in the generated SDK
// ---------------------------------------------------------------------------

export const authApi = {
  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  forgotPassword: (email: string) =>
    request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) =>
    request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),

  refresh: () => request<AuthResponse>('/auth/refresh', { method: 'POST' }),

  logout: async () => {
    try {
      return await request<{ message: string }>('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({}),
      })
    } finally {
      tokenStore.clear()
    }
  },
}
