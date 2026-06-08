import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'

import { SessionExpiredDialog } from '@/features/auth/components/session-expired-dialog.tsx'
import { tokenStore } from '@/features/auth/lib/api.ts'
import { useSessionExpired } from '@/features/auth/lib/use-session-expired.ts'

export const Route = createFileRoute('/(app)')({
  component: AuthGuard,
})

function AuthGuard() {
  const token = tokenStore.getAccessToken()
  const expired = useSessionExpired()

  // No token at all — redirect to login immediately
  if (!token) {
    return <Navigate to="/login" />
  }

  return (
    <>
      <Outlet />
      <SessionExpiredDialog open={expired} />
    </>
  )
}
