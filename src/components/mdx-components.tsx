import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  HashIcon,
  InfoIcon,
  LightbulbIcon,
  OctagonAlertIcon,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'

import type React from 'react'

import { CodeBlock } from '@/components/mdx/code-block'
import { CodeTab, CodeTabs } from '@/components/mdx/code-tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

/**
 * Heading with an anchor affordance. The `id` is supplied by rehype-slug (see
 * vite.config), which is the same id the extracted table of contents links to.
 */
function Heading({
  as: Tag,
  id,
  children,
  ...props
}: {
  as: 'h2' | 'h3' | 'h4'
  id?: string
  children?: React.ReactNode
} & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <Tag id={id} className="group scroll-mt-24" {...props}>
      {children}
      {id && (
        <a
          href={`#${id}`}
          aria-label="Link to this section"
          className="ml-2 inline-flex align-middle text-hint no-underline opacity-0 transition group-hover:opacity-100 hover:text-foreground"
        >
          <HashIcon className="size-4" />
        </a>
      )}
    </Tag>
  )
}

const calloutConfig = {
  note:    { icon: InfoIcon,          label: 'Note'    },
  tip:     { icon: LightbulbIcon,     label: 'Tip'     },
  warning: { icon: AlertTriangleIcon, label: 'Warning' },
  danger:  { icon: OctagonAlertIcon,  label: 'Danger'  },
  success: { icon: CheckCircle2Icon,  label: 'Success' },
} as const

type CalloutType = keyof typeof calloutConfig

function Callout({
  type = 'note',
  title,
  children,
}: {
  type?: CalloutType | 'info' | 'error'
  title?: string
  children: React.ReactNode
}) {
  const key: CalloutType =
    type === 'info' ? 'note' : type === 'error' ? 'danger' : type
  const { icon: Icon, label } = calloutConfig[key]
  return (
    <Alert variant={key} className="my-6">
      <Icon className="size-5" />
      <AlertTitle>{title ?? label}</AlertTitle>
      <AlertDescription className="text-foreground/90 [&>p]:m-0 [&>p+p]:mt-2">
        {children}
      </AlertDescription>
    </Alert>
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
    <div className="my-6 overflow-x-auto rounded-lg border border-border">
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
  pre: CodeBlock,
  table: MdxTable,
  img: MdxImage,
  Callout,
  CodeTabs,
  CodeTab,
}
