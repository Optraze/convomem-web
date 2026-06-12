import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'

import { useAuthSession } from '@/features/auth/lib/use-auth-session.ts'

export const Route = createFileRoute('/(app)')({
  component: AuthGuard,
})

function AuthGuard() {
  const status = useAuthSession()

  if (status === 'checking') return null

  if (status === 'unauthenticated') {
    return <Navigate to="/login" />
  }

  return <Outlet />
}
