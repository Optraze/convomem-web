import { useId, useState } from 'react'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import type React from 'react'

import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'

import { AuthHeader } from '@/features/auth/components/auth-copy.tsx'
import { AuthLayout } from '@/features/auth/components/auth-layout.tsx'
import { useForgotPasswordMutation } from '@/features/auth/lib/hooks.ts'

export function ForgotPasswordPage() {
  const emailId = useId()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const forgotPasswordMutation = useForgotPasswordMutation({
    onSuccess: () => setSent(true),
  })

  const errorMessage = forgotPasswordMutation.error?.message || null

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    forgotPasswordMutation.mutate({ email })
  }

  return (
    <AuthLayout
      eyebrow="Password recovery"
      title="Get back into your workspace."
      description="Enter your account email and we will send a secure password reset link if an account exists."
    >
      <div>
        <AuthHeader
          title={sent ? 'Check your email' : 'Forgot password?'}
          description={
            sent ? (
              <>
                If an account exists for <strong>{email}</strong>, we've sent a
                password reset link.
              </>
            ) : (
              'No worries, we\u2019ll send you a reset link.'
            )
          }
        />

        {sent ? (
          <div className="grid gap-5 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50">
              <CheckCircle2 className="size-5" />
            </div>
            <Link
              to="/login"
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border px-3 font-medium text-sm transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> Back to login
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="grid gap-4">
              {errorMessage ? (
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-destructive text-sm">
                  {errorMessage}
                </div>
              ) : null}

              <div className="space-y-1.5">
                <Label
                  htmlFor={emailId}
                  className="text-muted-foreground text-xs"
                >
                  Email
                </Label>
                <Input
                  id={emailId}
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-10 rounded-xl px-3 text-sm"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={forgotPasswordMutation.isPending}
                className="mt-2 h-10 w-full rounded-xl"
              >
                {forgotPasswordMutation.isPending
                  ? 'Sending…'
                  : 'Send reset link'}
              </Button>
            </form>

            <Link
              to="/login"
              className="mt-5 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl font-medium text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> Back to login
            </Link>
          </>
        )}
      </div>
    </AuthLayout>
  )
}
