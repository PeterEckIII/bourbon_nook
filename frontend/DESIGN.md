# Design direction

The product design should feel calm and easy to scan.
It should not overwhelm the user with too many actions or information.
Follow the approach - one screen, one core action.

Priorities:

1. Information clarity
2. Strong visual hierarchy
3. Efficient scanning
4. Restrained use of decoration
5. Consistency across workflows

## Visual identity

BourbonNook's aesthetic is a warm, crafted distillery feel — not a generic
SaaS look. Every screen should read as belonging to a whiskey collection app,
not a template.

### Typography

- **Display / headings (`h1`, `h2`, dialog titles):** Caprasimo
  (`font-caprasimo`). Keep it scoped to headings only, not body copy or UI
  chrome.
- **Body copy and UI text:** Fraunces. Never fall back to Arial, Roboto,
  Inter, or an unstyled system-font stack for anything user-facing.
- Numeric data in tables (proof, score, price, ABV) keeps tabular figures
  regardless of body font, so columns stay aligned.

### Color tokens

The custom tokens defined in `index.css`'s `@theme` block are the primary
content palette and take priority for any new UI; check that file for the
current list rather than trusting a snapshot here. Tailwind's built-in
`amber-*` scale is the approved secondary palette for dark chrome (nav,
overlays, admin surfaces) — not arbitrary. Raw hex values outside the token
system should be migrated to a named token rather than copied into new
components, following the existing naming convention (bourbon-production
terms — barrel, char, cask, toast, ...) rather than inventing ad hoc names.

## Components

### Buttons

- One primary button per action group.
- Use secondary buttons for supporting actions.
- Use ghost buttons for low-priority toolbar actions.
- Destructive actions require confirmation.
- Every button and button-styled link goes through
  `src/components/ui/buttonClasses.ts` / `Button.tsx` — see that file for
  the current variants. Never hand-write a new button className string.
- Always set `ringOffset` to match the surface the button actually sits on
  (a `bg-cream` card/dialog vs. the page's `bg-ground`) — a mismatch here
  leaves a visibly wrong focus-ring gap color. This has been a real,
  repeated bug, not a hypothetical: check it explicitly rather than
  copying whatever a neighboring button used.

### Cards

- Cards group related information, not individual text fragments.
- Avoid nesting cards inside cards.
- Use borders by default; reserve shadows for overlays.

### Tables

- Keep headers visible when scrolling long datasets.
- Right-align numeric data.
- Always provide loading, empty and error states.

### Status pills

A status pill's job is to be told apart at a glance, without reading the
label — so it must NOT follow the low-opacity "soft badge" convention used
for `Stat`/highlight boxes elsewhere in this doc. Spread status colors
across visibly different hue AND lightness (on-brand tokens only, never
stock Tailwind green/gray/blue), and keep label text at full opacity — a
washed-out label defeats the point twice over. See
`src/components/Tables/StatusPill.tsx` for the current mapping.

### Not-found / 404

`src/components/ui/NotFound.tsx`, wired as the root route's
`notFoundComponent`, renders inside the normal app layout (nav, fonts,
tokens, button system) instead of the router's bare unstyled default.
Reuse it rather than building a second one.

### Initial load

The auth-resolution boot state (`src/App.tsx`) must never render a blank
page — show a minimal branded loading surface instead, since it's the
first thing every user sees on a hard refresh.

## Motion

- Use motion effects to communicate state changes.
- Keep common transitions between 150ms and 250ms.
- Respect reduced-motion preferences.
- Avoid entrance animations for every element on a page.
- Reserve orchestrated, staggered-reveal motion for a small number of
  high-impact moments — first load of a primary detail, dashboard, or
  list/table view — not routine navigation or list re-renders (sorting/
  filtering a table is local state and must not replay the reveal).
- Prefer CSS-only transitions/animations; reach for a JS motion library
  only when CSS genuinely can't express the effect.
- The shared reveal keyframes/classes already exist in `index.css`
  (`.animate-reveal-*`) — reuse them for any new primary view rather than
  introducing new keyframes or delay values. Interactive controls (buttons,
  edit/action/back links) stay unanimated so they're immediately usable.

## Backgrounds

- Solid `--color-ground` / `--color-cream` fills remain the default for
  content areas (cards, forms, tables) — do not add texture or gradients
  there.
- Dark chrome surfaces (nav, modal backdrops, other full-page chrome) may
  use a subtle gradient or low-opacity texture for atmosphere — the one
  exception to "no unnecessary gradients," because it's chrome, not
  content. See `Navbar.tsx` and the modal backdrops (`ConfirmDialog.tsx`,
  `DeleteAccountDialog.tsx`) for the current treatment; reuse the same
  approach for any new chrome surface rather than inventing a new one.
- Any background treatment must still meet the Accessibility contrast
  requirements below for text placed on it.

## Responsive behavior

- Design desktop, tablet and mobile states intentionally.
- Convert wide tables into scrollable or summarized views.
- Preserve action priority on smaller screens.

## Accessibility

- Meet WCAG AA contrast requirements for content and functional elements.
- All controls must be keyboard accessible.
- Do not communicate meaning through color alone.
- Provide visible focus states.
- Associate validation messages with their fields.

## Things to avoid when creating UI design

- Gradients on content surfaces (cards, forms, tables) — dark chrome is the
  one exception; see Backgrounds above.
- Excessive rounded cards.
- Large decorative hero text inside product screens.
- Arbitrary colors outside the token system.
- Glassmorphism unless explicitly requested.
- Making every section visually prominent.
- Creating new components when an established one exists.
- Falling back to Arial, Roboto, Inter, or an unstyled system-font stack
  for body copy.
