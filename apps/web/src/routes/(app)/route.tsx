import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'

import { useAuthSession } from '@/features/auth/lib/use-auth-session.ts'
import { useCurrentUser } from '@/features/auth/lib/use-current-user.ts'
import { useUserOrgs } from '@/features/onboarding/lib/hooks.ts'

export const Route = createFileRoute('/(app)')({
  component: AuthGuard,
})

function AuthGuard() {
  const status = useAuthSession()
  const user = useCurrentUser()
  const { data: orgsData, isLoading: orgsLoading } = useUserOrgs()

  if (status === 'checking') return null

  if (status === 'unauthenticated') {
    return <Navigate to="/login" />
  }

  // Still loading orgs — wait
  if (orgsLoading) return null

  // Not onboarded — go to onboarding
  if (!user?.onboardedAt) {
    return <Navigate to="/onboarding" />
  }

  // Onboarded but no orgs — go to onboarding to create one
  if (orgsData?.orgs?.length === 0) {
    return <Navigate to="/onboarding" />
  }

  // Has orgs — auto-select first if only one, then go to dashboard
  // (org selection UI can be added later for multiple orgs)
  return <Outlet />
}
