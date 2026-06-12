import { tokenStore, refreshSession } from '@/features/auth/lib/api'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Notification = {
  id: string
  userId: string
  orgId: string | null
  type: string
  title: string
  body: string
  link: string | null
  read: boolean
  createdAt: string
}

export type NotificationsResponse = {
  notifications: Notification[]
  total: number
  unreadCount: number
  page: number
  limit: number
}

// ---------------------------------------------------------------------------
// API base
// ---------------------------------------------------------------------------

const apiOrigin =
  (typeof process !== 'undefined' ? process.env.VITE_API_URL : undefined) ??
  'https://api.convomem.com'

const BASE = `${apiOrigin.replace(/\/$/, '')}/api/v1`

// ---------------------------------------------------------------------------
// Request helper (with 401 refresh)
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
// Notifications API
// ---------------------------------------------------------------------------

export const notificationsApi = {
  list: (params?: { unreadOnly?: boolean; limit?: number; page?: number }) => {
    const q = new URLSearchParams()
    if (params?.unreadOnly) q.set('unreadOnly', 'true')
    if (params?.limit) q.set('limit', String(params.limit))
    if (params?.page) q.set('page', String(params.page))
    return request<NotificationsResponse>(
      `/notifications${q.toString() ? `?${q}` : ''}`,
      { method: 'GET' }
    )
  },

  markRead: (id: string) =>
    request<{ message: string }>(`/notifications/${id}/read`, {
      method: 'PATCH',
      body: JSON.stringify({}),
    }),

  markAllRead: () =>
    request<{ message: string }>('/notifications/read-all', {
      method: 'POST',
      body: JSON.stringify({}),
    }),
}
