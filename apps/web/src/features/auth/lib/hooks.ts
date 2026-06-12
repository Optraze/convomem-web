import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { AuthUser } from './api'
import { authApi, tokenStore } from './api'

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------

export function useLoginMutation(opts?: { onSuccess?: (res: { user: AuthUser; accessToken: string }) => void }) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const res = await authApi.login(input.email, input.password)
      tokenStore.setAccessToken(res.accessToken)
      tokenStore.setUser(res.user)
      return res
    },
    onSuccess: (res) => {
      qc.setQueryData(['auth-user'], res.user)
      opts?.onSuccess?.(res)
    },
  })
}

// ---------------------------------------------------------------------------
// Sign-up
// ---------------------------------------------------------------------------

export function useSignupMutation(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: {
      name: string
      email: string
      password: string
    }) => {
      const res = await authApi.register(
        input.name,
        input.email,
        input.password
      )
      tokenStore.setAccessToken(res.accessToken)
      tokenStore.setUser(res.user)
      return res
    },
    onSuccess: (res) => {
      qc.setQueryData(['auth-user'], res.user)
      opts?.onSuccess?.()
    },
  })
}

// ---------------------------------------------------------------------------
// Forgot password
// ---------------------------------------------------------------------------

export function useForgotPasswordMutation(opts?: { onSuccess?: () => void }) {
  return useMutation({
    mutationFn: (input: { email: string }) =>
      authApi.forgotPassword(input.email),
    onSuccess: () => opts?.onSuccess?.(),
  })
}

// ---------------------------------------------------------------------------
// Reset password
// ---------------------------------------------------------------------------

export function useResetPasswordMutation(opts?: { onSuccess?: () => void }) {
  return useMutation({
    mutationFn: (input: { token: string; password: string }) =>
      authApi.resetPassword(input.token, input.password),
    onSuccess: () => opts?.onSuccess?.(),
  })
}

// ---------------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------------

export function useLogoutMutation(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await authApi.logout()
    },
    onSuccess: () => {
      qc.clear()
      opts?.onSuccess?.()
    },
  })
}
