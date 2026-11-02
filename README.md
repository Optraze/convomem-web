# ConvoMem website

The public marketing site, documentation, blog and changelog for [ConvoMem](https://convomem.com). Built with React, TanStack Start, Vite, Nitro and MDX. Uses Bun and Biome.

## Local development

```sh
bun install --frozen-lockfile
bun run dev
```

## Validation

```sh
bun run check
bun run typecheck
bun run test
bun run build
bun run seo:check
```

`check` formats and lints source files. Content tests protect published SDK documentation, release history, search and metadata. The SEO audit inspects built HTML, canonical and social metadata, JSON-LD, social assets, crawl reachability and draft exclusion. To validate real HTTP responses against a running build:

```sh
PORT=14175 HOST=127.0.0.1 node .output/server/index.mjs
# In another terminal:
bun run seo:check --origin=http://127.0.0.1:14175
```

Published content lives in `src/content/`. Drafts stay out of production routes, bundles, Markdown exports and sitemaps. Regenerate the route tree after adding or removing route files with `bun run generate-routes`.

## Website releases

Website tags are independent of the backend, dashboard and SDK release versions described in the public changelog. This repository's first versioned website release is `v1.0.0`.

Before tagging, validate a clean checkout, review the release diff and confirm that reference screenshots, environment files and unused design experiments are excluded. Publish an annotated tag and a GitHub release only after the release checks pass. Production is hosted on Netlify. A Git tag and a hosting deployment are verified separately.

## Product film

The hero uses the complete existing 2:35 HTML film, muted by default. The soundtrack is copied losslessly from its matching original export and acts as the animation clock. Click the image to play or pause; use the sound button to listen or expand for a larger view. Source and attribution details are in [design/existing-html-film.md](design/existing-html-film.md).

Repository conventions and public-content boundaries are documented in [AGENTS.md](AGENTS.md).
