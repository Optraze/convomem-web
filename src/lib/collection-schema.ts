import { getSeoUrl, ORGANIZATION_ID, WEBSITE_ID } from './seo'

export function collectionSchema({
  title,
  description,
  path,
  items,
}: {
  title: string
  description: string
  path: string
  items: { title: string; path: string }[]
}) {
  const url = getSeoUrl(path)
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#webpage`,
    name: title,
    description,
    url,
    inLanguage: 'en',
    isPartOf: { '@id': WEBSITE_ID },
    publisher: { '@id': ORGANIZATION_ID },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.title,
        url: getSeoUrl(item.path),
      })),
    },
  }
}
