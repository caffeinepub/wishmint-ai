# Specification

## Summary
**Goal:** Improve single-page navigation and scrolling UX with a sticky, branded navbar, section anchors, active highlighting, scroll progress, and mobile-friendly floating actions.

**Planned changes:**
- Add a sticky top navigation bar styled to match the existing WishMint premium dark + neon (purple/green) gradient branding, with menu items: Home, Create Wish, Templates, Marketplace, Pricing, Dashboard, FAQ.
- Add/ensure section anchor IDs exist exactly as: home, create-wish, templates, marketplace, pricing, dashboard, faq; implement smooth scrolling with sticky-header offset so headings aren’t hidden.
- Implement active-section highlighting in the navbar that updates smoothly and avoids flicker near section boundaries.
- Add a thin scroll progress indicator bar at the very top of the viewport with a smooth, branded gradient fill reflecting scroll percentage.
- Add a floating “Back to Top” button (bottom-right) that appears after ~30% scroll and smoothly scrolls to Home; keep it mobile-safe and non-obstructive.
- Add a floating quick action button labeled exactly “🎂 Create Wish” that smoothly scrolls to the Wish Generator section (create-wish), with mobile-safe placement.
- Add mobile optimization: collapse navbar into a hamburger menu at mobile breakpoints; menu opens/closes cleanly, closes on selection, and preserves smooth anchor scrolling without pointer-events/overlay issues.
- Ensure any new user-facing text is English and that new UI elements do not introduce horizontal overflow or regress existing section layouts; preserve existing /pricing behavior (scroll to Pricing and open the pricing modal).

**User-visible outcome:** Users can navigate the page via a sticky navbar (desktop and mobile hamburger), see which section they’re in, track scroll progress, and quickly jump to the top or directly to “🎂 Create Wish” with smooth, branded scrolling.
