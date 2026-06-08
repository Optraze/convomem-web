import { useId, useState } from 'react'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import { AuthHeader } from '@/features/auth/components/auth-copy.tsx'
import {
  AuthField,
  AuthInput,
  AuthSubmitButton,
} from '@/features/auth/components/auth-form-fields.tsx'
import { AuthLayout } from '@/features/auth/components/auth-layout.tsx'

export function ForgotPasswordPage() {
  const emailId = useId()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    window.setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 700)
  }

  return (
    <AuthLayout
      eyebrow="Password recovery"
      title="Get back into your workspace."
      description="Enter your account email and we’ll send a secure password reset link if an account exists."
    >
      <div>
        <AuthHeader
          title={sent ? 'Check your email' : 'Forgot password?'}
          description={
            sent ? (
              <>
                If an account exists for <strong>{email}</strong>, we’ve sent a
                password reset link.
              </>
            ) : (
              'No worries, we’ll send you a reset link.'
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
              <AuthField id={emailId} label="Email">
                <AuthInput
                  id={emailId}
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </AuthField>

              <AuthSubmitButton loading={loading}>
                Send reset link
              </AuthSubmitButton>
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
