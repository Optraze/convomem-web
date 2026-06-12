import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'

import { useAuthSession } from '@/features/auth/lib/use-auth-session.ts'

export const Route = createFileRoute('/(auth)')({
  component: AuthLayoutGuard,
})

function AuthLayoutGuard() {
  const status = useAuthSession()

  if (status === 'checking') return null

  // Already logged in — redirect to dashboard
  if (status === 'authenticated') {
    return <Navigate to="/dashboard" />
  }

  return <Outlet />
}
