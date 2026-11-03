import { useMemo, useState } from 'react'
import {
  ArrowRight,
  ChevronDown,
  FileText,
  Mail,
  MessageSquare,
  Phone,
} from 'lucide-react'

import type { CsvMapping, CsvTable, MappedConversation } from './extractor'

import {
  groupConversations,
  guessMapping,
  MAX_CONVERSATIONS,
} from './extractor'

function FieldSelect({
  label,
  hint,
  value,
  columns,
  optional,
  onChange,
}: {
  label: string
  hint: string
  value: string
  columns: string[]
  optional?: boolean
  onChange: (value: string) => void
}) {
  return (
    <label className="demo-import-field">
      <span>
        {label}
        {!optional && ' *'}
      </span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {optional && <option value="">Not included</option>}
        {columns.map((column) => (
          <option key={column} value={column}>
            {column}
          </option>
        ))}
      </select>
      <small>{hint}</small>
    </label>
  )
}

export function CsvMapper({
  table,
  onRun,
  onCancel,
}: {
  table: CsvTable
  onRun: (conversations: MappedConversation[]) => void
  onCancel: () => void
}) {
  const [mapping, setMapping] = useState<CsvMapping>(() =>
    guessMapping(table.columns)
  )
  const set = (key: keyof CsvMapping) => (value: string) =>
    setMapping((m) => ({ ...m, [key]: value }))
  const conversations = useMemo(
    () => groupConversations(table, mapping),
    [table, mapping]
  )
  const oversized = conversations.some((c) =>
    c.messages.some((m) => m.content.length > 4000)
  )
  const valid = !!mapping.messageCol && conversations.length > 0 && !oversized
  return (
    <div className="demo-import">
      <div className="demo-import-summary">
        <FileText size={19} />
        <div>
          <strong>
            {table.rows.length} rows read · {conversations.length} conversations
            ready
          </strong>
          <p>
            Preview the messages below. Adjust the columns only if something
            looks wrong.
          </p>
        </div>
      </div>
      <details
        className="demo-import-settings"
        open={!mapping.messageCol || undefined}
      >
        <summary>
          <span>
            Detected:{' '}
            <strong>{mapping.messageCol || 'Choose message column'}</strong>
            {mapping.channelCol && <> · {mapping.channelCol}</>}
          </span>
          <span>
            Adjust columns <ChevronDown size={14} />
          </span>
        </summary>
        <div className="demo-import-fields">
          <FieldSelect
            label="Message"
            hint="The customer's words"
            value={mapping.messageCol}
            columns={table.columns}
            onChange={set('messageCol')}
          />
          <FieldSelect
            label="Channel"
            hint="Voice, chat, SMS or email"
            value={mapping.channelCol}
            columns={table.columns}
            optional
            onChange={set('channelCol')}
          />
          <FieldSelect
            label="Conversation ID"
            hint="Group messages into a thread"
            value={mapping.conversationCol}
            columns={table.columns}
            optional
            onChange={set('conversationCol')}
          />
          <FieldSelect
            label="Speaker"
            hint="Customer or agent"
            value={mapping.roleCol}
            columns={table.columns}
            optional
            onChange={set('roleCol')}
          />
        </div>
      </details>
      <div className="demo-import-preview-title">
        <h3>Conversations to process</h3>
        <span>Up to {MAX_CONVERSATIONS} conversations · 20 messages each</span>
      </div>
      {!conversations.length ? (
        <p className="demo-input-error" role="status">
          Select a column containing message text to see a preview.
        </p>
      ) : (
        <ol className="demo-import-previews">
          {conversations.map((conversation, index) => {
            const Icon =
              conversation.channel === 'VOICE'
                ? Phone
                : conversation.channel === 'EMAIL'
                  ? Mail
                  : MessageSquare
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: imported groups retain source order and may contain identical conversations.
              <li key={`${index}-${conversation.channel}`}>
                <details open={index === 0}>
                  <summary>
                    <span className="demo-import-channel">
                      <Icon size={16} />
                      <strong>{conversation.channel.toLowerCase()}</strong>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                    </span>
                    <span>
                      {conversation.messages.length}{' '}
                      {conversation.messages.length === 1
                        ? 'message'
                        : 'messages'}{' '}
                      <ChevronDown size={15} />
                    </span>
                  </summary>
                  <div className="demo-import-messages">
                    {conversation.messages.map((message, i) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: identical repeated turns are distinct rows in the ordered transcript.
                      <div key={i} data-role={message.role}>
                        <span>
                          {message.role === 'assistant' ? 'Agent' : 'Customer'}
                        </span>
                        <p>{message.content}</p>
                      </div>
                    ))}
                  </div>
                </details>
              </li>
            )
          })}
        </ol>
      )}
      {oversized && (
        <p className="demo-input-error" role="alert">
          One or more messages exceed 4,000 characters. Shorten those messages
          in the file before importing.
        </p>
      )}
      <div className="demo-import-actions">
        <div>
          <button
            className="demo-primary-action"
            type="button"
            disabled={!valid}
            onClick={() => valid && onRun(conversations)}
          >
            Extract {conversations.length}{' '}
            {conversations.length === 1 ? 'conversation' : 'conversations'}{' '}
            <ArrowRight size={15} />
          </button>
          <button type="button" className="demo-import-back" onClick={onCancel}>
            Choose another input
          </button>
        </div>
        <p>Nothing is saved.</p>
      </div>
    </div>
  )
}
