import { useId, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import type React from 'react'

import { PasswordInput } from '@workspace/ui/components/password-input'

import {
  AuthHeader,
  LegalAgreement,
} from '@/features/auth/components/auth-copy.tsx'
import {
  AuthField,
  AuthInput,
  AuthSubmitButton,
} from '@/features/auth/components/auth-form-fields.tsx'
import { AuthLayout } from '@/features/auth/components/auth-layout.tsx'

export function LoginPage() {
  const emailId = useId()
  const passwordId = useId()
  const [loading, setLoading] = useState(false)

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    window.setTimeout(() => setLoading(false), 700)
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
          <AuthField id={emailId} label="Email">
            <AuthInput
              id={emailId}
              type="email"
              name="email"
              placeholder="name@example.com"
              autoComplete="email"
              required
            />
          </AuthField>

          <AuthField
            id={passwordId}
            label="Password"
            action={
              <Link
                to="/forgot-password"
                className="font-medium text-muted-foreground text-xs transition-colors hover:text-foreground"
              >
                Forgot password?
              </Link>
            }
          >
            <PasswordInput
              id={passwordId}
              name="password"
              placeholder="••••••••"
              autoComplete="current-password"
              className="h-10 rounded-xl px-3 text-sm"
              required
            />
          </AuthField>

          <AuthSubmitButton loading={loading}>
            Sign in <ArrowRight data-icon="inline-end" />
          </AuthSubmitButton>
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
