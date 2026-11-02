# Marketing and docs refinement — 2 November 2026

Preserved the warm ivory, cobalt, butter-yellow palette and original light-surface ConvoMem logo. Replaced the rejected bitmap hero with an HTML/CSS conversation-to-memory illustration. The headline now identifies the product: “Customer intelligence. With a memory.” Switched marketing and docs to self-hosted Geist with upright headings. Fontsource's OFL license is included under public/fonts.

## Phone decisions

- One full-width primary hero CTA, a quieter demo action, and signup available in the navigation menu.
- A compact hero example and a focused customer profile replace the larger desktop compositions.
- Native question/category selectors, expandable capability descriptions, and one selected pricing plan reduce the initial reading load. All capabilities and a compare-all-plans option remain accessible.
- Charts retain clearly labelled illustrative counts, readable bars, and selectable fictional evidence.
- Cookie consent uses shorter phone copy, larger controls, and measured page padding so the banner cannot cover the footer.
- Docs use a modal navigation drawer, an expandable article outline that closes after navigation, a visible search close control, and readable article/code layouts. The drawer close control remains visible while scrolling.

## Documentation and quality

The docs overview adds a quick-start entry and direct SDK/MCP links. Technical MDX content, API/SDK contracts, pricing, and the 40-capability inventory were preserved.

Search prioritizes exact document titles above descriptions and section matches. Three regression tests cover ranking, heading anchors, and bounded results. All 12 tests, TypeScript, and the production build passed; Biome passes with non-blocking style warnings. Routes were regenerated and 31 public routes prerendered.

Verified phone feature expansion, category selection, plan switching/comparison, chart evidence selection, cookie height/padding, and no page overflow or clipped headings at 320px. Verified exact-title search navigation, phone outline jumps/automatic closure, drawer operation and focus restoration. Native browser screenshots were used for visual review after headless screenshot capture proved unreliable.

Local preview only; no production deployment or live model requests were performed.
