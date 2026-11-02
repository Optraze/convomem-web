# ConvoMem SEO pass — 2 November 2026

Implemented in the marketing repository, alongside the current light design.

## Changes

- Homepage title and description now describe customer memory and conversation intelligence across voice, chat, SMS, and email.
- Canonical and social identities use the public HTTPS origin consistently. Blog entries declare the article social type; content-specific social images have their own accessible labels.
- Homepage JSON-LD connects WebSite, WebPage, and Service entities to one Organization. Articles reference that organization. JSON-LD serialization escapes HTML delimiters.
- Service markup describes the actual platform. No invented ratings, reviews, customer results, certifications, or software rich-result eligibility claims.
- Fixed the sitemap XML namespace. Kept modification dates sourced from editorial frontmatter, rather than stamping every page with the build date.
- Published Markdown alternatives advertise the corresponding HTML canonical through HTTP Link headers. Exact route rules cover the built Node server; the generated block in public/_headers covers static hosts that support that file. Hand-written header rules are preserved.
- Replaced stale dark social cards with light, cobalt-accented 1200×630 previews and the original logo treatment. The homepage preview uses the visible headline.
- Replaced hard-coded hashed font paths with Vite-resolved Geist preloads on the homepage and docs. Below-fold SDK icons load lazily.
- All 40 capability headings remain in server-rendered homepage HTML, including content in interactive categories. Draft SDK reference content stays out of production HTML, Markdown, and sitemap output.

## Verification

- Baseline: 12 existing tests passed before changes.
- After changes: 16 tests pass; TypeScript and production build pass.
- `bun run seo:check`: checks all 31 published/prerendered pages, unique titles/descriptions, one H1 per page, canonical/social URLs, JSON-LD syntax, 25 social PNGs and dimensions, font assets, internal link targets, capability coverage, static-host canonical rules, and draft exclusion.
- `bun run seo:check --origin=http://127.0.0.1:4175`: additionally checks actual HTTP responses for all published pages and Markdown alternatives, canonical headers/content types, and genuine 404 responses for missing/draft pages.
- For the HTTP audit, run the generated server with `NITRO_HOST=127.0.0.1 NITRO_PORT=4175 node .output/server/index.mjs`. Vite preview serves static assets ahead of Nitro and does not apply Nitro response-header rules.
- Biome reports no errors; existing CSS specificity warnings remain outside this SEO change.
- Social previews were rendered and visually inspected. This audit checks markup and local responses; it does not establish Google indexing, rankings, or field Core Web Vitals.

## After deployment

1. Verify the deployed HTTPS origin, redirects, Markdown canonical headers, sitemap, and robots responses on the actual host.
2. Submit `/sitemap.xml` in the verified Search Console property and inspect the homepage plus a representative docs/article URL. These account actions have not been performed.
3. Collect mobile field performance and Search Console query/impression data before making further SEO claims.
4. Expand useful, source-verified use-case material around customer memory, conversation analytics, and agent handoffs. Use actual implementation examples; publish customer results only with verified evidence.

## Primary references

- [Google: descriptive title links](https://developers.google.com/search/docs/appearance/title-link).
- [Google: canonical URLs, including HTTP Link headers for alternative formats](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
- [Google: sitemap construction and namespace](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
- [Google: homepage WebSite data for site names](https://developers.google.com/search/docs/appearance/site-names).
- [Schema.org: Service properties](https://schema.org/Service).
