# Specification

## Summary
**Goal:** Fix sidebar/mobile navigation so it smoothly scrolls to the correct in-page sections without redirecting or reloading, and ensures sections aren’t hidden under the sticky header.

**Planned changes:**
- Ensure the landing page contains exactly one element for each required section ID: home, create-wish, templates, marketplace, pricing, dashboard, faq.
- Update sidebar/mobile menu item click handling to use in-page smooth scrolling (no router navigation, no `href="/"`, no `href="#"`), and close the sidebar/sheet after selection.
- Standardize sidebar scrolling behavior to exclusively use the existing `smoothScrollToAnchor(anchorId)` utility, respecting `prefers-reduced-motion`.
- Apply a consistent sticky-header offset by adding a safe scroll margin to all target sections and ensuring the scroll utility accounts for the header height.

**User-visible outcome:** Clicking any sidebar/mobile navigation item smoothly scrolls to the matching section on the current page (and closes the menu), with the section content correctly visible below the sticky header.
