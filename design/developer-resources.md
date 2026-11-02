# Developer resources redesign

Redesigned documentation, the journal, and release notes as one resource interface. The homepage and its existing HTML film retain their marketing layout. Published MDX bodies, SDK contracts, release history and canonical metadata are preserved.

Docs use a compact grouped sidebar with a thin active rail, restrained keyboard focus, a readable article column, sticky section navigation and mobile drawers. Code figures now have one connected filename/body frame, visible copy actions, theme-aware syntax and usable phone language tabs. Fixed heading anchors creating empty wrapped lines. SDK language selection remains synchronized and persistent; blocked preference storage no longer breaks it.

The header provides Light, Dark and System appearance choices. Theme bootstrap applies the preference before hydration, validates stored values and handles blocked storage. The provider follows live system changes, synchronizes cross-tab changes, and avoids overwriting the bootstrapped theme before preferences load. Original logo colors follow the actual surface. Both documentation dialogs are themed too.

The blog has a wide editorial index, a native brand cover, article metadata and focused reading pages. The changelog uses version navigation with complete inline release notes, individual release pages and phone version links. Dates render in UTC so date-only metadata stays consistent between server and browser.

References reviewed: [Vercel documentation](https://vercel.com/docs) and [Langfuse documentation](https://langfuse.com/docs), particularly grouped documentation navigation, guide/reference entry points and page-level navigation.

Validation: pre-change baseline 16 tests and typecheck passed. Final 19 tests cover existing publication/SEO/search contracts and theme bootstrap regressions. Typecheck, build and 31-page SEO audit pass. Browser checks cover light/dark rendering, reload persistence, live system changes, keyboard search to a heading, mobile navigation and synchronized code-language changes. Responsive checks include 320, 390, 768 and 1366px widths across resource indexes and detail pages. The check command passes with warnings in existing/copied assets.
