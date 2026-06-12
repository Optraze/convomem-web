import { createFileRoute, Outlet } from '@tanstack/react-router'

import { SidebarInset, SidebarProvider } from '@workspace/ui/components/sidebar'

import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { AppSidebar } from '@/features/dashboard/components/app-sidebar'

export const Route = createFileRoute('/(app)')({
  component: AppLayout,
})

function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header>
          <div className="flex-1" />
        </Header>
        <Main>
          <Outlet />
        </Main>
      </SidebarInset>
    </SidebarProvider>
  )
}
