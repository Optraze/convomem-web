import assert from 'node:assert/strict'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

import { featureGroups } from '../src/features/home/feature-catalog'
import { getSeoUrl, SITE_ORIGIN } from '../src/lib/seo'
import { allContentFiles } from './content-files'

const output = resolve('.output/public')
const sitemap = readFileSync(resolve(output, 'sitemap.xml'), 'utf8')
assert(
  sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'),
  'Sitemap must use the official XML namespace.'
)
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => match[1]
)
assert(urls.length > 0, 'Sitemap must contain published pages.')
assert.equal(new Set(urls).size, urls.length, 'Sitemap must not repeat URLs.')

const drafts = allContentFiles({ includeDrafts: true }).filter(
  (file) => file.data.status === 'draft'
)
for (const draft of drafts) {
  const path = `/${draft.type}/${draft.slug}`
  assert(!urls.includes(getSeoUrl(path)), `Draft leaked into sitemap: ${path}`)
  assert(
    !existsSync(resolve(output, `.${path}/index.html`)),
    `Draft HTML was published: ${path}`
  )
  assert(
    !existsSync(resolve(output, `.${path}.md`)),
    `Draft Markdown was published: ${path}`
  )
}

function pageFile(path: string) {
  const candidates =
    path === '/'
      ? ['index.html']
      : [`.${path}/index.html`, `.${path}.html`, `.${path}`]
  return candidates
    .map((path) => resolve(output, path))
    .find((path) => existsSync(path) && statSync(path).isFile())
}

const titles = new Set<string>()
const descriptions = new Set<string>()
const images = new Set<string>()
let linkedPages = 0
const pageLinks = new Map<string, Set<string>>()

for (const url of urls) {
  assert.equal(
    new URL(url).origin,
    SITE_ORIGIN,
    `Noncanonical sitemap origin: ${url}`
  )
  const file = pageFile(new URL(url).pathname)
  assert(file, `Missing prerendered HTML: ${url}. Run bun run build first.`)
  const meta = new Map<string, string[]>()
  const canonicals: string[] = []
  const preloads: string[] = []
  const links: string[] = []
  const structured: string[] = []
  let title = ''
  let titleCount = 0
  let h1Count = 0
  let capabilityCount = 0
  await new HTMLRewriter()
    .on('title', {
      element() {
        titleCount++
      },
      text(chunk) {
        title += chunk.text
      },
    })
    .on('#feature-catalog h3', {
      element() {
        capabilityCount++
      },
    })
    .on('h1', {
      element() {
        h1Count++
      },
    })
    .on('meta', {
      element(element) {
        const key =
          element.getAttribute('name') ?? element.getAttribute('property')
        if (!key) return
        const values = meta.get(key) ?? []
        values.push(element.getAttribute('content') ?? '')
        meta.set(key, values)
      },
    })
    .on('link[rel="canonical"]', {
      element(element) {
        canonicals.push(element.getAttribute('href') ?? '')
      },
    })
    .on('link[rel="preload"][as="font"]', {
      element(element) {
        preloads.push(element.getAttribute('href') ?? '')
      },
    })
    .on('a[href]', {
      element(element) {
        links.push(element.getAttribute('href') ?? '')
      },
    })
    .on('script[type="application/ld+json"]', {
      element() {
        structured.push('')
      },
      text(chunk) {
        structured[structured.length - 1] += chunk.text
      },
    })
    .transform(new Response(readFileSync(file, 'utf8')))
    .text()
  const one = (key: string) => {
    const values = meta.get(key)
    assert.equal(values?.length, 1, `${url}: expected exactly one ${key}`)
    assert(values[0].trim(), `${url}: empty ${key}`)
    return values[0]
  }
  if (new URL(url).pathname === '/')
    assert.equal(
      capabilityCount,
      featureGroups.reduce((sum, group) => sum + group.features.length, 0),
      'Every product capability must exist in the server-rendered homepage.'
    )
  assert.equal(titleCount, 1, `${url}: expected exactly one title`)
  assert.equal(h1Count, 1, `${url}: expected exactly one h1`)
  assert(title.trim(), `${url}: empty title`)
  assert(!titles.has(title), `${url}: duplicate title`)
  titles.add(title)
  const description = one('description')
  assert(!descriptions.has(description), `${url}: duplicate description`)
  descriptions.add(description)
  assert.deepEqual(canonicals, [url], `${url}: incorrect/duplicate canonical`)
  assert.equal(one('og:url'), url, `${url}: incorrect social URL`)
  assert.equal(one('og:title'), title, `${url}: social title mismatch`)
  assert.equal(one('twitter:title'), title, `${url}: Twitter title mismatch`)
  assert.equal(one('og:description'), description)
  assert.equal(one('twitter:description'), description)
  assert.equal(one('og:image:alt'), one('twitter:image:alt'))
  one('og:type')
  assert.equal(one('twitter:card'), 'summary_large_image')
  assert(
    !(meta.get('robots') ?? []).some((value) => /noindex/i.test(value)),
    `${url}: published page marked noindex`
  )
  const image = one('og:image')
  assert.equal(one('twitter:image'), image)
  assert.equal(new URL(image).origin, SITE_ORIGIN)
  images.add(image)
  const imageBytes = readFileSync(
    resolve(output, `.${new URL(image).pathname}`)
  )
  assert.equal(
    imageBytes.subarray(1, 4).toString(),
    'PNG',
    `${url}: invalid social PNG`
  )
  assert.equal(
    imageBytes.readUInt32BE(16),
    1200,
    `${url}: incorrect social width`
  )
  assert.equal(
    imageBytes.readUInt32BE(20),
    630,
    `${url}: incorrect social height`
  )
  assert.equal(one('og:image:width'), '1200')
  assert.equal(one('og:image:height'), '630')
  for (const preload of preloads)
    assert(
      existsSync(resolve(output, `.${preload}`)),
      `${url}: broken font preload ${preload}`
    )
  assert(structured.length > 0, `${url}: missing organization schema`)
  for (const script of structured) JSON.parse(script)
  const destinations = new Set<string>()
  pageLinks.set(url, destinations)
  for (const href of links) {
    const target = new URL(href, url)
    if (target.origin !== SITE_ORIGIN) continue
    const canonicalTarget = getSeoUrl(target.pathname.replace(/\/$/, '') || '/')
    if (urls.includes(canonicalTarget)) destinations.add(canonicalTarget)
    assert(
      pageFile(decodeURIComponent(target.pathname)),
      `${url}: broken internal link ${href}`
    )
  }
  linkedPages++
}

// A valid sitemap is not enough: published pages must be reachable through
// real server-rendered navigation, including the phone disclosure catalogue.
const reachable = new Set<string>()
const queue = [getSeoUrl('/')]
while (queue.length) {
  const current = queue.shift()
  if (!current || reachable.has(current)) continue
  reachable.add(current)
  queue.push(...(pageLinks.get(current) ?? []))
}
for (const url of urls)
  assert(reachable.has(url), `Orphaned public page: ${url}`)
for (const path of ['/blog', '/changelog']) {
  const html = readFileSync(pageFile(path) as string, 'utf8')
  assert(html.includes('CollectionPage'), `${path}: missing archive schema`)
}

const robots = readFileSync(resolve(output, 'robots.txt'), 'utf8')
assert(
  robots.includes(`Sitemap: ${SITE_ORIGIN}/sitemap.xml`),
  'Robots must advertise the canonical sitemap.'
)
assert(
  !/^Disallow:\s*\/\s*$/m.test(robots),
  'Robots must not block the public site.'
)
console.log(
  `SEO audit passed: ${linkedPages} prerendered pages; unique titles/descriptions; canonical/social URLs; JSON-LD; ${images.size} social images; font preloads; internal links and crawl reachability; ${drafts.length} drafts excluded.`
)

const hostHeaders = readFileSync(resolve(output, '_headers'), 'utf8')
for (const file of allContentFiles())
  assert(
    hostHeaders.includes(
      `/${file.type}/${file.slug}.md\n  Link: <${getSeoUrl(`/${file.type}/${file.slug}`)}>; rel="canonical"`
    ),
    `Missing static-host Markdown canonical: ${file.slug}`
  )

// Optional HTTP checks use the built Node entry, not Vite's static preview layer.
const originArg = process.argv.find((arg) => arg.startsWith('--origin='))
if (originArg) {
  const origin = originArg.slice('--origin='.length)
  assert(
    ['http:', 'https:'].includes(new URL(origin).protocol),
    'Use an HTTP origin.'
  )
  await Promise.all(
    urls.map(async (url) => {
      const response = await fetch(new URL(new URL(url).pathname, origin))
      assert.equal(
        response.status,
        200,
        `Published page does not return HTTP 200: ${url}`
      )
      await response.body?.cancel()
    })
  )
  await Promise.all(
    allContentFiles().map(async (file) => {
      const path = `/${file.type}/${file.slug}`
      const response = await fetch(new URL(`${path}.md`, origin))
      assert.equal(response.status, 200, `Markdown missing: ${path}`)
      assert.equal(
        response.headers.get('link'),
        `<${getSeoUrl(path)}>; rel="canonical"`,
        `Missing Markdown canonical header: ${path}`
      )
      assert(
        response.headers.get('content-type')?.startsWith('text/markdown'),
        `Incorrect Markdown content type: ${path}`
      )
      await response.body?.cancel()
    })
  )
  for (const path of [
    '/seo-audit-missing-page',
    '/docs/seo-audit-missing-page',
    ...drafts.flatMap((file) => [
      `/${file.type}/${file.slug}`,
      `/${file.type}/${file.slug}.md`,
    ]),
  ]) {
    const response = await fetch(new URL(path, origin))
    assert.equal(
      response.status,
      404,
      `Unpublished/missing page must return 404: ${path}`
    )
    await response.body?.cancel()
  }
  console.log(
    `HTTP audit passed at ${origin}: published pages, Markdown canonical headers/content types, and genuine 404 responses.`
  )
}
