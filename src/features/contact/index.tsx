import { useState } from 'react'
import { ArrowRight, BookOpen, Check, Loader2, Mail } from 'lucide-react'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Link } from '@tanstack/react-router'

import { MarketingNavbar } from '@/components/marketing-navbar'
import { ResourceFooter } from '@/components/resource-layout'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://api.convomem.com'
const topics = [
  {
    value: 'sales',
    label: 'Sales',
    placeholder:
      'Tell us about your team, your channels, and what you’d like to build with ConvoMem.',
  },
  {
    value: 'support',
    label: 'Support',
    placeholder:
      'Tell us what happened, what you expected, and where you need a hand.',
  },
  {
    value: 'partnership',
    label: 'Partnership',
    placeholder:
      'Tell us about your company and the partnership you have in mind.',
  },
  {
    value: 'other',
    label: 'Something else',
    placeholder: 'What would you like to ask us?',
  },
] as const
const nameSchema = z
  .string()
  .trim()
  .min(1, 'Enter your name.')
  .max(100, 'Keep your name under 100 characters.')
const emailSchema = z.string().trim().email('Enter a valid email address.')
const companySchema = z
  .string()
  .trim()
  .max(100, 'Keep the company name under 100 characters.')
const messageSchema = z
  .string()
  .trim()
  .min(10, 'Add a little more detail—at least 10 characters.')
  .max(2000, 'Keep your message under 2,000 characters.')
const schema = z.object({
  name: nameSchema,
  email: emailSchema,
  company: companySchema,
  inquiryType: z.enum(['sales', 'support', 'partnership', 'other']),
  message: messageSchema,
})
type Values = z.input<typeof schema>
const defaults: Values = {
  name: '',
  email: '',
  company: '',
  inquiryType: 'sales',
  message: '',
}
const fields = [
  {
    name: 'name',
    label: 'Your name',
    placeholder: 'Alex Morgan',
    autoComplete: 'name',
    type: 'text',
    validator: nameSchema,
    required: true,
  },
  {
    name: 'email',
    label: 'Email address',
    placeholder: 'you@company.com',
    autoComplete: 'email',
    type: 'email',
    validator: emailSchema,
    required: true,
  },
  {
    name: 'company',
    label: 'Company',
    placeholder: 'Company or organisation',
    autoComplete: 'organization',
    type: 'text',
    validator: companySchema,
    required: false,
  },
] as const

export function ContactPage() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)
  const [attempted, setAttempted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const form = useForm({
    defaultValues: defaults,
    validators: { onSubmit: schema },
    onSubmit: async ({ value }) => {
      setSubmitError(null)
      try {
        const data = schema.parse(value)
        const response = await fetch(`${BASE_URL}/api/v1/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            company: data.company,
            type: data.inquiryType,
            message: data.message,
          }),
        })
        if (response.status === 429) {
          setSubmitError(
            'Too many messages at the moment. Please try again later, or email us directly.'
          )
          return
        }
        const body = await response.json().catch(() => null)
        if (!response.ok || body?.success !== true)
          throw new Error('Contact request failed')
        setSubmittedEmail(data.email)
        setTimeout(
          () => document.getElementById('contact-success-title')?.focus(),
          0
        )
        window.scrollTo({ top: 0, behavior: 'instant' })
      } catch {
        setSubmitError(
          'Your message couldn’t be sent. Please try again, or email support@convomem.com. Your text is still here.'
        )
      }
    },
  })

  return (
    <div className="premium-site cm-light-surface contact-page">
      <MarketingNavbar appearance="light" />
      <main id="main-content">
        {submittedEmail ? (
          <section
            className="contact-success p-wrap"
            aria-labelledby="contact-success-title"
          >
            <span className="contact-success-mark" aria-hidden="true">
              <Check size={30} />
            </span>
            <span className="p-kicker">THANKS FOR REACHING OUT</span>
            <h1 id="contact-success-title" tabIndex={-1}>
              Message received.
            </h1>
            <p role="status">
              We’ll reply to <strong>{submittedEmail}</strong>. In the meantime,
              you can explore the docs or head back to ConvoMem.
            </p>
            <div>
              <Link to="/" className="contact-send">
                Back to the website <ArrowRight size={16} />
              </Link>
              <button
                type="button"
                className="contact-text-link"
                onClick={() => {
                  setSubmittedEmail(null)
                  setAttempted(false)
                  setSubmitError(null)
                  form.reset()
                  setTimeout(
                    () => document.getElementById('contact-name')?.focus(),
                    0
                  )
                }}
              >
                Send another message
              </button>
            </div>
            <Link to="/docs" className="contact-text-link">
              Explore the documentation
            </Link>
          </section>
        ) : (
          <section
            className="contact-layout p-wrap"
            aria-labelledby="contact-title"
          >
            <div className="contact-intro">
              <span className="contact-eyebrow">
                <span aria-hidden="true" />
                CONTACT CONVOMEM
              </span>
              <h1 id="contact-title">
                Let’s talk.
                <br />
                <span>We’re listening.</span>
              </h1>
              <p>
                Tell us what you’re building, what you need, or where you’re
                stuck. We’ll connect you with the right team.
              </p>
              <div className="contact-shortcuts">
                <a href="mailto:support@convomem.com">
                  <Mail size={20} />
                  <span>
                    <strong>Prefer email?</strong>
                    <span>support@convomem.com</span>
                  </span>
                  <ArrowRight size={17} />
                </a>
                <Link to="/docs">
                  <BookOpen size={20} />
                  <span>
                    <strong>Building with ConvoMem?</strong>
                    <span>Explore our docs and SDKs</span>
                  </span>
                  <ArrowRight size={17} />
                </Link>
              </div>
              <span className="contact-intro-note">
                One customer. Every conversation. A little more context.
              </span>
            </div>
            <form
              className="contact-form"
              noValidate
              method="post"
              onSubmit={(event) => {
                event.preventDefault()
                const element = event.currentTarget
                setAttempted(true)
                void form.handleSubmit().then(() =>
                  setTimeout(() => {
                    element
                      ?.querySelector<HTMLElement>('[aria-invalid="true"]')
                      ?.focus()
                  })
                )
              }}
            >
              <div className="contact-form-heading">
                <span className="contact-eyebrow">SEND US A NOTE</span>
                <h2>How can we help?</h2>
                <p>Name, email and message are required.</p>
              </div>
              <form.Field name="inquiryType">
                {(field) => (
                  <fieldset className="contact-topics">
                    <legend>I’d like to talk about</legend>
                    <div>
                      {topics.map((topic) => (
                        <label key={topic.value}>
                          <input
                            type="radio"
                            name={field.name}
                            value={topic.value}
                            checked={field.state.value === topic.value}
                            onChange={() => field.handleChange(topic.value)}
                          />
                          <span>{topic.label}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}
              </form.Field>
              <div className="contact-fields">
                {fields.map((config) => (
                  <form.Field
                    key={config.name}
                    name={config.name}
                    validators={{ onBlur: config.validator }}
                  >
                    {(field) => {
                      const error =
                        field.state.meta.isTouched || attempted
                          ? validationMessage(field.state.meta.errors[0])
                          : undefined
                      return (
                        <Field
                          className={
                            config.name === 'company' ? 'contact-company' : ''
                          }
                          data-invalid={!!error}
                        >
                          <FieldLabel htmlFor={`contact-${field.name}`}>
                            {config.label}
                            {config.required ? (
                              <span aria-hidden="true">*</span>
                            ) : (
                              <small>Optional</small>
                            )}
                          </FieldLabel>
                          <Input
                            id={`contact-${field.name}`}
                            name={field.name}
                            type={config.type}
                            autoComplete={config.autoComplete}
                            required={config.required}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) =>
                              field.handleChange(event.target.value)
                            }
                            maxLength={config.name === 'email' ? 320 : 100}
                            placeholder={config.placeholder}
                            aria-invalid={!!error}
                            aria-describedby={
                              error ? `contact-${field.name}-error` : undefined
                            }
                          />
                          <FieldError id={`contact-${field.name}-error`}>
                            {error}
                          </FieldError>
                        </Field>
                      )
                    }}
                  </form.Field>
                ))}
              </div>
              <form.Field name="message" validators={{ onBlur: messageSchema }}>
                {(field) => {
                  const error =
                    field.state.meta.isTouched || attempted
                      ? validationMessage(field.state.meta.errors[0])
                      : undefined
                  return (
                    <Field className="contact-message" data-invalid={!!error}>
                      <FieldLabel htmlFor="contact-message">
                        Your message <span aria-hidden="true">*</span>
                      </FieldLabel>
                      <form.Subscribe
                        selector={(state) => state.values.inquiryType}
                      >
                        {(type) => (
                          <Textarea
                            id="contact-message"
                            name={field.name}
                            required
                            rows={5}
                            maxLength={2000}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) =>
                              field.handleChange(event.target.value)
                            }
                            placeholder={
                              topics.find((topic) => topic.value === type)
                                ?.placeholder
                            }
                            aria-invalid={!!error}
                            aria-describedby={
                              error
                                ? 'contact-message-error'
                                : 'contact-message-count'
                            }
                          />
                        )}
                      </form.Subscribe>
                      <div className="contact-message-meta">
                        <FieldError id="contact-message-error">
                          {error}
                        </FieldError>
                        <span id="contact-message-count">
                          {field.state.value.length.toLocaleString()} / 2,000
                        </span>
                      </div>
                    </Field>
                  )
                }}
              </form.Field>
              {submitError && (
                <p className="contact-submit-error" role="alert">
                  {submitError}
                </p>
              )}
              <form.Subscribe
                selector={(state) => ({
                  canSubmit: state.canSubmit,
                  isSubmitting: state.isSubmitting,
                })}
              >
                {({ canSubmit, isSubmitting }) => (
                  <button
                    className="contact-send"
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    aria-busy={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={17} className="animate-spin" /> Sending
                        your message…
                      </>
                    ) : (
                      <>
                        Send message <ArrowRight size={17} />
                      </>
                    )}
                  </button>
                )}
              </form.Subscribe>
              <p className="contact-privacy">
                Your details help us respond to your enquiry.{' '}
                <Link to="/privacy">Privacy policy</Link>
              </p>
            </form>
          </section>
        )}
      </main>
      <ResourceFooter appearance="light" />
    </div>
  )
}

function validationMessage(error: unknown): string | undefined {
  if (!error) return undefined
  if (typeof error === 'string') return error
  if (typeof error === 'object' && 'message' in error)
    return String(error.message)
  return 'Please check this field.'
}
