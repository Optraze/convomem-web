import { resolve } from 'node:path'

import { allContentFiles } from './content-files'

/** Route filtering alone leaves eager-imported draft prose in public JS bundles.
 * Replace draft MDX with an inert module before the existing compiler in builds.
 * Development keeps the original local preview; no new runtime dependency.
 * Vite load/enforce hooks: https://vite.dev/guide/api-plugin.html
 */
export function draftContentPlugin(command: string) {
  if (command !== 'build') return null
  const drafts = new Set(
    allContentFiles({ includeDrafts: true })
      .filter((file) => file.data.status === 'draft')
      .map((file) => resolve(file.path))
  )
  return {
    name: 'exclude-draft-content',
    enforce: 'pre' as const,
    load(id: string) {
      if (!drafts.has(id.split('?')[0])) return undefined
      return '---\ntitle: "Unpublished"\ndescription: "Unpublished content"\nstatus: "draft"\n---\n'
    },
  }
}
