import { useState } from 'react'
import {
  Building2,
  CheckCircle2,
  ListFilter,
  Mail,
  MessageCircle,
  Send,
  User,
} from 'lucide-react'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { MarketingNavbar } from '@/features/marketing/components/navbar.tsx'
import { createPageMeta, getSeoUrl, SITE_NAME } from '@/lib/seo.ts'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://api.convomem.com'

const inquiryTypes = ['sales', 'support', 'partnership', 'other'] as const

const nameSchema = z.string().trim().min(1, 'Enter your full name.')
const emailSchema = z.email('Enter a valid email address.')
const companySchema = z.string()
const inquiryTypeSchema = z.enum(inquiryTypes)
const messageSchema = z
  .string()
  .trim()
  .min(10, 'Tell us a little more so we can help.')
  .max(2000, 'Keep your message under 2000 characters.')

const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  company: companySchema,
  inquiryType: inquiryTypeSchema,
  message: messageSchema,
})

type ContactFormValues = z.input<typeof contactFormSchema>
type InquiryType = ContactFormValues['inquiryType']

const defaultValues: ContactFormValues = {
  name: '',
  email: '',
  company: '',
  inquiryType: 'sales',
  message: '',
}

export const Route = createFileRoute('/contact')({
  head: () => ({
    meta: createPageMeta({
      title: `Contact us — ${SITE_NAME}`,
      description:
        'Contact ConvoMem for pricing, support, partnerships, or enterprise deployment questions.',
      path: '/contact',
    }),
    links: [{ rel: 'canonical', href: getSeoUrl('/contact') }],
  }),
  component: ContactPage,
})

function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: contactFormSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null)
      const res = await fetch(`${BASE_URL}/api/v1/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: value.name,
          email: value.email,
          company: value.company,
          type: value.inquiryType,
          message: value.message,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.')
      }
      setSubmitted(true)
    },
  })

  if (submitted) {
    return (
      <main className="min-h-screen bg-background text-foreground antialiased">
        <MarketingNavbar />
        <section className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center px-5 pt-28 text-center sm:px-8">
          <CheckCircle2 className="mb-6 size-12 text-emerald-400" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Message sent
          </h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            We&apos;ll get back to you as soon as possible. If your inquiry is
            urgent, email us directly at{' '}
            <a
              href="mailto:support@convomem.com"
              className="text-emerald-400 transition-colors hover:text-emerald-300"
            >
              support@convomem.com
            </a>
          </p>
          <Button
            variant="outline"
            className="mt-8"
            onClick={() => {
              setSubmitted(false)
              form.reset()
            }}
          >
            Send another message
          </Button>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground antialiased">
      <MarketingNavbar />

      <section className="mx-auto grid w-full max-w-5xl gap-12 px-5 pt-28 pb-14 sm:px-8 sm:pt-32 sm:pb-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
        <div className="lg:sticky lg:top-24">
          <div className="mb-7 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] text-hint/70 uppercase">
            <Mail className="size-3.5 text-emerald-400" />
            Get in touch
          </div>
          <h1 className="max-w-xl text-balance text-[clamp(36px,8vw,86px)] leading-[0.92] font-semibold tracking-[-0.06em]">
            Contact us
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-7 text-muted-foreground">
            Have a question about pricing, need technical support, or want to
            explore a partnership? Tell us what you need and we’ll route it to
            the right team.
          </p>
        </div>

        <form
          className="w-full"
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <FieldGroup>
            {submitError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {submitError}
              </div>
            )}
            <form.Field
              name="name"
              validators={{
                onBlur: nameSchema,
              }}
            >
              {(field) => {
                const error = getFieldError(field.state.meta)

                return (
                  <Field data-invalid={Boolean(error)}>
                    <FieldLabel htmlFor={field.name}>
                      <User className="size-3.5" />
                      Name <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={Boolean(error)}
                      placeholder="Your name"
                      className="h-10"
                    />
                    <FieldError>{error}</FieldError>
                  </Field>
                )
              }}
            </form.Field>

            <form.Field
              name="email"
              validators={{
                onBlur: emailSchema,
              }}
            >
              {(field) => {
                const error = getFieldError(field.state.meta)

                return (
                  <Field data-invalid={Boolean(error)}>
                    <FieldLabel htmlFor={field.name}>
                      <Mail className="size-3.5" />
                      Email <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={Boolean(error)}
                      placeholder="you@company.com"
                      className="h-10"
                    />
                    <FieldError>{error}</FieldError>
                  </Field>
                )
              }}
            </form.Field>

            <form.Field
              name="company"
              validators={{
                onBlur: companySchema,
              }}
            >
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    <Building2 className="size-3.5" />
                    Company{' '}
                    <span className="text-muted-foreground">(optional)</span>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="Acme Inc."
                    className="h-10"
                  />
                </Field>
              )}
            </form.Field>

            <form.Field
              name="inquiryType"
              validators={{
                onBlur: inquiryTypeSchema,
              }}
            >
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    <ListFilter className="size-3.5" />
                    Inquiry type
                  </FieldLabel>
                  <Select
                    items={inquiryTypes.map((type) => ({
                      label: type.charAt(0).toUpperCase() + type.slice(1),
                      value: type,
                    }))}
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(value as InquiryType)
                    }
                  >
                    <SelectTrigger
                      id={field.name}
                      onBlur={field.handleBlur}
                      className="h-10 w-full"
                    >
                      <SelectValue placeholder="Choose a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {inquiryTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </form.Field>

            <form.Field
              name="message"
              validators={{
                onBlur: messageSchema,
              }}
            >
              {(field) => {
                const error = getFieldError(field.state.meta)

                return (
                  <Field data-invalid={Boolean(error)}>
                    <FieldLabel htmlFor={field.name}>
                      <MessageCircle className="size-3.5" />
                      Message <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={Boolean(error)}
                      placeholder="Tell us what you need..."
                      maxLength={2000}
                      className="min-h-32 resize-none"
                    />
                    <div className="flex items-start justify-between gap-3">
                      <FieldError>{error}</FieldError>
                      <FieldDescription className="ml-auto font-mono text-[11px]">
                        {field.state.value.length}/2000
                      </FieldDescription>
                    </div>
                  </Field>
                )
              }}
            </form.Field>

            <form.Subscribe
              selector={(state) => ({
                canSubmit: state.canSubmit,
                isSubmitting: state.isSubmitting,
              })}
            >
              {({ canSubmit, isSubmitting }) => (
                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={!canSubmit}
                    className="h-11 w-full gap-2 rounded-lg"
                  >
                    <Send data-icon="inline-start" />
                    {isSubmitting ? 'Sending...' : 'Send message'}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Or email us directly at{' '}
                    <a
                      href="mailto:support@convomem.com"
                      className="text-emerald-400 transition-colors hover:text-emerald-300"
                    >
                      support@convomem.com
                    </a>
                  </p>
                </div>
              )}
            </form.Subscribe>
          </FieldGroup>
        </form>
      </section>
    </main>
  )
}

type FieldMeta = {
  isTouched: boolean
  errors: unknown[]
}

function getFieldError(meta: FieldMeta) {
  if (!meta.isTouched || meta.errors.length === 0) {
    return undefined
  }

  return getValidationMessage(meta.errors[0])
}

function getValidationMessage(error: unknown) {
  if (typeof error === 'string') {
    return error
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }

  return String(error)
}
