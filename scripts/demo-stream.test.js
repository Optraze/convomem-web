import { expect, test } from 'bun:test'

import {
  readDemoStream,
  readInsights,
} from '../src/features/home/components/demo/demo-stream'

function stream(text, size = 1) {
  const bytes = new TextEncoder().encode(text)
  return new Response(
    new ReadableStream({
      start(controller) {
        for (let i = 0; i < bytes.length; i += size)
          controller.enqueue(bytes.slice(i, i + size))
        controller.close()
      },
    }),
    { headers: { 'content-type': 'text/event-stream' } }
  )
}
async function collect(response) {
  const events = []
  for await (const event of readDemoStream(response)) events.push(event)
  return events
}

test('live stream survives split Unicode and CRLF framing and requires completion', async () => {
  const events = await collect(
    stream(
      'event: fact\r\ndata: {"fact":{"content":"Café customer"}}\r\n\r\nevent: done\r\ndata: {}\r\n\r\n'
    )
  )
  expect(events.map((e) => e.event)).toEqual(['fact', 'done'])
  expect(events[0].data.fact.content).toBe('Café customer')
  await expect(
    collect(stream('event: fact\ndata: {"fact":{}}\n\n'))
  ).rejects.toThrow('interrupted')
})

test('server errors are terminal and HTML or malformed streams cannot look successful', async () => {
  const events = await collect(
    stream(
      'event: error\ndata: {"message":"Budget reached"}\n\nevent: done\ndata: {}\n\n',
      100
    )
  )
  expect(events.map((e) => e.event)).toEqual(['error'])
  await expect(
    collect(new Response('<html>proxy error</html>'))
  ).rejects.toThrow('Invalid demo response')
  await expect(
    collect(stream('event: done\ndata: not-json\n\n'))
  ).rejects.toThrow()
})

test('model insight metadata stays renderable and bounded', () => {
  expect(
    readInsights({
      overallSentiment: 'surprised',
      sentimentScore: Infinity,
      insights: [null, {}, { type: 'complaint', summary: 'Leak' }],
      summary: {},
    })
  ).toEqual({
    overallSentiment: 'NEUTRAL',
    sentimentScore: 0,
    insights: [{ type: 'complaint', summary: 'Leak' }],
    summary: '',
  })
  expect(
    readInsights({ overallSentiment: 'negative', sentimentScore: -7 })
      .sentimentScore
  ).toBe(-1)
})
