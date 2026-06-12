import { createFileRoute, Link } from '@tanstack/react-router'

import { Button } from '@workspace/ui/components/button'

import { authApi, tokenStore } from '@/features/auth/lib/api.ts'
import { createPageMeta, getSeoUrl, SITE_NAME } from '@/lib/seo.ts'

export const Route = createFileRoute('/(app)/dashboard')({
  head: () => ({
    meta: createPageMeta({
      title: `Dashboard — ${SITE_NAME}`,
      description:
        'Manage your conversation memories, inspect stored context, and connect ConvoMem to your AI workflows.',
      path: '/dashboard',
    }),
    links: [{ rel: 'canonical', href: getSeoUrl('/dashboard') }],
  }),
  component: DashboardPage,
})

function DashboardPage() {
  const user = tokenStore.getUser()

  async function handleLogout() {
    await authApi.logout().catch(() => undefined)
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link to="/" className="font-semibold text-lg tracking-[-0.03em]">
            {SITE_NAME}
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground text-sm">
              {user?.email ?? 'user'}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="font-semibold text-2xl tracking-[-0.03em]">Dashboard</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Welcome back{user?.name ? `, ${user.name}` : ''}. This is your
          ConvoMem dashboard.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: 'Memories', value: '—' },
            { label: 'Conversations', value: '—' },
            { label: 'API calls (30d)', value: '—' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border p-5"
            >
              <p className="text-muted-foreground text-xs">{stat.label}</p>
              <p className="mt-1 font-semibold text-2xl">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-border p-8 text-center">
          <p className="text-muted-foreground text-sm">
            Coming soon — memory explorer, conversation viewer, and API
            playground.
          </p>
        </div>
      </main>
    </div>
  )
}
