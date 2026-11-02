# Interaction motion — 2 November 2026

Motion now follows navigation and user selections:

- Header, logo, footer, and in-page anchors scroll smoothly. Hash navigation uses the router's normal handling; browser history restores immediately. Sticky-header spacing remains in effect. The selected header link gains an animated underline.
- Feature-category changes reveal the panel and stagger the eight capabilities in 24ms increments. Mobile descriptions interpolate their height with CSS grid and rotate the disclosure arrow.
- Analytics question changes animate the heading and chart bars; selecting a bar fades in its example evidence. The figure and live evidence region remain mounted so focus and announcements survive updates.
- Channel examples update with a short text transition. Mobile plan changes, menu opening, and FAQ opening also receive restrained entry motion.
- All new motion is gated by `prefers-reduced-motion: no-preference`; reduced-motion users get immediate scrolling and content updates. Content stays in server-rendered HTML.

## Verification

Chromium checks observed 78 distinct positions during a long header scroll, staggered feature-card animations, interpolated mobile description heights, chart-bar animations, and zero running feature animations with reduced motion enabled. Desktop and phone navigation were exercised. TypeScript, 16 tests, production build, and the 31-page SEO audit pass.

No animation runtime or package was added. The implementation uses CSS and the installed router's documented hash-scroll and restoration options.

References: [TanStack scroll restoration](https://tanstack.com/router/latest/docs/framework/react/guide/scroll-restoration) and [MDN scroll behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scroll-behavior).
