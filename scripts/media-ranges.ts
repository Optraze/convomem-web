/** Give the film's audio real byte ranges on Node/Vite; CDNs serve it directly. */
export const SOUNDTRACK_PATH = '/media/convomem-film/soundtrack.m4a'

export async function withMediaRanges(request: Request, response: Response) {
  if (response.status !== 200) return response
  const headers = new Headers(response.headers)
  headers.set('Accept-Ranges', 'bytes')
  headers.set('Content-Type', 'audio/mp4')
  if (request.method === 'HEAD')
    return new Response(null, { status: 200, headers })

  const bytes = new Uint8Array(await response.arrayBuffer())
  headers.set('Content-Length', String(bytes.byteLength))
  const range = request.headers.get('range')
  const ifRange = request.headers.get('if-range')
  const lastModified = headers.get('last-modified')
  const validatorMatches =
    !ifRange ||
    ifRange === headers.get('etag') ||
    (!!lastModified &&
      Number.isFinite(Date.parse(ifRange)) &&
      Date.parse(ifRange) >= Date.parse(lastModified))
  // A server may ignore malformed or multipart ranges and return the full body.
  const match = validatorMatches && range?.match(/^bytes=(\d*)-(\d*)$/)
  if (!match || (!match[1] && !match[2]))
    return new Response(bytes, { status: 200, headers })

  const size = bytes.byteLength
  const start = match[1]
    ? Number(match[1])
    : Math.max(0, size - Number(match[2]))
  const end = match[1]
    ? match[2]
      ? Math.min(size - 1, Number(match[2]))
      : size - 1
    : size - 1
  if (
    !Number.isSafeInteger(start) ||
    !Number.isSafeInteger(end) ||
    start >= size ||
    end < start ||
    (!match[1] && Number(match[2]) === 0)
  ) {
    headers.set('Content-Range', `bytes */${size}`)
    headers.set('Content-Length', '0')
    return new Response(null, { status: 416, headers })
  }
  headers.set('Content-Range', `bytes ${start}-${end}/${size}`)
  headers.set('Content-Length', String(end - start + 1))
  return new Response(bytes.slice(start, end + 1), { status: 206, headers })
}
