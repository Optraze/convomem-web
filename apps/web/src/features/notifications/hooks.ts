import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { notificationsApi } from './api'

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.list({ limit: 10 }),
    staleTime: 30_000,
  })
}

export function useMarkAllRead() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useMarkOneRead() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
