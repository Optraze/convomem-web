import {
  getSeoUrl,
  ORGANIZATION_ID,
  SITE_DESCRIPTION,
  SITE_NAME,
  WEBSITE_ID,
  websiteSchema,
} from './seo'

export const homeSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    websiteSchema,
    {
      '@type': 'WebPage',
      '@id': getSeoUrl('/#webpage'),
      url: getSeoUrl('/'),
      name: 'Customer intelligence. With a memory.',
      description: SITE_DESCRIPTION,
      isPartOf: { '@id': WEBSITE_ID },
      about: { '@id': getSeoUrl('/#service') },
      inLanguage: 'en',
    },
    {
      '@type': 'Service',
      '@id': getSeoUrl('/#service'),
      name: SITE_NAME,
      url: getSeoUrl('/'),
      description: SITE_DESCRIPTION,
      serviceType: 'Customer memory and conversation intelligence',
      provider: { '@id': ORGANIZATION_ID },
    },
  ],
}
