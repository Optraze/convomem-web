import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'

import { tokenStore } from '@/features/auth/lib/api.ts'

export const Route = createFileRoute('/(auth)')({
  component: AuthLayoutGuard,
})

function AuthLayoutGuard() {
  // Already logged in — redirect to dashboard
  if (tokenStore.getAccessToken()) {
    return <Navigate to="/dashboard" />
  }

  return <Outlet />
}
