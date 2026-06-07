export const SITE_ORIGIN = 'https://convomem.com'
export const SITE_NAME = 'ConvoMem'
export const SITE_TITLE = 'ConvoMem — AI Memory for Customer Conversations'
export const SITE_DESCRIPTION =
  'ConvoMem is an enterprise memory layer for conversational AI. Capture, store, and inject customer context into every voice, chat, and support interaction.'

export function getSeoUrl(path = '/') {
  return import.meta.env.PROD ? new URL(path, SITE_ORIGIN).toString() : path
}
