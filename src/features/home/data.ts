/* Premium ease-out curve — entrances scale duration with distance (per research). */
export const EASE = [0.16, 1, 0.3, 1] as const

/* ── Enterprise plans synced with backend billing.controller.js ── */
export const enterprisePlans = [
  {
    name: 'Starter',
    price: 99,
    period: 'month',
    description: 'For small teams',
    features: [
      '10,000 customers',
      '500K API calls/mo',
      '50 AI chat queries/mo',
      '5 team members',
      '5 webhooks',
      '365-day retention',
      '7-day free trial',
    ],
    cta: 'Start Starter',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: 299,
    period: 'month',
    description: 'For growing platforms',
    features: [
      '75,000 customers',
      '2M API calls/mo',
      '300 AI chat queries/mo',
      '20 team members',
      '20 webhooks',
      '3-year retention',
      '7-day free trial',
    ],
    cta: 'Start Growth',
    highlighted: true,
  },
  {
    name: 'Scale',
    price: 999,
    period: 'month',
    description: 'For enterprise AI products',
    features: [
      '300,000 customers',
      '10M API calls/mo',
      '1,500 AI chat queries/mo',
      'Unlimited team',
      'Unlimited webhooks',
      '10-year retention',
      '7-day free trial',
    ],
    cta: 'Start Scale',
    highlighted: false,
  },
  {
    name: 'Custom',
    price: null,
    period: 'month',
    description: 'Contact sales',
    features: [
      'Unlimited everything',
      'On-prem deployment',
      'Custom SLA',
      'Dedicated Slack channel',
    ],
    cta: 'Contact sales',
    highlighted: false,
  },
] as const

/* ── Capabilities as a typeset specification (not a card grid) ── */
export const capabilities = [
  {
    term: 'Memory capture',
    desc: 'Facts are extracted from every conversation as it happens — no manual tagging, no schemas to maintain.',
    tag: 'voice · chat · sms · email',
  },
  {
    term: 'Identity resolution',
    desc: 'One person, one profile. Conversations are linked across channels by phone, email, or your own customer ID.',
    tag: 'cross-channel',
  },
  {
    term: 'Sentiment & signals',
    desc: 'Buying intent, complaints, and churn risk surface the moment they appear in a conversation.',
    tag: 'real-time',
  },
  {
    term: 'Knowledge graph',
    desc: 'A living map of every relationship — who said what, when, and how it connects to everything else.',
    tag: 'queryable',
  },
  {
    term: 'PII redaction',
    desc: 'Sensitive data is detected and masked before anything is written to storage. On by default.',
    tag: 'automatic',
  },
  {
    term: 'Analytics & insights',
    desc: 'Ask questions in plain language. Get dashboards, charts, and answers grounded in your own data.',
    tag: 'natural language',
  },
] as const

/* ── Pipeline ── */
export const pipeline = [
  {
    step: '01',
    title: 'Capture',
    desc: 'A single API call sends a message in. ConvoMem extracts the facts worth keeping and redacts the rest.',
  },
  {
    step: '02',
    title: 'Reconcile',
    desc: 'New facts are matched to the right customer, deduplicated, and contradictions are resolved automatically.',
  },
  {
    step: '03',
    title: 'Inject',
    desc: 'On the next turn, the relevant memories are returned as context — so the agent already knows the story.',
  },
] as const

/* ── FAQ ── */
export const faqs = [
  {
    q: 'What happens to my data?',
    a: 'You own your data. We encrypt it at rest and in transit, and never use it to train third-party models. On the Custom tier, we can deploy ConvoMem entirely inside your own infrastructure (on-prem) for full control.',
  },
  {
    q: 'Do you train AI models on my conversations?',
    a: 'No. Your data is used only to serve your account. We do not use customer conversations to train or improve third-party AI models.',
  },
  {
    q: 'Can ConvoMem run on-prem?',
    a: 'Yes — on the Custom tier. We offer on-prem deployments inside your own infrastructure for enterprises with strict data-residency or compliance requirements. Talk to sales to scope it. All other tiers run on our managed cloud.',
  },
  {
    q: 'How long is data retained?',
    a: 'Retention depends on your plan: Starter (1 year), Growth (3 years), Scale (10 years), and Custom (configurable). You can export or delete data at any time.',
  },
  {
    q: 'What channels do you support?',
    a: 'Voice, chat, SMS, and email. You can also bulk-import historical conversation data via CSV or spreadsheet.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Every paid plan includes a 7-day free trial. No credit card required to start.',
  },
] as const

export const SECTIONS = [
  { id: 'top', label: 'Index' },
  { id: 'try', label: 'Try it' },
  { id: 'scenarios', label: 'In the wild' },
  { id: 'features', label: 'Capabilities' },
  { id: 'how-it-works', label: 'Pipeline' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'faq', label: 'Questions' },
] as const
