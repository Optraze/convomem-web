import { Building2, ChevronsUpDown, LogOut, Plus } from 'lucide-react'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { Logo } from '@workspace/ui/components/logo'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@workspace/ui/components/sidebar'
import { TooltipProvider } from '@workspace/ui/components/tooltip'

import { authApi, tokenStore } from '@/features/auth/lib/api'
import { useUserOrgs } from '@/features/onboarding/lib/hooks'
import { SITE_NAME } from '@/lib/seo'

import { sidebarData } from './sidebar-data'

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { data: orgsData } = useUserOrgs()
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  const orgs = orgsData?.orgs ?? []
  const currentOrg = orgs[0]

  async function handleLogout() {
    await authApi.logout().catch(() => undefined)
    tokenStore.clear()
    navigate({ to: '/login' })
  }

  return (
    <TooltipProvider delay={0}>
      <Sidebar collapsible="icon">
        <SidebarHeader className="gap-3 p-2">
          <div
            className="relative flex items-center"
            style={{
              height: '48px',
              width: '100%',
              paddingLeft: isCollapsed ? 0 : 12,
              transition:
                'padding-left 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            <Link
              to="/"
              className="flex items-center justify-center"
              style={{
                height: '100%',
                width: isCollapsed ? '100%' : 'auto',
                minWidth: 28,
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            >
              <Logo className="size-7" />
            </Link>
            <span
              className="absolute"
              style={{
                marginLeft: 12,
                fontFamily: 'monospace',
                fontWeight: 600,
                fontSize: '13px',
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
                opacity: isCollapsed ? 0 : 1,
                visibility: isCollapsed ? 'hidden' : 'visible',
                transition: isCollapsed
                  ? 'opacity 0.15s ease-out, visibility 0s linear 0.15s, transform 0.15s ease-out'
                  : 'opacity 0.2s ease-in 0.1s, visibility 0s linear 0s, transform 0.2s ease-in 0.1s',
                pointerEvents: isCollapsed ? 'none' : 'auto',
                left: isCollapsed ? '50%' : '40px',
                top: '50%',
                transform: isCollapsed
                  ? 'translate(-50%, -50%) translateX(-8px) scale(0.95)'
                  : 'translateY(-50%) translateX(0) scale(1)',
                willChange: 'transform, opacity',
              }}
            >
              {SITE_NAME}
            </span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {sidebarData.navGroups.map((group) => (
            <SidebarGroup key={group.title ?? 'main'}>
              {group.title && (
                <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.url
                    return (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton
                          isActive={isActive}
                          tooltip={item.title}
                          render={<Link to={item.url} />}
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Building2 size={16} />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {currentOrg?.name ?? 'Select Org'}
                    </span>
                    <span className="truncate text-xs">
                      {currentOrg?.slug ?? 'enterprise'}
                    </span>
                  </div>
                  <ChevronsUpDown className="ms-auto size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 rounded-lg"
                  side="right"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuGroup>
                    {orgs.map((org) => (
                      <DropdownMenuItem
                        key={org.id}
                        onClick={() => navigate({ to: '/dashboard' })}
                      >
                        <div className="flex size-6 items-center justify-center rounded-sm border">
                          <Building2 size={12} />
                        </div>
                        {org.name}
                      </DropdownMenuItem>
                    ))}
                    {orgs.length === 0 && (
                      <DropdownMenuItem
                        onClick={() => navigate({ to: '/onboarding' })}
                      >
                        <Plus className="size-4" />
                        Create organization
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  )
}
