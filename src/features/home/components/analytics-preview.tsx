import { useState } from 'react'
import { Check, Mail, MessageSquare, Phone } from 'lucide-react'

import { customerExample } from '../customer-example'

const examples = [
  {
    question: 'Which issues bring customers back?',
    label: 'Recurring issues',
    shortLabel: 'Issues',
    title: 'Find the problems that keep coming back.',
    detail:
      'Group customer-reported problems and inspect the conversation behind each signal.',
    labels: ['Water leaks', 'No hot water', 'Replacement delays'],
    counts: [18, 13, 9],
    evidence: [
      {
        quote: customerExample.voice,
        channel: 'Voice',
        signal: 'Leak reported after troubleshooting',
      },
      {
        quote: 'I followed the cleaning steps, but the water is still cold.',
        channel: 'Chat',
        signal: 'Issue persists after suggested steps',
      },
      {
        quote: 'The replacement mentioned on my last call has not arrived.',
        channel: 'Email',
        signal: 'Unresolved replacement delay',
      },
    ],
  },
  {
    question: 'Who needs a follow-up?',
    label: 'Open follow-ups',
    shortLabel: 'Follow-up',
    title: 'See what is still unresolved.',
    detail:
      'Review open issues, repeat contacts, and return concerns with the customer’s own words.',
    labels: ['Open issues', 'Repeat contacts', 'Return concerns'],
    counts: [17, 11, 7],
    evidence: [
      {
        quote: customerExample.chat,
        channel: 'Chat',
        signal: 'Customer returned about the same issue',
      },
      {
        quote:
          'I have explained this to two different agents and still have no answer.',
        channel: 'Voice',
        signal: 'Repeated explanation across agents',
      },
      {
        quote:
          'I am considering returning the machine if we cannot fix the leak.',
        channel: 'Email',
        signal: 'Customer mentioned a possible return',
      },
    ],
  },
  {
    question: 'What should the product team investigate?',
    label: 'Product feedback',
    shortLabel: 'Feedback',
    title: 'Bring recurring requests to the surface.',
    detail:
      'Connect repeated product requests to their source conversations before deciding what to improve.',
    labels: ['Setup help', 'Repair updates', 'Spare parts'],
    counts: [19, 14, 8],
    evidence: [
      {
        quote:
          'Could the setup guide show how to fit the water tank correctly?',
        channel: 'Chat',
        signal: 'Request for clearer setup guidance',
      },
      {
        quote: 'Can you email me when the repair status changes?',
        channel: 'Email',
        signal: 'Request for repair status updates',
      },
      {
        quote:
          'Can I buy a replacement seal instead of replacing the whole machine?',
        channel: 'Voice',
        signal: 'Interest in spare parts',
      },
    ],
  },
]
export function AnalyticsPreview() {
  const [active, setActive] = useState(0)
  const [selected, setSelected] = useState(0)
  const example = examples[active]
  const evidence = example.evidence[selected]
  const selectExample = (index: number) => {
    setActive(index)
    setSelected(0)
  }
  return (
    <section className="p-intelligence" id="analytics">
      <div className="p-intelligence-inner p-wrap">
        <div className="p-intelligence-copy">
          <span className="p-kicker">CUSTOMER INTELLIGENCE, WITH CONTEXT</span>
          <h2>
            What’s happening.
            <br />
            Why it matters.
            <br />
            <em>What comes next.</em>
          </h2>
          <p>
            Ask which issues recur, who needs a follow-up, and what customers
            keep requesting. Open a signal to read its source conversation.
          </p>
          <QuestionControls
            active={active}
            onSelect={selectExample}
            placement="desktop"
          />
          <div className="p-analysis-notes">
            <span>
              <Check size={13} />
              Natural-language questions
            </span>
            <span>
              <Check size={13} />
              Source-linked context
            </span>
            <span>
              <Check size={13} />
              Signals for human review
            </span>
          </div>
        </div>
        <figure className="p-data-art">
          <div className="p-data-top">
            <span>
              <span className="p-data-dot" />
              CONVERSATION SIGNALS
            </span>
            <span>ILLUSTRATIVE DATA</span>
          </div>
          <h3 key={example.title}>{example.title}</h3>
          <p key={example.detail}>{example.detail}</p>
          <div className="p-chart-caption">
            <span>Illustrative mentions</span>
            <span>Select a bar for context</span>
          </div>
          <div className="p-chart-detail">
            <div className="p-chart-axis" aria-hidden="true">
              {[20, 15, 10, 5, 0].map((value) => (
                <span key={value}>{value}</span>
              ))}
            </div>
            <fieldset
              className="p-column-chart"
              aria-label="Illustrative signal counts; select a theme to view example evidence"
            >
              {example.labels.map((label, index) => (
                <button
                  type="button"
                  className="p-chart-column"
                  key={label}
                  aria-pressed={selected === index}
                  aria-label={`${label}: ${example.counts[index]} sample signals. Show example evidence.`}
                  onClick={() => setSelected(index)}
                >
                  <span className="p-column-track">
                    <span
                      className={`p-column p-column-${index}`}
                      style={{
                        height: `${(example.counts[index] / 20) * 100}%`,
                      }}
                    >
                      <span className="p-bar-value">
                        {example.counts[index]}
                      </span>
                    </span>
                  </span>
                  <span className="p-chart-label">{label}</span>
                </button>
              ))}
            </fieldset>
          </div>
          <QuestionControls
            active={active}
            onSelect={selectExample}
            placement="mobile"
          />
          <div className="p-chart-evidence" aria-live="polite">
            <div>
              <span>CUSTOMER’S WORDS</span>
              <span>
                {evidence.channel === 'Voice' ? (
                  <Phone size={11} />
                ) : evidence.channel === 'Email' ? (
                  <Mail size={11} />
                ) : (
                  <MessageSquare size={11} />
                )}{' '}
                {evidence.channel}
              </span>
            </div>
            <blockquote key={evidence.quote}>“{evidence.quote}”</blockquote>
            <span className="p-evidence-signal">
              <span />
              {evidence.signal}
            </span>
          </div>
          <figcaption>
            <span>
              Explore a signal. Understand the conversation.
              <small>
                Fictional conversations and sample counts. Not customer results.
              </small>
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
function QuestionControls({
  active,
  onSelect,
  placement,
}: {
  active: number
  onSelect: (index: number) => void
  placement: 'desktop' | 'mobile'
}) {
  return (
    <fieldset
      className={`p-questions p-questions-${placement}`}
      aria-label="Example analytics question"
    >
      <span
        className="p-question-indicator"
        aria-hidden="true"
        style={{ translate: `${active * 100}% 0` }}
      />
      {examples.map((item, index) => (
        <button
          type="button"
          aria-pressed={active === index}
          aria-label={`${item.label}: ${item.question}`}
          key={item.question}
          onClick={() => onSelect(index)}
        >
          <span className="p-question-full">{item.question}</span>
          <span className="p-question-short">{item.shortLabel}</span>
        </button>
      ))}
    </fieldset>
  )
}
