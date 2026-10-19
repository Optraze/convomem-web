/* Premium ease-out curve — entrances scale duration with distance (per research). */
export const EASE = [0.16, 1, 0.3, 1] as const

/* ── Enterprise plans synced with backend billing.controller.js ── */
export const enterprisePlans = [
  {
    name: 'Starter',
    price: 149,
    period: 'month',
    description: 'For small teams',
    features: [
      '10,000 customers',
      '500K API calls/mo',
      '250 AI chat queries/mo',
      '5 team members',
      '5 webhooks',
      '2 agents',
      '365-day retention',
    ],
    cta: 'Start Starter',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: 399,
    period: 'month',
    description: 'For growing platforms',
    features: [
      '75,000 customers',
      '2M API calls/mo',
      '1,000 AI chat queries/mo',
      '20 team members',
      '20 webhooks',
      '5 agents',
      '5 active lead playbooks',
      '3-year retention',
    ],
    cta: 'Start Growth',
    highlighted: true,
  },
  {
    name: 'Pro',
    price: 599,
    period: 'month',
    description: 'For scaling AI products',
    features: [
      '150,000 customers',
      '5M API calls/mo',
      '3,000 AI chat queries/mo',
      '40 team members',
      '40 webhooks',
      '15 agents',
      '15 active lead playbooks',
      'Entity knowledge graph',
      'Custom PII filters',
      '5-year retention',
    ],
    cta: 'Start Pro',
    highlighted: false,
  },
  {
    name: 'Scale',
    price: 1500,
    period: 'month',
    description: 'For enterprise AI products',
    features: [
      '500,000 customers',
      '15M API calls/mo',
      '10,000 AI chat queries/mo',
      '100 team members',
      '100 webhooks',
      '50 agents',
      '50 active lead playbooks',
      'Entity knowledge graph',
      'Custom PII filters',
      '10-year retention',
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
      'On-prem deployment on request',
      'Custom SLA',
      'Dedicated Discord channel',
    ],
    cta: 'Contact sales',
    highlighted: false,
  },
] as const

/* ── Capabilities as a typeset specification (not a card grid) ── */
export const capabilities = [
  {
    term: 'Memory capture',
    desc: 'Context-aware facts are grounded to source turns, attributed to the right speaker, and processed through a pollable async capture job.',
    tag: 'voice · chat · sms · email',
  },
  {
    term: 'Identity resolution',
    desc: 'One person, one profile. Conversations are linked across channels by phone, email, or your own customer ID.',
    tag: 'cross-channel',
  },
  {
    term: 'Controlled recall',
    desc: 'Semantic, keyword, temporal, and lifecycle signals rank a bounded context block with caller-set limits and optional diagnostics.',
    tag: '20 memories · 800 tokens',
  },
  {
    term: 'Memory lifecycle',
    desc: 'Versions, provenance, expiry, supersession, reviewable patterns, and commitment state stay visible without leaking stale rows into recall.',
    tag: 'auditable',
  },
  {
    term: 'PII redaction',
    desc: 'Mandatory secrets are dropped, while the configured agent policy can mask or reject recognized sensitive memory candidates before persistence.',
    tag: 'policy controlled',
  },
  {
    term: 'Analytics & insights',
    desc: 'Ask questions in plain language. Get dashboards, charts, and answers grounded in your own data.',
    tag: 'natural language',
  },
  {
    term: 'Integration surfaces',
    desc: 'Use the REST API, hosted MCP tools, webhooks, embeds, or the official TypeScript, Python, and Rust SDKs without exposing operator-only APIs.',
    tag: 'rest · mcp · sdk',
  },
  {
    term: 'Lead Playbooks',
    desc: 'Turn conversations into qualified leads automatically — define a playbook and matching opportunities are detected, scored, and surfaced across every channel.',
    tag: 'ai-driven',
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
    a: 'You own your data. We encrypt it at rest and in transit, and never use it to train third-party models. For organizations that need data to stay inside their own infrastructure, an on-premises deployment is available on request.',
  },
  {
    q: 'Do you train AI models on my conversations?',
    a: 'No. Your data is used only to serve your account. We do not use customer conversations to train or improve third-party AI models.',
  },
  {
    q: 'Can ConvoMem run on-prem?',
    a: 'Yes. ConvoMem runs as a hosted service by default, and an on-premises deployment inside your own infrastructure is available on request. Contact support@convomem.com to scope it.',
  },
  {
    q: 'How long is data retained?',
    a: 'Retention depends on your plan: Starter (1 year), Growth (3 years), Pro (5 years), Scale (10 years), and Custom (configurable). You can export or delete data at any time.',
  },
  {
    q: 'What channels do you support?',
    a: 'Voice, chat, SMS, and email. You can also bulk-import historical conversation data via CSV or spreadsheet.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes. Every new workspace starts on a 7-day free trial, with no credit card required. The trial includes up to 50 customers, 1,000 API calls, 5 AI chat queries, 3 team members, 2 webhooks, and 1 agent, with 30-day retention. Choose a paid plan to continue once the trial ends.',
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
