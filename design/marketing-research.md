# ConvoMem marketing design research

Reviewed 2 November 2026. Sources were opened live; Langfuse and Vercel were also inspected in a browser at 1440px, including below the fold and animation behavior.

## References and observations

- [Langfuse](https://langfuse.com/): page-wide grid guides, editorial type, clear section boundaries, product surfaces shown at meaningful scale. Its sidebars are appropriate to its content-heavy product; ConvoMem does not need to copy that navigation density.
- [Vercel](https://vercel.com/): a single brand-led hero animation, limited visual competition, simple calls to action, large feature demonstrations. Its current dark theme is not the theme direction for ConvoMem.
- [Geist grid](https://vercel.com/geist/grid): rule lines belong to the composition, guide intersections should not accumulate, breakpoints must be explicitly designed. Decorative guides are hidden from assistive technology.
- [Geist typography](https://vercel.com/geist/typography): distinct heading, label, and copy scales. Body copy needs enough size and line height to read; tiny monospaced text is a supporting detail.
- [Geist colors](https://vercel.com/geist/colors): gray is the default for text, dividers, and surfaces. Solid borders are drawn once; shadows remain translucent.
- [Attio](https://attio.com/): its publicly rendered homepage connects customer outcomes with concrete product examples. Studied the content and sequence; a reliable visual browser capture was unavailable.
- [Resend](https://resend.com/): concise developer positioning and an integration example appear before deeper feature detail.

## Implementation direction

Light theme, original light-surface ConvoMem logo, graphite text, restrained blue for active product state. No fabricated customer logos, endorsements, usage numbers, or speed metrics.

Use a wide, open composition with section dividers and a consistent type scale. Give the hero one custom canvas visual based on the ConvoMem memory mark. Use a substantial, interactive capture → memory → recall demonstration to explain the product. Follow with specific outcomes, integration, security, pricing, and questions.

Motion should communicate flow and state: a low-cost, viewport-aware hero field; a pausable product story; short reveal transitions. Respect reduced-motion preferences, suspend background work offscreen, keep controls accessible by keyboard, and retain useful static content without animation.

## Review criteria

- Does the first screen identify the product and one next action?
- Are headings, prose, and product labels readable at their actual rendered size?
- Does every large visual explain a real product concept?
- Is the grid continuous and are boundaries drawn only once?
- Do animated states work when paused, offscreen, or reduced-motion is enabled?
- Are conversion actions, docs, pricing, mobile navigation, and the existing live demo still functional?


## Optraze refinement — 2 November 2026

The user selected [Optraze](https://optraze.com/) as the preferred reference for width and whitespace. Inspected its live homepage in a browser and its local public layout source. Observed a full-width page, a 1280px container, a near-full-viewport hero, roughly 112–130px desktop section padding, and Space Grotesk display headings around 72–76px.

Adapted ConvoMem with wider open sections, more vertical space, a stronger display/body hierarchy, and the same self-hosted display typeface from the user's Optraze project. The original ConvoMem logo remains in the correct light-surface colors. This is an adaptation of layout and typography, not a copy of Optraze's product copy or animated background.

## Feature inventory — implementation evidence

The marketing catalogue groups 40 capabilities into five categories. This is a source-based feature inventory; it does not claim that a new release was deployed or establish model quality. Plan gates and supported operations still apply.

| Group | Main evidence reviewed | Marketing boundaries |
| --- | --- | --- |
| Customer memory | `convoMem/docs/PRODUCT.md`; customer/capture routes and customer-memory service; public capture/retrieval/memory-model docs | Capture acceptance is asynchronous. Patterns require review. Source, speaker, versions and lifecycle remain distinct. |
| Intelligence & analytics | Analytics chat and Insights UI; insights routes; knowledge-gap, answer-consistency and scorecard evidence in `docs/PROGRESS.md` and `RC_PARITY_TRACEABILITY_2026-10-11.md` | Knowledge gaps and consistency are review signals. Scorecards are evidence-linked and do not automatically rank employees. No quality/accuracy benchmark claims. |
| Agent workflows | Handoff/embed docs; Leads, AgentSettings and Insights UI; leads/insights/customer routes | Routing resolves a configured destination. Embeds are scoped. Customer and agent-authored memory remain distinct. |
| Developer platform | Published TypeScript/Python/Rust, capture, MCP, webhooks and embed docs; ingestion/export/playground/request-log routes and UI | Dashboard-only analytics, exports, logs and settings are not advertised as public SDK methods. |
| Security & control | Product security docs; organization/agent boundaries; Settings/Team/Billing UI; plan data | Availability varies by plan. On-premises is on request. No SOC certification, automatic residency selection, or unsupported provider/BYOK claim. |

Excluded a per-agent BYOK/provider claim: the inspected provider configuration and routing tests demonstrate deployment-level OpenAI/Azure routing, not a completed customer-facing per-agent credential feature. Excluded future or unverified capabilities and internal implementation details that do not help a marketing visitor make a decision.


## Verification

- TypeScript check and all 9 Bun content contract tests passed.
- Full Biome check exited successfully with 58 style/lint warnings; unsafe suggested fixes were not applied. Final touched TSX files passed their scoped check.
- Production build prerendered 31 routes. No production deployment was performed.
- Browser checks covered the five feature categories, keyboard tab navigation, analytics questions, mobile navigation and Escape focus restoration.
- Demo input, streamed facts, five-conversation CSV mapping/results, offline fallback and rate limiting were tested against a temporary local SSE fixture. These tests do not claim a live model or memory-quality evaluation; the actual API hook was preserved.
- Checked widths 320, 390, 768, 1024 and 1440px, full-screen mobile dialog, 16px mobile input, light branding under an OS dark preference, reduced motion, and a clean browser error log.
