# Typography and responsive layout — 2 November 2026

The marketing site and reading pages now share Geist for interface and prose. JetBrains Mono remains for code. The new `src/features/home/responsive.css` holds the shared fluid type scale and viewport composition rules after the existing component styles.

- Hero tracking changed from −0.065em to −0.045em, with a lighter 550 weight and more line spacing. The display size scales fluidly and stops growing on wide monitors.
- Section headings share a consistent scale, line height, and tracking. Body copy uses readable measures and 1.75–1.8 line spacing. Small labels no longer shrink to 5–9px in the revised product visual.
- Pages cap their content width at 1600px. Laptop hero spacing responds to short windows; the redundant visual footer gives way so the important content fits comfortably.
- Tablet portrait uses a stacked hero and roomier section layouts. Mobile keeps its dedicated CTA hierarchy, compact visual, feature disclosure, and plan selector.
- Navigation collapses earlier, and an open mobile menu closes when the full navigation becomes visible after resizing.
- Docs use larger prose/code text, constrained reading widths, 44px navigation/search targets, and horizontally scrollable language tabs. Shared footer links wrap under enlarged text; the decorative wordmark fits small screens.

## Verification

Chromium viewport checks covered the homepage at 320×740, 390×844, 430×932, 640×900, 768×1024, 844×390, 900×900, 1024×768, 1280×720, 1366×768, 1440×900, 1920×1080, and 2560×1440. No page-width overflow or clipped headings/body/control text was detected at normal text size.

Docs overview, Capture, TypeScript SDK, Contact, and Blog were checked at 320, 390, 768, 1024, 1440, and 2560px. Root text enlargement to 200% was checked on the 390px homepage and Capture article, including contained code/tab scrolling. These are browser checks, not physical-device certification.

Production checks include mobile plan selection/comparison, capability selection/disclosure, menu resizing, and visual inspection of phone/tablet/laptop/desktop screenshots. The build, TypeScript, 16 existing tests, and 31-page SEO audit pass. Existing specificity warnings in the older CSS remain; the new responsive stylesheet passes Biome without warnings.
