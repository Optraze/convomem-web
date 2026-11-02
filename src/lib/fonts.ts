import geistLatinUrl from '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url'

/** Vite resolves the actual asset hash; filenames must not be hard-coded. */
export const geistFontPreload = {
  rel: 'preload',
  href: geistLatinUrl,
  as: 'font',
  type: 'font/woff2',
  crossOrigin: 'anonymous' as const,
}
