import { useMemo, useState } from 'react'
import { ArrowRight, X } from 'lucide-react'

import type { CsvMapping, CsvTable, MappedConversation } from './extractor'

import { Button } from '@/components/ui/button'

import {
  groupConversations,
  guessMapping,
  MAX_CONVERSATIONS,
} from './extractor'

/* One labelled <select>. Optional fields offer a "— none —" choice. */
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
  onChange: (v: string) => void
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-hint text-[10px] tracking-[0.16em] uppercase">
        {label}
        {!optional && <span className="text-foreground"> *</span>}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-mono bg-background border border-border rounded-md px-2.5 py-2 text-[12px] text-foreground focus:outline-none focus:border-border-strong transition-colors"
      >
        {optional && <option value="">— none —</option>}
        {columns.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <span className="text-hint" style={{ fontSize: '10px' }}>
        {hint}
      </span>
    </label>
  )
}

const BUBBLE = 'max-w-[85%] rounded-lg px-2.5 py-1.5 text-[11.5px] leading-snug'

export function CsvMapper({
  table,
  onRun,
  onCancel,
}: {
  table: CsvTable
  onRun: (convs: MappedConversation[]) => void
  onCancel: () => void
}) {
  const [mapping, setMapping] = useState<CsvMapping>(() =>
    guessMapping(table.columns)
  )
  const set = (k: keyof CsvMapping) => (v: string) =>
    setMapping((m) => ({ ...m, [k]: v }))

  const convs = useMemo(
    () => groupConversations(table, mapping),
    [table, mapping]
  )
  const valid = mapping.messageCol !== '' && convs.length > 0
  const totalRows = table.rows.length

  return (
    <div className="p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="font-mono text-subtle text-[12px]">map columns</span>
          <p className="text-hint mt-0.5" style={{ fontSize: '11px' }}>
            {totalRows} row{totalRows === 1 ? '' : 's'} · matched to{' '}
            {convs.length} conversation{convs.length === 1 ? '' : 's'}
            {convs.length === MAX_CONVERSATIONS
              ? ` (demo caps at ${MAX_CONVERSATIONS})`
              : ''}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={onCancel}
          aria-label="Cancel"
        >
          <X size={14} />
        </Button>
      </div>

      {/* Column mapping controls */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <FieldSelect
          label="Message"
          hint="the text to capture"
          value={mapping.messageCol}
          columns={table.columns}
          onChange={set('messageCol')}
        />
        <FieldSelect
          label="Conversation"
          hint="groups rows into a thread"
          value={mapping.conversationCol}
          columns={table.columns}
          optional
          onChange={set('conversationCol')}
        />
        <FieldSelect
          label="Role"
          hint="user vs. agent"
          value={mapping.roleCol}
          columns={table.columns}
          optional
          onChange={set('roleCol')}
        />
        <FieldSelect
          label="Channel"
          hint="voice · chat · sms · email"
          value={mapping.channelCol}
          columns={table.columns}
          optional
          onChange={set('channelCol')}
        />
      </div>

      {/* Chat-bubble preview, grouped by conversation */}
      <div className="font-mono text-hint text-[10px] tracking-[0.16em] uppercase mb-2">
        preview
      </div>
      {convs.length === 0 ? (
        <p className="font-mono text-subtle text-[11px] py-4">
          No conversations matched — pick the column that holds the message
          text.
        </p>
      ) : (
        <div className="space-y-3 max-h-75 overflow-y-auto scrollbar-hide pr-0.5">
          {convs.map((c, i) => (
            <div
              key={`${c.channel}-${c.messages[0].content}`}
              className="rounded-lg border border-border bg-background overflow-hidden"
            >
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-muted/40">
                <span className="font-mono text-subtle text-[10.5px]">
                  conversation {String(i + 1).padStart(2, '0')}{' '}
                  <span className="text-hint">· {c.channel.toLowerCase()}</span>
                </span>
                <span className="font-mono text-hint tnum text-[10px]">
                  {c.messages.length} msg
                </span>
              </div>
              <div className="px-3 py-2 space-y-1.5">
                {c.messages.slice(0, 6).map((m) => (
                  <div
                    key={`${c.channel}-${m.content}`}
                    className={`flex ${m.role === 'assistant' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`${BUBBLE} ${m.role === 'assistant' ? 'bg-foreground text-background' : 'bg-muted text-foreground'}`}
                    >
                      <span
                        className={`font-mono block text-[9px] tracking-widest uppercase mb-0.5 ${m.role === 'assistant' ? 'text-background/55' : 'text-hint'}`}
                      >
                        {m.role === 'assistant' ? 'agent' : 'user'}
                      </span>
                      {m.content}
                    </div>
                  </div>
                ))}
                {c.messages.length > 6 && (
                  <p className="font-mono text-hint text-[10px] pt-0.5">
                    +{c.messages.length - 6} more turn
                    {c.messages.length - 6 === 1 ? '' : 's'}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center gap-2.5">
        <Button
          type="button"
          onClick={() => valid && onRun(convs)}
          disabled={!valid}
        >
          Run {convs.length} conversation{convs.length === 1 ? '' : 's'}{' '}
          <ArrowRight size={14} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="font-mono text-[11px]"
        >
          cancel
        </Button>
      </div>
    </div>
  )
}
