export const featureGroups = [
  {
    id: 'memory',
    title: 'Customer memory',
    summary:
      'Capture the conversation, connect the customer, and keep the useful context.',
    features: [
      {
        title: 'Voice, chat, SMS & email capture',
        description:
          'Bring single messages, full conversations, and historical transcripts into the same customer-memory layer.',
      },
      {
        title: 'Cross-channel identity resolution',
        description:
          'Connect phone numbers, emails, and external IDs to one customer profile across your agents.',
      },
      {
        title: 'Structured memory extraction',
        description:
          'Extract facts, preferences, intentions, decisions, relationships, and commitments with speaker attribution.',
      },
      {
        title: 'Memory lifecycle & provenance',
        description:
          'Follow a fact back to its source. Inspect versions, expiry, superseded details, and the history of a change.',
      },
      {
        title: 'Controlled search & recall',
        description:
          'Find relevant memory with semantic, keyword, time, and lifecycle signals. Set limits on the context returned.',
      },
      {
        title: 'Customer profiles & journey timelines',
        description:
          'See the customer’s conversations, identifiers, memories, and interactions together.',
      },
      {
        title: 'Customer merge & duplicate review',
        description:
          'Review potential duplicate profiles and merge customer records with an audit trail and recovery controls.',
      },
      {
        title: 'Reviewable customer patterns',
        description:
          'Review inferred patterns before approving them. Keep proposals separate from established customer facts.',
      },
    ],
  },
  {
    id: 'intelligence',
    title: 'Intelligence & analytics',
    summary:
      'Understand what customers need, what is changing, and where your team can help.',
    features: [
      {
        title: 'Natural-language analytics',
        description:
          'Ask questions across customer conversations and memories. Explore follow-up questions in saved chat threads.',
      },
      {
        title: 'Charts, reports & live analysis steps',
        description:
          'Explore visual answers and see the steps behind an analysis, with customer data kept inside its organization scope.',
      },
      {
        title: 'Buying signals & expansion opportunities',
        description:
          'Surface pricing interest, new use cases, seat growth, and other conversation-backed opportunities.',
      },
      {
        title: 'Complaints & recurring issue groups',
        description:
          'Group related complaints, inspect their source conversations, and track acknowledgement and resolution.',
      },
      {
        title: 'Churn risk & sentiment trends',
        description:
          'Review cancellation language, frustration, and changes in customer sentiment across conversations.',
      },
      {
        title: 'Feature requests & knowledge-gap review',
        description:
          'Explore repeated requests and evidence-backed potential knowledge gaps that need a human review.',
      },
      {
        title: 'Entity knowledge graph',
        description:
          'Explore the people, organizations, products, locations, and relationships mentioned in customer memory.',
      },
      {
        title: 'Agent performance & consistency review',
        description:
          'Review source-linked support signals, conversation coverage, and potential answer inconsistencies without an automatic employee ranking.',
      },
    ],
  },
  {
    id: 'workflows',
    title: 'Agent workflows',
    summary:
      'Carry the story from one interaction to the next, and turn customer signals into follow-up.',
    features: [
      {
        title: 'Cross-channel handoff briefs',
        description:
          'Give the next agent a customer timeline, relevant memories, open issues, sentiment, and an AI-written narrative.',
      },
      {
        title: 'Handoff routing',
        description:
          'Configure transfer destinations and resolve the next handoff destination through the integration API.',
      },
      {
        title: 'Embedded agent panel',
        description:
          'Bring customer context into your helpdesk with a scoped, token-authenticated panel and supported agent actions.',
      },
      {
        title: 'Lead Playbooks',
        description:
          'Define the conversations that qualify as opportunities, then detect, score, and review matching leads.',
      },
      {
        title: 'Commitment tracking',
        description:
          'Follow open, overdue, and completed commitments, with the supporting conversation close at hand.',
      },
      {
        title: 'Action queue & insight lifecycle',
        description:
          'Acknowledge, resolve, dismiss, snooze, or reopen supported customer issues and keep track of follow-up.',
      },
      {
        title: 'Multiple agents, shared customer identity',
        description:
          'Separate use cases, capture instructions, memory policies, and access while keeping the customer’s identity connected.',
      },
      {
        title: 'Separate customer & agent-authored facts',
        description:
          'Keep speaker attribution visible. Customer intelligence excludes agent-authored facts by default unless explicitly requested.',
      },
    ],
  },
  {
    id: 'developers',
    title: 'Developer platform',
    summary:
      'Integrate through the public API, build on your existing stack, and inspect what happened.',
    features: [
      {
        title: 'REST API & OpenAPI reference',
        description:
          'Integrate capture, customer identity, memory, conversations, recall, handoff, and embeds through a documented API.',
      },
      {
        title: 'TypeScript, Python & Rust SDKs',
        description:
          'Use the official SDKs for the public integration API with consistent types, retries, timeouts, and error handling.',
      },
      {
        title: 'Hosted MCP tools',
        description:
          'Connect compatible agents and tools to bounded, authenticated ConvoMem capabilities over hosted MCP.',
      },
      {
        title: 'Signed webhooks',
        description:
          'React to customer and memory events with signed deliveries, retry handling, and delivery history.',
      },
      {
        title: 'CSV & JSON transcript import',
        description:
          'Map columns, preview conversations, and process historical transcripts with asynchronous import status.',
      },
      {
        title: 'Capture status & retry-safe ingestion',
        description:
          'Track queued, processing, completed, and failed captures. Use idempotency controls for reliable retries.',
      },
      {
        title: 'Memory playground & diagnostics',
        description:
          'Inspect stored lookup results, test extraction in an isolated sandbox, and review retrieval controls.',
      },
      {
        title: 'Request logs, memory health & exports',
        description:
          'Inspect content-free request telemetry and operational memory inventory, and create authorized dashboard exports.',
      },
    ],
  },
  {
    id: 'security',
    title: 'Security & control',
    summary:
      'Keep customer context scoped, reviewable, and under your organization’s control.',
    features: [
      {
        title: 'Organization & agent isolation',
        description:
          'Keep organization data separated and apply agent scoping across the supported product and integration surfaces.',
      },
      {
        title: 'Roles & granular permissions',
        description:
          'Use built-in roles, custom roles, and permission controls to manage who can view and change customer data.',
      },
      {
        title: 'PII & sensitive-data policies',
        description:
          'Apply configured masking or rejection rules, custom patterns where supported, and mandatory secret filtering.',
      },
      {
        title: 'Untrusted-memory safeguards',
        description:
          'Sanitize customer-authored memory and serve it as unverified context rather than instructions for an agent.',
      },
      {
        title: 'Retention & customer data controls',
        description:
          'Configure supported retention settings, review memory history, and use authorized export and erasure workflows.',
      },
      {
        title: 'Rate, usage & budget controls',
        description:
          'Track plan usage, manage subscriptions and invoices, and apply rate limits and processing-budget safeguards.',
      },
      {
        title: 'API keys & scoped embed tokens',
        description:
          'Keep server integrations authenticated and restrict embedded panels with scoped, time-limited tokens.',
      },
      {
        title: 'Hosted or on-premises',
        description:
          'Use the hosted platform, or discuss an on-premises deployment with capacity, support, and deployment requirements scoped for your team.',
      },
    ],
  },
] as const
