import { readFile, stat } from 'node:fs/promises'
import { resolve } from 'node:path'

import type { Connect, Plugin } from 'vite'

import { SOUNDTRACK_PATH, withMediaRanges } from './media-ranges'

/** Vite preview serves public assets before the Nitro application's handler. */
export function filmAudioServer(): Plugin {
  let root = process.cwd()
  const middleware: Connect.NextHandleFunction = async (req, res, next) => {
    if (
      req.url?.split('?')[0] !== SOUNDTRACK_PATH ||
      !['GET', 'HEAD'].includes(req.method || '')
    )
      return next()
    try {
      const path = resolve(root, `public${SOUNDTRACK_PATH}`)
      const metadata = await stat(path)
      const headers = {
        'content-length': String(metadata.size),
        'last-modified': metadata.mtime.toUTCString(),
        etag: `"${metadata.size}-${metadata.mtimeMs}"`,
      }
      const request = new Request(`http://localhost${SOUNDTRACK_PATH}`, {
        method: req.method,
        headers: {
          ...(req.headers.range ? { range: req.headers.range } : {}),
          ...(req.headers['if-range']
            ? { 'if-range': String(req.headers['if-range']) }
            : {}),
        },
      })
      const response = await withMediaRanges(
        request,
        new Response(req.method === 'HEAD' ? null : await readFile(path), {
          headers,
        })
      )
      res.statusCode = response.status
      response.headers.forEach((value, key) => {
        res.setHeader(key, value)
      })
      res.end(Buffer.from(await response.arrayBuffer()))
    } catch (error) {
      next(error)
    }
  }
  return {
    name: 'film-audio-ranges',
    configResolved(config) {
      root = config.root
    },
    configureServer(server) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    },
  }
}
