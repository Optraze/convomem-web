import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)')({
  component: AuthLayoutRoute,
})

function AuthLayoutRoute() {
  return <Outlet />
}
