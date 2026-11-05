# Frontend review checklist

Use this checklist during critique and after seeing screenshots. Mark checks as pass, fail or not applicable; do not claim automatic validation where there is none.

## Brand and originality
- Correct Robo brand, real logo/lockup and requested theme?
- Semantic tokens used for text, surfaces, CTA, borders and focus?
- Approved Roboto / Noto Sans JP type roles, no invented brand palette?
- One context-specific signature, rather than a stock SaaS landing page?
- No decorative gradients, numbered labels, identical cards or pseudo-code without meaning?
- Structure and language reflect the actual user job?

## Layout
- Verify at a narrow mobile viewport (~390px), tablet (~768px) and desktop (~1440px), or the project's official breakpoints.
- Navigation, menus and CTAs work and do not overlap.
- No clipped headings, orphaned Japanese punctuation, tiny captions or horizontal scrolling.
- Layout handles longer Japanese text and realistic empty/dense data.
- Spacing rhythm, alignment, contrast and visual hierarchy stay consistent.

## Interaction and accessibility
- All interactive controls operable by keyboard, with visible focus.
- Body text contrast >= 4.5:1 and relevant non-text / focus indicators >= 3:1 as a baseline.
- Targets are comfortably touchable; follow design-system 44px guidance.
- Meaning is not conveyed by color alone.
- Label/control relationships, landmarks and accessible names are meaningful.
- Motion respects reduced-motion settings.
- Loading, empty, error, success and confirmation states explain the next action.
- Buttons and messages use the same verb for the same action.

## Delivery gate
- Run relevant build/lint/tests and the repo's `npm test` where available.
- Inspect actual screenshots and note which viewport/state was checked.
- Compare with supplied references, not just this checklist.
- State clearly if browser rendering, screenshots or automated accessibility checks were unavailable.
