import { createFileRoute, Outlet } from '@tanstack/react-router'

import { SidebarProvider, SidebarInset } from '@workspace/ui/components/sidebar'

import { AppSidebar } from '@/features/dashboard/components/app-sidebar'

export const Route = createFileRoute('/(app)')({
  component: AppLayout,
})

function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
