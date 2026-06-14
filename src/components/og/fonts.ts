import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import type { Font } from 'takumi-js'

const FONT_DIR = join(process.cwd(), 'src/assets/fonts')

let cache: Font[] | null = null

/**
 * Local TTF fonts for OG rendering. takumi/fontdb cannot decode woff2, so we
 * ship variable TrueType files and register the weights we use. Reused by both
 * the runtime /api/og route and the static prerender script.
 */
export function loadOgFonts(): Font[] {
  if (cache) return cache
  const inter = readFileSync(join(FONT_DIR, 'Inter.ttf'))
  const mono = readFileSync(join(FONT_DIR, 'JetBrainsMono.ttf'))
  cache = [
    { name: 'Inter', data: inter, weight: 400, style: 'normal' },
    { name: 'Inter', data: inter, weight: 600, style: 'normal' },
    { name: 'Inter', data: inter, weight: 700, style: 'normal' },
    { name: 'JetBrains Mono', data: mono, weight: 400, style: 'normal' },
  ]
  return cache
}
