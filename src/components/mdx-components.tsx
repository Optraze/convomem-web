import { Link } from '@tanstack/react-router'

import type React from 'react'

function Heading({
  as: Tag,
  children,
  ...props
}: {
  as: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  children?: React.ReactNode
}) {
  const id = String(children)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return (
    <Tag id={id} {...props}>
      <a href={`#${id}`} className="no-underline hover:underline">
        {children}
      </a>
    </Tag>
  )
}

function Callout({
  type = 'info',
  children,
}: {
  type?: 'info' | 'warning' | 'error' | 'success'
  children: React.ReactNode
}) {
  const styles = {
    info: 'border-blue-500/30 bg-blue-500/5',
    warning: 'border-yellow-500/30 bg-yellow-500/5',
    error: 'border-destructive/30 bg-destructive/5',
    success: 'border-emerald-500/30 bg-emerald-500/5',
  }
  const labels = {
    info: 'Info',
    warning: 'Warning',
    error: 'Error',
    success: 'Success',
  }
  return (
    <div className={`my-6 rounded-lg border p-4 ${styles[type]}`} role="alert">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground">
        {labels[type]}
      </p>
      <div className="text-[14px] leading-7 text-muted-foreground [&>p]:m-0">
        {children}
      </div>
    </div>
  )
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground">
      {children}
    </code>
  )
}

function MdxLink({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href?.startsWith('/')) {
    return (
      <Link
        to={
          href as
            | '/'
            | '/contact'
            | '/privacy'
            | '/terms'
            | '/blog'
            | '/docs'
            | '/changelog'
        }
        {...props}
      >
        {children}
      </Link>
    )
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  )
}

function MdxTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-[14px]">{children}</table>
    </div>
  )
}

function MdxImage({
  src,
  alt,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <figure className="my-6">
      <img
        src={src}
        alt={alt ?? ''}
        className="rounded-lg border border-border"
        {...props}
      />
      {alt && (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
          {alt}
        </figcaption>
      )}
    </figure>
  )
}

export const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Heading as="h2" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Heading as="h3" {...props} />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Heading as="h4" {...props} />
  ),
  a: MdxLink,
  code: InlineCode,
  table: MdxTable,
  img: MdxImage,
  Callout,
}
