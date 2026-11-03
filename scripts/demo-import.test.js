import { expect, test } from 'bun:test'

import {
  groupConversations,
  guessMapping,
  parseConversations,
  parseCsvTable,
  SAMPLE_CSV,
} from '../src/features/home/components/demo/extractor-csv'

test('the ready-made sample preserves all five channel-tagged messages', () => {
  const records = parseConversations(SAMPLE_CSV)
  expect(records).toHaveLength(5)
  expect(records.map((r) => r.source)).toEqual([
    'voice',
    'chat',
    'email',
    'chat',
    'voice',
  ])
  expect(records[0].text).toContain('Please email me after 3pm.')
})

test('CSV import preserves quoted multiline messages, quotes, thread grouping and speakers', () => {
  const table = parseCsvTable(
    'conversation_id,role,channel,message\r\ncase1,user,email,"The tank leaks, again.\nIt says ""restart""."\r\ncase1,assistant,email,"I will follow up."'
  )
  const grouped = groupConversations(table, guessMapping(table.columns))
  expect(table.rows).toHaveLength(2)
  expect(grouped).toEqual([
    {
      channel: 'EMAIL',
      messages: [
        { role: 'user', content: 'The tank leaks, again.\nIt says "restart".' },
        { role: 'assistant', content: 'I will follow up.' },
      ],
    },
  ])
})

test('tab-separated imports detect columns without changing channels', () => {
  const table = parseCsvTable(
    '\uFEFFrole\tchannel\tmessage\nuser\tsms\tPlease text the update.\nassistant\tsms\tI will send an update.'
  )
  const grouped = groupConversations(table, guessMapping(table.columns))
  expect(grouped[0].channel).toBe('SMS')
  expect(grouped[1].messages[0].role).toBe('assistant')
})
