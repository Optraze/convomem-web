# Mobile choices — 2 November 2026

Replaced the three marketing dropdowns after visual review showed that the native question menu hid a small set of choices and covered the chart.

- Analytics now uses three visible, directly tappable choices: Customer needs, Needs attention, and Growth signals. The existing desktop question list remains.
- Capability categories use visible wrapping tabs on phones. Full category names remain available as accessible names. Arrow keys, Home, and End retain tab navigation.
- Pricing uses visible plan buttons and a separate Compare all plans action. Responsive CSS now selects the initial mobile card before hydration, avoiding an initial flash of all four plans.
- Controls expose selected/pressed state and retain visible keyboard focus. No native select elements remain on the marketing homepage.

Verified question/chart changes, category changes, Growth pricing ($399/month), all-plan comparison, and desktop restoration. Layout checks at 320, 390, 430, 700, 768, 1024, and 1440px found no page overflow or clipped text. TypeScript, 16 tests, production build, and the 31-page SEO audit pass.

This supersedes the earlier native-select direction in the mobile refinement notes.

## Chart control placement

On single-column layouts (up to 1000px), question controls now sit directly below the bars and above the example evidence. Desktop keeps the controls beside the chart. Phone introductions reserve enough space for each example so changing questions does not move the control row; all three choices had a measured position change of 0px at 390px. Checked placement, single visible control group, and overflow at 320–1440px.

## Visual refinement

The mobile question selector is now a single-line Needs / Attention / Growth row with a sliding blue underline. Removed the cream container, gold borders, nested rounded selection card, and shadow. Full descriptive accessible names remain. Verified switching and narrow layouts from 320px upward.
