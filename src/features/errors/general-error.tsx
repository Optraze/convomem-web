import { Link, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

export function GeneralError({ error }: { error: Error }) {
  const router = useRouter()

  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <p className="font-mono text-[11px] tracking-[0.2em] text-hint/80 uppercase">
        500
      </p>
      <h1 className="mt-4 text-[clamp(28px,5vw,44px)] font-semibold tracking-[-0.03em] text-foreground">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-[15px] leading-7 text-muted-foreground">
        An unexpected error occurred. Please try again.
      </p>
      <div className="mt-8 flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.invalidate()}
          className="inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-2.5 font-medium text-[13px] text-background transition-opacity hover:opacity-90"
        >
          Try again
        </button>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 font-medium text-[13px] text-foreground transition-colors hover:bg-muted"
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
