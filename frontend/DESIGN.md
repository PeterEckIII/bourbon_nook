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

- Unnecessary gradients
- Excessive rounded cards
- Large decorative hero text inside product screens
- Arbitrary colors outside the token system
- Glassmorphism unless explicitly requested
- Making every section visually prominent
- Creating new components when an established one exists
