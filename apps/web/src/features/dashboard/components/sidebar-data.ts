import {
  BarChart3,
  Clock,
  CreditCard,
  Key,
  LayoutDashboard,
  Lightbulb,
  MessageSquare,
  Network,
  Settings,
  Shield,
  Upload,
  Users,
  Webhook,
} from 'lucide-react'

import type { LinkProps } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'

type NavItem = {
  title: string
  url: LinkProps['to']
  icon: LucideIcon
  badge?: string
}

type NavGroup = {
  title?: string
  items: NavItem[]
}

export type SidebarData = {
  navGroups: NavGroup[]
}

export const sidebarData: SidebarData = {
  navGroups: [
    {
      title: 'General',
      items: [
        { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
        { title: 'Customers', url: '/customers', icon: Users },
        { title: 'Conversations', url: '/conversations', icon: MessageSquare },
      ],
    },
    {
      title: 'Intelligence',
      items: [
        { title: 'Analytics', url: '/analytics', icon: BarChart3 },
        { title: 'Insights', url: '/insights', icon: Lightbulb },
        { title: 'Data Import', url: '/data-import', icon: Upload },
        { title: 'Entity Graph', url: '/graph', icon: Network },
      ],
    },
    {
      title: 'Developer',
      items: [
        { title: 'API Keys', url: '/api-keys', icon: Key },
        { title: 'Webhooks', url: '/webhooks', icon: Webhook },
      ],
    },
    {
      title: 'Account',
      items: [
        { title: 'Activity', url: '/activity', icon: Clock },
        { title: 'Team', url: '/team', icon: Shield },
        { title: 'Billing', url: '/billing', icon: CreditCard },
        { title: 'Settings', url: '/settings', icon: Settings },
      ],
    },
  ],
}
