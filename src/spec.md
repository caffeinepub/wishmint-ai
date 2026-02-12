# Specification

## Summary
**Goal:** Fix mobile horizontal overflow and the right-side black/empty space on WishMint AI while preserving the current dark premium gradient + neon look.

**Planned changes:**
- Replace the existing viewport meta tag in `frontend/index.html` with: `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />` (no duplicates).
- Add a global overflow-prevention baseline in `frontend/src/index.css` for `html, body` (width/margin reset and `overflow-x: hidden`) and ensure `#root` is full-width with `min-height: 100vh`.
- Ensure the premium dark gradient background is applied to `body` or a single top-level full-width wrapper so it covers the full mobile viewport (without introducing new overflow from `100vw` usage).
- Audit and update layout/section containers to remove non-responsive fixed-width constraints and replace them with mobile-first responsive patterns (`w-full`, optional `max-w-[480px]`, `mx-auto`, and appropriate padding).
- Identify and adjust the specific element(s) causing right-side overflow on mobile (e.g., absolute layers, transforms, or elements wider than the viewport) so no element exceeds the viewport width while keeping existing UI behavior intact.

**User-visible outcome:** On mobile (360px/390px/414px), the site fits the screen with no horizontal scrolling and no black/empty band on the right; the existing dark gradient background fully covers the viewport.
