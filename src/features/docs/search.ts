import type { DocSearchEntry } from './nav'

export interface DocSearchHit {
  slug: string
  title: string
  hash?: string
  label: string
}
export function searchDocs(
  index: DocSearchEntry[],
  text: string
): DocSearchHit[] {
  const query = text.trim().toLowerCase()
  if (!query)
    return index.map((entry) => ({
      slug: entry.slug,
      title: entry.title,
      label: entry.title,
    }))
  const matches: { hit: DocSearchHit; rank: number }[] = []
  for (const entry of index) {
    const title = entry.title.toLowerCase()
    const rank =
      title === query
        ? 0
        : title.startsWith(query)
          ? 1
          : title.includes(query)
            ? 2
            : entry.description.toLowerCase().includes(query)
              ? 4
              : null
    if (rank !== null)
      matches.push({
        rank,
        hit: { slug: entry.slug, title: entry.title, label: entry.title },
      })
    for (const heading of entry.headings) {
      const label = heading.text.toLowerCase()
      if (label.includes(query))
        matches.push({
          rank: label === query ? 3 : 5,
          hit: {
            slug: entry.slug,
            title: entry.title,
            hash: heading.id,
            label: heading.text,
          },
        })
    }
  }
  return matches
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 12)
    .map((item) => item.hit)
}
