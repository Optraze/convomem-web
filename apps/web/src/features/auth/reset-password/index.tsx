import { useId, useState } from 'react'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import type React from 'react'

import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { PasswordInput } from '@workspace/ui/components/password-input'

import { AuthHeader } from '@/features/auth/components/auth-copy.tsx'
import { AuthLayout } from '@/features/auth/components/auth-layout.tsx'
import { useResetPasswordMutation } from '@/features/auth/lib/hooks.ts'

export function ResetPasswordPage({ token }: { token?: string }) {
  const passwordId = useId()
  const confirmPasswordId = useId()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const resetPasswordMutation = useResetPasswordMutation({
    onSuccess: () => setSuccess(true),
  })

  const serverError =
    validationError ?? (resetPasswordMutation.error?.message || null)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setValidationError(null)

    if (!token) {
      setValidationError('Invalid reset link. Please request a new one.')
      return
    }

    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.')
      return
    }

    resetPasswordMutation.mutate({ token, password })
  }

  return (
    <AuthLayout
      eyebrow="Password reset"
      title="Set a new secure password."
      description="Choose a strong password to restore access to your ConvoMem account."
    >
      <div>
        <AuthHeader
          title={success ? 'Password reset' : 'Reset password'}
          description={
            success
              ? 'Your password has been updated. You can now sign in with your new password.'
              : 'Enter and confirm your new password below.'
          }
        />

        {success ? (
          <div className="grid gap-5 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50">
              <CheckCircle2 className="size-5" />
            </div>
            <Link
              to="/login"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-3 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/80"
            >
              Go to login
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="grid gap-4">
              {!token ? (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-amber-700 text-sm dark:text-amber-300">
                  No reset token found. Please use the link from your email.
                </div>
              ) : null}

              {serverError ? (
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-destructive text-sm">
                  {serverError}
                </div>
              ) : null}

              <div className="space-y-1.5">
                <Label
                  htmlFor={passwordId}
                  className="text-muted-foreground text-xs"
                >
                  New password
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

              <div className="space-y-1.5">
                <Label
                  htmlFor={confirmPasswordId}
                  className="text-muted-foreground text-xs"
                >
                  Confirm password
                </Label>
                <Input
                  id={confirmPasswordId}
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="h-10 rounded-xl px-3 text-sm"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={resetPasswordMutation.isPending}
                className="mt-2 h-10 w-full rounded-xl"
              >
                {resetPasswordMutation.isPending
                  ? 'Resetting…'
                  : 'Reset password'}
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
