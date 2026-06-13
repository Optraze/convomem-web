import { Link } from '@tanstack/react-router'

export function NotFoundError() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <p className="font-mono text-[11px] tracking-[0.2em] text-hint/80 uppercase">
        404
      </p>
      <h1 className="mt-4 text-[clamp(28px,5vw,44px)] font-semibold tracking-[-0.03em] text-foreground">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-[15px] leading-7 text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-2.5 font-medium text-[13px] text-background transition-opacity hover:opacity-90"
      >
        Back to home
      </Link>
    </main>
  )
}
