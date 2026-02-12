# Specification

## Summary
**Goal:** Add Google Analytics (gtag.js) tracking to WishMint AI so it loads on every page view using measurement ID G-ZPB7R21LJ4.

**Planned changes:**
- Include the provided Google tag (gtag.js) snippet in the app’s delivered HTML so it runs on all page loads.
- Update the deployed frontend Content Security Policy (CSP) to allow required Google Analytics resources while keeping existing Internet Identity authentication and app API functionality working.

**User-visible outcome:** Site usage is tracked by Google Analytics (G-ZPB7R21LJ4) without breaking login or existing app behavior.
