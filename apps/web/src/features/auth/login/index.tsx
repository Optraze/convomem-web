import { useId } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'

import type React from 'react'

import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { PasswordInput } from '@workspace/ui/components/password-input'

import {
  AuthHeader,
  LegalAgreement,
} from '@/features/auth/components/auth-copy.tsx'
import { AuthLayout } from '@/features/auth/components/auth-layout.tsx'
import { useLoginMutation } from '@/features/auth/lib/hooks.ts'

export function LoginPage() {
  const navigate = useNavigate()
  const emailId = useId()
  const passwordId = useId()
  const loginMutation = useLoginMutation({
    onSuccess: () => navigate({ to: '/onboarding' }),
  })

  const errorMessage = loginMutation.error?.message || null

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    loginMutation.mutate({
      email: String(form.get('email') ?? ''),
      password: String(form.get('password') ?? ''),
    })
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Access your conversation memory."
      description="Sign in to manage memories, inspect stored context, and connect ConvoMem to your AI workflows."
    >
      <div>
        <AuthHeader
          title="Sign in"
          description="Enter your credentials to continue."
        />

        <form onSubmit={handleSubmit} className="grid gap-4">
          {errorMessage ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-destructive text-sm">
              {errorMessage}
            </div>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor={emailId} className="text-muted-foreground text-xs">
              Email
            </Label>
            <Input
              id={emailId}
              type="email"
              name="email"
              placeholder="name@example.com"
              autoComplete="email"
              className="h-10 rounded-xl px-3 text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-3">
              <Label
                htmlFor={passwordId}
                className="text-muted-foreground text-xs"
              >
                Password
              </Label>
              <Link
                to="/forgot-password"
                className="font-medium text-muted-foreground text-xs transition-colors hover:text-foreground"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id={passwordId}
              name="password"
              placeholder="••••••••"
              autoComplete="current-password"
              className="h-10 rounded-xl px-3 text-sm"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="mt-2 h-10 w-full rounded-xl"
          >
            {loginMutation.isPending ? (
              'Signing in…'
            ) : (
              <span className="inline-flex items-center gap-1.5">
                Sign in <ArrowRight className="size-4" />
              </span>
            )}
          </Button>
        </form>

        <p className="mt-5 text-center text-muted-foreground text-sm">
          New to ConvoMem?{' '}
          <Link
            to="/signup"
            className="font-medium text-foreground transition-colors hover:text-muted-foreground"
          >
            Create an account
          </Link>
        </p>

        <div className="mt-6 text-center text-muted-foreground text-xs leading-5">
          <LegalAgreement action="signing in" />
        </div>
      </div>
    </AuthLayout>
  )
}
