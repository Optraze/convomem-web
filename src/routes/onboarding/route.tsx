import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'

import { useAuthSession } from '@/features/auth/lib/use-auth-session'

export const Route = createFileRoute('/onboarding')({
  component: OnboardingGuard,
})

function OnboardingGuard() {
  const status = useAuthSession()

  if (status === 'checking') return null

  if (status === 'unauthenticated') {
    return <Navigate to="/login" />
  }

  return <Outlet />
}
