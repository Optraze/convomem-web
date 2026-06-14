import { getSeoUrl } from './seo'

interface OgImageParams {
  type?: 'default' | 'blog' | 'docs' | 'changelog'
  title?: string
  description?: string
  date?: string
  author?: string
  tags?: string[]
}

export function getOgImageUrl(params: OgImageParams = {}): string {
  const base = getSeoUrl('/api/og')
  const query = new URLSearchParams()

  if (params.type && params.type !== 'default') {
    query.set('type', params.type)
  }
  if (params.title) {
    query.set('title', params.title)
  }
  if (params.description) {
    query.set('description', params.description)
  }
  if (params.date) {
    query.set('date', params.date)
  }
  if (params.author) {
    query.set('author', params.author)
  }
  if (params.tags && params.tags.length > 0) {
    query.set('tags', params.tags.join(','))
  }

  const qs = query.toString()
  return qs ? `${base}?${qs}` : base
}
