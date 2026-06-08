import { useId, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'

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

export function SignupPage() {
  const nameId = useId()
  const emailId = useId()
  const passwordId = useId()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    window.setTimeout(() => setLoading(false), 700)
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
          <AuthField id={nameId} label="Full name">
            <AuthInput
              id={nameId}
              name="name"
              placeholder="Alex Rivera"
              autoComplete="name"
              required
            />
          </AuthField>

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

          <AuthField id={passwordId} label="Password">
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
          </AuthField>

          <AuthSubmitButton loading={loading}>
            Create account <ArrowRight data-icon="inline-end" />
          </AuthSubmitButton>
        </form>

        <div className="mt-6 text-center text-muted-foreground text-xs leading-5">
          <LegalAgreement action="creating an account" />
        </div>
      </div>
    </AuthLayout>
  )
}
