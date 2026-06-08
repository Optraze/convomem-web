import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'

import { tokenStore } from '@/features/auth/lib/api.ts'

export const Route = createFileRoute('/(app)')({
  component: AuthGuard,
})

function AuthGuard() {
  const token = tokenStore.getAccessToken()

  if (!token) {
    return <Navigate to="/login" />
  }

  return <Outlet />
}
