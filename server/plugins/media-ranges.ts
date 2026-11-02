import { definePlugin } from 'nitro'

import { SOUNDTRACK_PATH, withMediaRanges } from '../../scripts/media-ranges'

export default definePlugin((app) => {
  const fetch = app.fetch
  app.fetch = (request) => {
    if (
      new URL(request.url).pathname !== SOUNDTRACK_PATH ||
      !['GET', 'HEAD'].includes(request.method)
    )
      return fetch(request)
    return Promise.resolve(fetch(request)).then((response) =>
      withMediaRanges(request, response)
    )
  }
})
