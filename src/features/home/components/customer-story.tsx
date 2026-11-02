import { useState } from 'react'
import { Check, Mail, MessageSquare, Phone } from 'lucide-react'

import { customerExample } from '../customer-example'

const channels = [
  {
    label: 'Voice',
    icon: Phone,
    when: 'Earlier call',
    quote: customerExample.voice,
    fact: 'The troubleshooting is already in the history.',
    detail:
      'The next agent can see which steps the customer says they tried, alongside the unresolved issue.',
  },
  {
    label: 'Chat',
    icon: MessageSquare,
    when: 'Return conversation',
    quote: customerExample.chat,
    fact: 'A new channel. The same open issue.',
    detail:
      'The returning message joins the customer’s existing history, so their earlier explanation is available.',
  },
  {
    label: 'Email',
    icon: Mail,
    when: 'Follow-up email',
    quote: customerExample.emailMessage,
    fact: 'The follow-up preference stays with the customer.',
    detail:
      'Email updates after 3pm remain part of the context, even when a different agent takes over.',
  },
]

function ChannelPicker({
  active,
  onSelect,
}: {
  active: number
  onSelect: (index: number) => void
}) {
  return (
    <fieldset
      className="p-channel-picker"
      aria-label="Explore a customer’s channels"
    >
      {channels.map((channel, index) => (
        <button
          type="button"
          key={channel.label}
          aria-pressed={active === index}
          onClick={() => onSelect(index)}
        >
          <channel.icon size={15} />
          {channel.label}
        </button>
      ))}
    </fieldset>
  )
}

export function CustomerStory() {
  const [active, setActive] = useState(0)
  const current = channels[active]
  return (
    <section className="p-story p-wrap" id="how-it-works">
      <div className="p-story-copy">
        <span className="p-kicker">A LITTLE CONTEXT GOES A LONG WAY</span>
        <h2>
          The conversation ends.
          <br />
          The relationship <em>doesn’t.</em>
        </h2>
        <p>
          A customer calls about a leaking machine, follows up in chat, then
          asks for email updates. Their issue, previous steps, and preferences
          should travel with them.
        </p>
        <div className="p-story-channels-wide">
          <ChannelPicker active={active} onSelect={setActive} />
        </div>
        <div className="p-story-detail" aria-live="polite">
          <div className="p-story-detail-content" key={current.label}>
            <strong>{current.fact}</strong>
            <p>{current.detail}</p>
          </div>
        </div>
        <a className="p-text-link" href="#feature-catalog">
          Explore customer memory
        </a>
      </div>
      <figure className="p-customer-art p-history-example">
        <div className="p-history-header">
          <div className="p-case-person">
            <span className="p-case-avatar">{customerExample.initials}</span>
            <div>
              <strong>{customerExample.name}</strong>
              <span>One customer record</span>
            </div>
          </div>
          <span className="p-history-status">Issue still open</span>
        </div>
        <div className="p-history-source">
          <current.icon size={15} />
          <span>{current.label}</span>
          <small>{current.when}</small>
        </div>
        <div className="p-ticket-quote p-history-quote">
          <p key={current.label}>“{current.quote}”</p>
        </div>
        <div className="p-story-channels-compact">
          <ChannelPicker active={active} onSelect={setActive} />
        </div>
        <div className="p-history-memory">
          <div className="p-history-memory-heading">
            <Check size={14} />
            <strong>Brief for the next agent</strong>
          </div>
          <p className="p-history-brief">{customerExample.brief}</p>
          <span className="p-history-provenance">
            Based on the linked call, chat and email.
          </span>
        </div>
        <div className="p-history-footer">
          <span>Voice, chat and email linked to one customer.</span>
          <span>Customer-reported context</span>
        </div>
        <figcaption>
          Illustrative customer history. No real customer data.
        </figcaption>
      </figure>
    </section>
  )
}
