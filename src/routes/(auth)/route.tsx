import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'

import { useAuthSession } from '@/features/auth/lib/use-auth-session'

export const Route = createFileRoute('/(auth)')({
  component: AuthLayoutGuard,
})

function AuthLayoutGuard() {
  const status = useAuthSession()

  if (status === 'checking') return null

  if (status === 'authenticated') {
    return <Navigate to="/onboarding" />
  }

  return <Outlet />
}
