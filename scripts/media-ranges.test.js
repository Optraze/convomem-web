import { expect, test } from 'bun:test'

import { withMediaRanges } from './media-ranges'

const bytes = Uint8Array.from({ length: 100 }, (_, i) => i)
const response = () =>
  new Response(bytes, {
    headers: { etag: '"film"', 'content-length': '100' },
  })
const request = (range, extra = {}) =>
  new Request('http://localhost/film', {
    headers: { ...(range ? { range } : {}), ...extra },
  })

test('media supports exact, open, suffix and clamped byte ranges', async () => {
  for (const [range, first, last] of [
    ['bytes=10-19', 10, 19],
    ['bytes=95-', 95, 99],
    ['bytes=-5', 95, 99],
    ['bytes=95-999', 95, 99],
  ]) {
    const res = await withMediaRanges(request(range), response())
    expect(res.status).toBe(206)
    expect(res.headers.get('content-range')).toBe(`bytes ${first}-${last}/100`)
    expect([...new Uint8Array(await res.arrayBuffer())]).toEqual(
      [...bytes].slice(first, last + 1)
    )
  }
})

test('media rejects unsatisfiable ranges and respects If-Range', async () => {
  for (const range of ['bytes=100-', 'bytes=20-10', 'bytes=-0']) {
    const res = await withMediaRanges(request(range), response())
    expect(res.status).toBe(416)
    expect(res.headers.get('content-range')).toBe('bytes */100')
    expect((await res.arrayBuffer()).byteLength).toBe(0)
  }
  const changed = await withMediaRanges(
    request('bytes=10-19', { 'if-range': '"old-film"' }),
    response()
  )
  expect(changed.status).toBe(200)
  expect((await changed.arrayBuffer()).byteLength).toBe(100)
  const same = await withMediaRanges(
    request('bytes=10-19', { 'if-range': '"film"' }),
    response()
  )
  expect(same.status).toBe(206)
})

test('media preserves HEAD and conditional responses', async () => {
  const head = await withMediaRanges(
    new Request('http://localhost/film', { method: 'HEAD' }),
    response()
  )
  expect(head.headers.get('accept-ranges')).toBe('bytes')
  expect(head.headers.get('content-length')).toBe('100')
  expect((await head.arrayBuffer()).byteLength).toBe(0)
  const cached = new Response(null, { status: 304 })
  expect(await withMediaRanges(request(), cached)).toBe(cached)
})
