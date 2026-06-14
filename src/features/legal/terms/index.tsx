import {
  AlertTriangle,
  ArrowLeft,
  Ban,
  FileText,
  Gavel,
  Mail,
  Scale,
} from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from '@tanstack/react-router'

import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { MarketingFooter } from '@/components/marketing-footer'
import { MarketingNavbar } from '@/components/marketing-navbar'

const updatedAt = 'April 24, 2026'

const prohibitedUses = [
  'For any unlawful purpose or to solicit others to perform unlawful acts',
  'To transmit worms, viruses, or destructive code',
  'To infringe ConvoMem intellectual property rights or those of others',
  'To harass, abuse, harm, defame, slander, or discriminate',
  'To collect or track personal information without consent',
  'To interfere with or circumvent security features of the service',
] as const

const billingTerms = [
  ['Billing cycle', 'Paid plans are billed in advance on a recurring basis.'],
  [
    'Taxes',
    'Fees are exclusive of taxes, which may be added where applicable.',
  ],
  [
    'Cancellation',
    'You retain access to paid features through the current billing period.',
  ],
  ['Pricing changes', 'We may modify pricing with 30 days notice.'],
] as const

export function TermsOfService() {
  return (
    <main className="min-h-screen bg-background text-foreground antialiased">
      <MarketingNavbar />

      <section className="mx-auto grid w-full max-w-5xl gap-12 px-5 pt-28 pb-14 sm:px-8 sm:pt-32 sm:pb-20 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="lg:sticky lg:top-24 lg:self-start"
        >
          <div className="mb-7 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] text-hint/90 uppercase">
            <FileText className="size-3.5 text-emerald-400" />
            Legal
          </div>
          <h1 className="max-w-xl text-balance text-[clamp(36px,8vw,78px)] leading-[0.92] font-semibold tracking-[-0.06em]">
            Terms of service
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-7 text-muted-foreground">
            The terms that govern access to ConvoMem’s website, platform, APIs,
            subscriptions, and enterprise services.
          </p>

          <div className="mt-8 rounded-2xl border border-border bg-surface p-4">
            <p className="font-mono text-[11px] tracking-[0.16em] text-hint/90 uppercase">
              Last updated
            </p>
            <p className="mt-2 text-sm text-foreground">{updatedAt}</p>
          </div>

          <Link
            to="/"
            className="mt-6 inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft data-icon="inline-start" />
            Back home
          </Link>
        </motion.aside>

        <article className="min-w-0">
          <LegalSection icon={FileText} title="Acceptance of terms">
            <p>
              By accessing or using ConvoMem, you agree to be bound by these
              Terms of Service. If you do not agree, do not use our services.
              These terms apply to all visitors, users, administrators, and
              organizations that access or use ConvoMem.
            </p>
          </LegalSection>

          <LegalSection icon={FileText} title="Accounts">
            <p>
              When you create an account, you must provide accurate, complete,
              and current information. You are responsible for safeguarding the
              passwords, API keys, and credentials associated with your account.
            </p>
            <p>
              You agree not to disclose credentials to third parties and to
              notify us promptly if you suspect unauthorized access.
            </p>
          </LegalSection>

          <LegalSection icon={Ban} title="Prohibited uses">
            <p>You agree not to use ConvoMem:</p>
            <LegalList items={prohibitedUses} />
          </LegalSection>

          <LegalSection icon={Scale} title="Subscriptions and billing">
            <p>
              Some parts of the service are billed on a subscription basis. You
              will be billed in advance on a recurring basis depending on the
              plan you select.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {billingTerms.map(([label, description]) => (
                <div
                  key={label}
                  className="rounded-xl border border-border bg-surface p-4"
                >
                  <p className="font-mono text-[11px] tracking-[0.12em] text-hint uppercase">
                    {label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </LegalSection>

          <LegalSection icon={AlertTriangle} title="Limitation of liability">
            <p>
              To the maximum extent permitted by law, ConvoMem and its
              directors, employees, partners, agents, suppliers, and affiliates
              will not be liable for indirect, incidental, special,
              consequential, punitive, or exemplary damages, including loss of
              profits, data, use, goodwill, or other intangible losses.
            </p>
          </LegalSection>

          <LegalSection icon={Gavel} title="Termination">
            <p>
              We may terminate or suspend your account immediately, without
              prior notice or liability, if you breach these Terms or use the
              service in a way that creates risk for ConvoMem, our customers, or
              third parties.
            </p>
            <p>
              Upon termination, your right to use the service will immediately
              cease. Data retention and deletion will follow your plan,
              agreement, and our Privacy Policy.
            </p>
          </LegalSection>

          <LegalSection icon={FileText} title="Changes to terms">
            <p>
              We may modify or replace these Terms at any time. If a revision is
              material, we will make reasonable efforts to provide at least 30
              days notice before the new terms take effect.
            </p>
          </LegalSection>

          <LegalSection icon={Scale} title="Governing law">
            <p>
              These Terms are governed by the laws of the jurisdiction in which
              ConvoMem operates, without regard to conflict-of-law rules. Our
              failure to enforce any right or provision is not a waiver of those
              rights.
            </p>
          </LegalSection>

          <LegalSection icon={Mail} title="Contact us">
            <p>
              Questions about these Terms? Contact us at{' '}
              <LegalLink href="mailto:support@convomem.com">
                support@convomem.com
              </LegalLink>
              .
            </p>
          </LegalSection>

          <div className="mt-12 rounded-2xl border border-border bg-surface p-5">
            <p className="text-[12px] leading-6 text-hint">
              <strong className="font-medium text-foreground">
                Disclaimer:
              </strong>{' '}
              These terms are provided as a SaaS template and have not been
              reviewed by legal counsel. You are responsible for ensuring they
              comply with applicable laws in your jurisdiction.
            </p>
          </div>
        </article>
      </section>

      <MarketingFooter />
    </main>
  )
}

type LegalSectionProps = {
  icon: LucideIcon
  title: string
  children: ReactNode
}

function LegalSection({ icon: Icon, title, children }: LegalSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45 }}
      className="mb-10 scroll-mt-24"
    >
      <div className="mb-3 flex items-center gap-2">
        <Icon className="size-3.5 text-emerald-400" />
        <h2 className="font-mono text-[15px] font-semibold tracking-[-0.02em] text-foreground">
          {title}
        </h2>
      </div>
      <div className="flex flex-col gap-3 text-[13px] leading-7 text-muted-foreground">
        {children}
      </div>
    </motion.section>
  )
}

function LegalList({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex list-disc flex-col gap-1 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

function LegalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="font-medium text-emerald-400 transition-colors hover:text-emerald-300 hover:underline"
    >
      {children}
    </a>
  )
}
