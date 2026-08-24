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
  (`font-caprasimo`). Already in use — keep it scoped to headings only, not
  body copy or UI chrome.
- **Body copy and UI text (paragraphs, labels, table cells, form fields,
  nav links):** Fraunces, replacing the current fallback to Tailwind's
  default sans stack. Use Fraunces' optical-size axis rather than a single
  static cut — smaller/denser text (tables, form inputs) should pull the
  low end of the axis for legibility; larger body text (cards, empty
  states) can sit higher for more character.
- Never fall back to Arial, Roboto, Inter, or an unstyled system-font stack
  for anything user-facing.
- Numeric data in tables (proof, score, price, ABV) keeps tabular figures
  (`font-variant-numeric: tabular-nums`) regardless of body font, so columns
  stay aligned.

### Color tokens

The custom tokens in `index.css` (`--color-ground`, `--color-cream`,
`--color-ink`, `--color-terracotta`, `--color-pour`, `--color-barrel`,
`--color-char`, `--color-cask`, `--color-toast`) are the primary content
palette and take priority for any new UI. Tailwind's built-in `amber-*`
scale is the approved secondary palette for dark chrome (nav, overlays,
admin surfaces) — its existing use in `Navbar.tsx` is intentional, not
arbitrary. `barrel`/`char` cover the nav's dark-brown chrome; `cask`/`toast`
cover form-input dark backgrounds (base / hover-active). Raw hex values
outside all of these should be migrated to a named token rather than
copied into new components — add new tokens by the same naming convention
(bourbon-production terms) rather than inventing ad hoc names.

## Components

### Buttons

- One primary button per action group.
- Use secondary buttons for supporting actions.
- Use ghost buttons for low-priority toolbar actions.
- Destructive actions require confirmation.

### Cards

- Cards group related information, not individual text fragments.
- Avoid nesting cards inside cards.
- Use borders by default; reserve shadows for overlays.

### Tables

- Keep headers visible when scrolling long datasets.
- Right-align numeric data.
- Always provide loading, empty and error states.

## Motion

- Use motion effects to communicate state changes
- Keep common transitions between 150ms and 250ms.
- Respect reduced-motion preferences.
- Avoid entrance animations for every element on a page.
- Reserve orchestrated, staggered-reveal motion (e.g. a bottle detail page's
  content easing in top-to-bottom) for a small number of high-impact
  moments — first load of a primary detail or dashboard view — not
  routine navigation or list re-renders.
- Prefer CSS-only transitions/animations; reach for a JS motion library only
  when CSS genuinely can't express the effect.
- Implemented as `.animate-reveal-1/2/3` in `index.css` (a shared
  `@keyframes reveal` fade-and-rise, staggered at 0/100/200ms, `both` fill
  mode, disabled entirely under `prefers-reduced-motion: reduce`). Applied
  to exactly 3 top-to-bottom groups on the bottle detail, review detail, and
  admin dashboard routes — image/identity header, primary content, then
  secondary sections. Interactive controls (buttons, edit/action links,
  back links) are intentionally left unanimated so they're immediately
  usable. Reuse these same three classes for any future primary
  detail/dashboard view rather than introducing new keyframes or delay
  values.
- Also applied (2 groups: `reveal-1`/`reveal-2`) to the primary list/table
  views — `/bottles`, `/reviews`, `/admin/users` — page header as group 1,
  the table (or its empty state) as group 2. This is safe against the
  "not routine list re-renders" rule above because search/sort/filter on
  these tables is local component state that never unmounts the table
  container — the CSS animation only fires on the container's true first
  mount (landing on the route), not on every keystroke or sort click. Do
  not add per-row stagger; that would violate "avoid entrance animations
  for every element on a page."

## Backgrounds

- Solid `--color-ground` / `--color-cream` fills remain the default for
  content areas (cards, forms, tables) — do not add texture or gradients
  there.
- Dark chrome surfaces (nav, modals-on-overlay, empty/error states) may use
  a subtle gradient or low-opacity texture for atmosphere, as the nav
  already does — this is the one place "unnecessary gradients" doesn't
  apply, because it's chrome, not content.
- Any background treatment must still meet the Accessibility contrast
  requirements below for text placed on it.
- Implemented on the modal backdrops (`ConfirmDialog.tsx`,
  `DeleteAccountDialog.tsx`): `backdrop:bg-radial backdrop:from-char/50
  backdrop:via-barrel/60 backdrop:to-barrel/80`, replacing a flat
  `ink/40` scrim with a warm vignette using the same tokens as the nav.
  The dialog box itself stays untouched (`bg-cream`, content surface).
  No other chrome surfaces exist yet to treat — the app currently has no
  full-page error/404 page or loading overlay; empty states
  ("No bottles yet", etc.) are inline content, not chrome, so they keep
  their `bg-cream`/tint fills. Apply this same `backdrop:bg-radial
  backdrop:from-char/50 backdrop:via-barrel/60 backdrop:to-barrel/80`
  pattern to any future modal, and to a 404/error page if one is built,
  rather than a flat color.

## Responsive behavior

- Design desktop, tablet and mobile states intentionally.
- Convert wide tables into scrollable or summarized views.
- Preserve action priority on smaller screens.

## Accessibility

- Meet WCAG AA contrast requirements for content and functional elements
- All controls must be keyboard accessible.
- Do not communicate meaning through color alone.
- Provide visible focus states.
- Associate validation messages with their fields.

## Things to avoid when creating UI design

- Gradients on content surfaces (cards, forms, tables) — dark chrome is the
  one exception; see Backgrounds above
- Excessive rounded cards
- Large decorative hero text inside product screens
- Arbitrary colors outside the token system
- Glassmorphism unless explicitly requested
- Making every section visually prominent
- Creating new components when an established one exists
- Falling back to Arial, Roboto, Inter, or an unstyled system-font stack
  for body copy — use Fraunces per Visual identity above
