import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { tokenStore } from '@/features/auth/lib/api'
import { onboardingApi, orgApi, userOrgsApi } from './api'

// ---------------------------------------------------------------------------
// Get user organizations
// ---------------------------------------------------------------------------

export function useUserOrgs() {
  return useQuery({
    queryKey: ['user-orgs'],
    queryFn: () => userOrgsApi.list(),
    staleTime: 30_000,
  })
}

// ---------------------------------------------------------------------------
// Get onboarding draft
// ---------------------------------------------------------------------------

export function useOnboardingDraft() {
  return useQuery({
    queryKey: ['onboarding-draft'],
    queryFn: () => onboardingApi.getDraft(),
    staleTime: Infinity,
    retry: false,
  })
}

// ---------------------------------------------------------------------------
// Save onboarding progress
// ---------------------------------------------------------------------------

export function useSaveOnboardingProgress() {
  return useMutation({
    mutationFn: (data: {
      step?: number
      profession?: string
      teamSize?: string
      primaryUseCase?: string
      timezone?: string
      strictPii?: boolean
    }) => onboardingApi.saveProgress(data),
  })
}

// ---------------------------------------------------------------------------
// Finalize onboarding
// ---------------------------------------------------------------------------

export function useFinalizeOnboarding(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      profession?: string
      teamSize?: string
      primaryUseCase?: string
      timezone?: string
      strictPii?: boolean
    }) => onboardingApi.finalize(data),
    onSuccess: (res) => {
      const current = tokenStore.getUser()
      if (current) {
        tokenStore.setUser({ ...current, ...res.user })
      }
      qc.setQueryData(['auth-user'], res.user)
      opts?.onSuccess?.()
    },
  })
}

// ---------------------------------------------------------------------------
// Create organization
// ---------------------------------------------------------------------------

export function useCreateOrg(opts?: { onSuccess?: (org: { id: string; name: string; slug: string }) => void }) {
  return useMutation({
    mutationFn: (data: { name: string; slug: string }) =>
      orgApi.create(data.name, data.slug),
    onSuccess: (res) => {
      opts?.onSuccess?.({ id: res.id, name: res.name, slug: res.slug })
    },
  })
}
