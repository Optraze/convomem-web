import { Link } from '@tanstack/react-router'

type AuthHeaderProps = {
  title: string
  description: React.ReactNode
}

export function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="font-semibold text-xl tracking-[-0.025em] text-foreground">
        {title}
      </h2>
      <div className="mt-1.5 text-muted-foreground text-sm leading-6">
        {description}
      </div>
    </div>
  )
}

export function LegalAgreement({
  action,
}: {
  action: 'signing in' | 'creating an account'
}) {
  return (
    <p>
      By {action}, you agree to our{' '}
      <Link
        to="/terms"
        className="underline underline-offset-4 hover:text-primary"
      >
        Terms
      </Link>{' '}
      and{' '}
      <Link
        to="/privacy"
        className="underline underline-offset-4 hover:text-primary"
      >
        Privacy Policy
      </Link>
      .
    </p>
  )
}
