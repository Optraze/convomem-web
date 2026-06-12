import { tokenStore, refreshSession } from '@/features/auth/lib/api'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type OnboardingDraft = {
  onboardedAt: string | null
  step: number
  profession: string
  teamSize: string
  primaryUseCase: string
  timezone: string
  strictPii: boolean
}

export type OrgResponse = {
  id: string
  name: string
  slug: string
  plan: string
  createdAt: string
}

export type OnboardingFinalizeResponse = {
  user: {
    id: string
    email: string
    name: string | null
    plan: string
    onboardedAt: string
  }
}

export type UserOrg = {
  id: string
  name: string
  slug: string
  plan: string
  role: string
}

// ---------------------------------------------------------------------------
// Internal request helper (with 401 → refresh → retry)
// ---------------------------------------------------------------------------

const apiOrigin =
  (typeof process !== 'undefined' ? process.env.VITE_API_URL : undefined) ??
  'https://api.convomem.com'

const BASE = `${apiOrigin.replace(/\/$/, '')}/api/v1`

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

  if (res.status === 401 && _retry) {
    const refreshed = await refreshSession()
    if (refreshed) return request<T>(path, init, false)
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
// Onboarding API
// ---------------------------------------------------------------------------

export const onboardingApi = {
  getDraft: () =>
    request<OnboardingDraft>('/user/onboarding', { method: 'GET' }),

  saveProgress: (data: {
    step?: number
    profession?: string
    teamSize?: string
    primaryUseCase?: string
    timezone?: string
    strictPii?: boolean
  }) =>
    request<{ ok: boolean; step: number | null }>('/user/onboarding', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  finalize: (data: {
    profession?: string
    teamSize?: string
    primaryUseCase?: string
    timezone?: string
    strictPii?: boolean
  }) =>
    request<OnboardingFinalizeResponse>('/user/onboarding', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// ---------------------------------------------------------------------------
// User Orgs API
// ---------------------------------------------------------------------------

export const userOrgsApi = {
  list: () => request<{ orgs: UserOrg[] }>('/user/orgs', { method: 'GET' }),
}

// ---------------------------------------------------------------------------
// Org API
// ---------------------------------------------------------------------------

export const orgApi = {
  create: (name: string, slug: string) =>
    request<OrgResponse>('/orgs', {
      method: 'POST',
      body: JSON.stringify({ name, slug }),
    }),
}
