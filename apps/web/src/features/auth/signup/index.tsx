import { useId, useState } from 'react'
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
import { useSignupMutation } from '@/features/auth/lib/hooks.ts'

export function SignupPage() {
  const navigate = useNavigate()
  const nameId = useId()
  const emailId = useId()
  const passwordId = useId()
  const [password, setPassword] = useState('')
  const signupMutation = useSignupMutation({
    onSuccess: () => navigate({ to: '/dashboard' }),
  })

  const errorMessage = signupMutation.error?.message || null

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    signupMutation.mutate({
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      password: String(form.get('password') ?? ''),
    })
  }

  return (
    <AuthLayout
      eyebrow="Start free"
      title="Build context-aware AI from day one."
      description="Create a ConvoMem account to capture customer memories and reuse them across every conversation."
    >
      <div>
        <AuthHeader
          title="Create account"
          description={
            <>
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
              >
                Sign in
              </Link>
              .
            </>
          }
        />

        <form onSubmit={handleSubmit} className="grid gap-4">
          {errorMessage ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-destructive text-sm">
              {errorMessage}
            </div>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor={nameId} className="text-muted-foreground text-xs">
              Full name
            </Label>
            <Input
              id={nameId}
              name="name"
              placeholder="Alex Rivera"
              autoComplete="name"
              className="h-10 rounded-xl px-3 text-sm"
              required
            />
          </div>

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
            <Label
              htmlFor={passwordId}
              className="text-muted-foreground text-xs"
            >
              Password
            </Label>
            <PasswordInput
              id={passwordId}
              name="password"
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-10 rounded-xl px-3 text-sm"
              showStrength
              required
            />
          </div>

          <Button
            type="submit"
            disabled={signupMutation.isPending}
            className="mt-2 h-10 w-full rounded-xl"
          >
            {signupMutation.isPending ? (
              'Creating account…'
            ) : (
              <span className="inline-flex items-center gap-1.5">
                Create account <ArrowRight className="size-4" />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-muted-foreground text-xs leading-5">
          <LegalAgreement action="creating an account" />
        </div>
      </div>
    </AuthLayout>
  )
}
