import {
  ArrowLeft,
  Bell,
  Cookie,
  Eye,
  FileText,
  Globe,
  Lock,
  Mail,
  Server,
  Shield,
  Trash2,
  UserCheck,
} from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from '@tanstack/react-router'

import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { MarketingFooter } from '@/features/marketing/components/footer.tsx'
import { MarketingNavbar } from '@/features/marketing/components/navbar.tsx'

const updatedAt = 'April 24, 2026'

const collectionRows = [
  ['Account data', 'Name, email address, company name, and workspace details'],
  ['Usage data', 'API calls, feature usage, diagnostics, and log data'],
  ['Customer content', 'Conversations and messages you choose to capture'],
  ['Billing data', 'Payment method, billing address, and transaction history'],
  [
    'Device and log data',
    'IP address, browser type, device, and operating system',
  ],
] as const

const useCases = [
  'Provide, maintain, and improve ConvoMem services',
  'Process transactions and send billing information',
  'Send technical notices, security alerts, and support messages',
  'Monitor usage trends, diagnose issues, and prevent abuse',
  'Detect, prevent, and address fraud or security incidents',
  'Comply with legal obligations and enforce agreements',
] as const

const rights = [
  {
    title: 'United States (CCPA / CPRA)',
    items: [
      'Right to know what personal information we collect and how we use it',
      'Right to delete your personal information',
      'Right to opt out of sale or sharing of personal information',
      'Right to non-discrimination for exercising privacy rights',
    ],
  },
  {
    title: 'India (Digital Personal Data Protection Act 2023)',
    items: [
      'Right to access your personal data',
      'Right to correction and erasure',
      'Right to grievance redressal',
      'Right to nominate another person to exercise rights on your behalf',
    ],
  },
] as const

const retentionPeriods = [
  ['Starter', 'Up to 1 year'],
  ['Growth', 'Up to 3 years'],
  ['Scale', 'Up to 10 years'],
  ['Custom', 'As agreed in your contract'],
] as const

const providers = [
  'Payment processing',
  'Email delivery',
  'Cloud infrastructure hosting',
  'Analytics and error monitoring',
] as const

export function PrivacyPolicy() {
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
            <Shield className="size-3.5 text-emerald-400" />
            Legal
          </div>
          <h1 className="max-w-xl text-balance text-[clamp(36px,8vw,78px)] leading-[0.92] font-semibold tracking-[-0.06em]">
            Privacy policy
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-7 text-muted-foreground">
            How ConvoMem collects, uses, protects, and retains information for
            visitors, workspace users, and enterprise administrators.
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
          <PolicySection icon={Eye} title="Introduction">
            <p>
              This Privacy Policy explains how ConvoMem collects, uses, and
              protects your information when you use our website, platform, and
              services.
            </p>
            <p>
              By using ConvoMem, you agree to the practices described here. If
              you do not agree, please do not use our services.
            </p>
          </PolicySection>

          <PolicySection icon={FileText} title="What we collect">
            <p>We collect the following categories of information:</p>
            <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
              <table className="w-full min-w-[520px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 font-mono text-[11px] font-semibold tracking-[0.08em] text-hint uppercase">
                      Category
                    </th>
                    <th className="px-4 py-3 font-mono text-[11px] font-semibold tracking-[0.08em] text-hint uppercase">
                      Examples
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {collectionRows.map(([category, examples]) => (
                    <tr
                      key={category}
                      className="border-b border-border/60 last:border-0"
                    >
                      <td className="px-4 py-3 text-[13px] font-medium text-foreground">
                        {category}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-muted-foreground">
                        {examples}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </PolicySection>

          <PolicySection icon={Lock} title="How we use your information">
            <p>We use information to:</p>
            <PolicyList items={useCases} />
          </PolicySection>

          <PolicySection icon={Cookie} title="Cookies and tracking">
            <p>
              We use cookies and similar technologies to operate our website,
              remember preferences, and understand how visitors interact with
              ConvoMem.
            </p>
            <p>
              Essential cookies are required for the site to function. Analytics
              cookies help us improve the product and can be controlled through
              the cookie banner or browser settings.
            </p>
          </PolicySection>

          <PolicySection icon={UserCheck} title="Your rights">
            <p>
              Depending on your location, you may have rights to access,
              correct, delete, or restrict use of your personal information.
            </p>
            <div className="grid gap-3">
              {rights.map((group) => (
                <div
                  key={group.title}
                  className="rounded-2xl border border-border bg-surface p-4"
                >
                  <p className="mb-3 font-mono text-[11px] font-medium tracking-[0.12em] text-hint uppercase">
                    {group.title}
                  </p>
                  <PolicyList items={group.items} />
                </div>
              ))}
            </div>
            <p>
              To exercise these rights, contact us at{' '}
              <PolicyLink href="mailto:support@convomem.com">
                support@convomem.com
              </PolicyLink>
              . We will respond within timeframes required by applicable law.
            </p>
          </PolicySection>

          <PolicySection icon={Trash2} title="Data retention">
            <p>
              We retain information for as long as your account is active or as
              needed to provide services. Retention periods vary by plan:
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {retentionPeriods.map(([plan, period]) => (
                <div
                  key={plan}
                  className="rounded-xl border border-border bg-surface p-4"
                >
                  <p className="font-mono text-[11px] tracking-[0.12em] text-hint uppercase">
                    {plan}
                  </p>
                  <p className="mt-2 text-sm text-foreground">{period}</p>
                </div>
              ))}
            </div>
            <p>
              You can delete your account and associated data from your
              settings. We permanently delete data within 30 days, except where
              retention is required by law.
            </p>
          </PolicySection>

          <PolicySection icon={Shield} title="Security">
            <p>
              We use encryption in transit and at rest, secure authentication,
              access controls, and operational safeguards to protect your data.
              API keys and credentials are stored using one-way hashing.
            </p>
            <p>
              Enterprise customers can self-host ConvoMem for full control over
              data and infrastructure. No internet transmission is 100% secure,
              so we cannot guarantee absolute security.
            </p>
          </PolicySection>

          <PolicySection icon={Globe} title="Third-party services">
            <p>We work with trusted providers to operate ConvoMem:</p>
            <PolicyList items={providers} />
            <p>
              These providers are contractually bound to use data only for the
              services they perform on our behalf and to maintain appropriate
              security measures.
            </p>
          </PolicySection>

          <PolicySection icon={Server} title="AI data usage">
            <p>
              ConvoMem uses AI to extract facts and insights from conversations.
              Your data is processed solely to deliver our services to you. We
              do not use customer conversations to train or improve
              general-purpose AI models.
            </p>
          </PolicySection>

          <PolicySection icon={Bell} title="Changes to this policy">
            <p>
              We may update this Privacy Policy from time to time. If we make
              material changes, we will notify you by email or post a notice on
              our website before the changes take effect.
            </p>
          </PolicySection>

          <PolicySection icon={Mail} title="Contact us">
            <p>
              For privacy questions, concerns, or data requests, email us at{' '}
              <PolicyLink href="mailto:support@convomem.com">
                support@convomem.com
              </PolicyLink>
              .
            </p>
          </PolicySection>

          <div className="mt-12 border-t border-border pt-8">
            <p className="text-[12px] leading-6 text-hint">
              This Privacy Policy is effective as of {updatedAt}. Your continued
              use of ConvoMem after changes constitutes acceptance of the
              updated policy.
            </p>
          </div>
        </article>
      </section>

      <MarketingFooter />
    </main>
  )
}

type PolicySectionProps = {
  icon: LucideIcon
  title: string
  children: ReactNode
}

function PolicySection({ icon: Icon, title, children }: PolicySectionProps) {
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

function PolicyList({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex list-disc flex-col gap-1 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

function PolicyLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="font-medium text-emerald-400 transition-colors hover:text-emerald-300 hover:underline"
    >
      {children}
    </a>
  )
}
