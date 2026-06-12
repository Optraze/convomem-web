import { useEffect, useState } from "react"
import { Bell, CreditCard, LogOut, Settings, Shield } from "lucide-react"
import { Link } from "@tanstack/react-router"

import type React from "react"

import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Separator } from "@workspace/ui/components/separator"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"
import { cn } from "@workspace/ui/lib/utils"

import { authApi, tokenStore } from "@/features/auth/lib/api"
import { useCurrentUser } from "@/features/auth/lib/use-current-user"
import {
  useMarkAllRead,
  useMarkOneRead,
  useNotifications,
} from "@/features/notifications/hooks"

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
}

function formatRelativeTime(dateStr: string): string {
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days === 1) return "yesterday"
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function Header({ className, fixed, children, ...props }: HeaderProps) {
  const [offset, setOffset] = useState(0)
  const user = useCurrentUser()
  const { data: notifData, isLoading: loadingNotifs } = useNotifications()
  const markAllRead = useMarkAllRead()
  const markOneRead = useMarkOneRead()

  const notifications = notifData?.notifications ?? []
  const unreadCount = notifData?.unreadCount ?? 0

  const initials = user?.name
    ? user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : (user?.email?.slice(0, 2).toUpperCase() ?? "U")

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    document.addEventListener("scroll", onScroll, { passive: true })
    return () => document.removeEventListener("scroll", onScroll)
  }, [])

  async function handleLogout() {
    await authApi.logout().catch(() => undefined)
    tokenStore.clear()
    window.location.href = "/login"
  }

  return (
    <header
      className={cn(
        "z-50 h-16",
        fixed && "header-fixed peer/header sticky top-0 w-[inherit]",
        offset > 10 && fixed ? "shadow" : "shadow-none",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "relative flex h-full items-center gap-3 p-4 sm:gap-4",
          offset > 10 &&
          fixed &&
          "after:absolute after:inset-0 after:-z-10 after:bg-background/20 after:backdrop-blur-lg",
        )}
      >
        <SidebarTrigger variant="outline" className="max-md:scale-125" />
        <Separator orientation="vertical" className="h-6" />
        <div className="flex-1">{children}</div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="relative flex size-8 items-center justify-center rounded-full outline-none hover:bg-accent">
              <Bell size={16} className="text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 size-2 rounded-full bg-primary" />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-80 rounded-lg"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="flex items-center justify-between p-3 font-normal">
                  <span className="text-sm font-medium">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllRead.mutate()}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Mark all read
                    </button>
                  )}
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                {loadingNotifs ? (
                  <div className="p-4 text-center">
                    <div
                      className="mx-auto size-4 animate-spin rounded-full border-2 border-border border-t-foreground" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground text-xs">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "cursor-pointer px-3 py-3 transition-colors hover:bg-accent",
                        !n.read && "bg-accent/50",
                      )}
                      onClick={() => {
                        if (!n.read) markOneRead.mutate(n.id)
                      }}
                    >
                      <div className="flex items-start gap-2">
                        {!n.read && (
                          <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                        )}
                        <div className={n.read ? "pl-3" : ""}>
                          <p className="text-sm font-medium">{n.title}</p>
                          {n.body && (
                            <p className="mt-0.5 text-muted-foreground text-xs">
                              {n.body}
                            </p>
                          )}
                          <p className="mt-1 text-muted-foreground text-[10px]">
                            {formatRelativeTime(n.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex size-8 items-center justify-center rounded-full outline-none hover:bg-accent">
              <Avatar className="size-8 rounded-full">
                <AvatarFallback className="rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 rounded-lg"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="size-8 rounded-full">
                      <AvatarFallback className="rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.name ?? "User"}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user?.email ?? ""}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem render={<Link to="/settings" />}>
                  <Settings />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link to="/billing" />}>
                  <CreditCard />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link to="/team" />}>
                  <Shield />
                  Team
                </DropdownMenuItem>
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
        </div>
      </div>
    </header>
  )
}
