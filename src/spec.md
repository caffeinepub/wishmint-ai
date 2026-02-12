# Specification

## Summary
**Goal:** Add tiered subscriptions with entitlement-based feature locking and conversion-focused upgrade UX for WishMint AI, including quota enforcement, premium exports, Surprise Mode, dashboard, marketplace gating, and expanded legal/trust sections (English-only UI text).

**Planned changes:**
- Update plan model to support Free / Pro (₹49/month) / Creator (₹149/month) with a single entitlements source-of-truth for frontend checks.
- Enforce Free plan quota (3 generations per local calendar day): localStorage for anonymous users; backend principal-based tracking for authenticated users; block further generations with an English upgrade prompt.
- Add backend storage + APIs for authenticated subscription status (plan, state, timestamps) and controlled update methods (for future payment verification flows).
- Add Pricing UI upgrade entry points for Pro/Creator via Razorpay (client-side flow stub/placeholder if not fully configurable) without breaking offline core generation.
- Implement entitlement-based locking UX across the app: blurred/disabled locked features, “Unlock Premium” action, and a pricing comparison modal including CTA text exactly: “Create Something She Will Never Forget 💖”.
- Extend download/export behavior by plan: Free exports include a WishMint AI watermark; Pro/Creator exports remove watermark and allow HD size selection (1080x1080 and 9:16); block premium-only exports on Free and route to upgrade modal.
- Add “Download as PDF” option (at minimum: Main Wish + WishMint AI branding), applying plan rules for watermark/no-watermark and handling failures with actionable English errors.
- Add Surprise Mode (Pro/Creator only): generate a private link that opens a dedicated surprise view with animated confetti, name reveal animation, message fade-in, and toggleable/mutable romantic background music; store payload so the link renders without the generator form.
- Improve homepage conversion UI: change hero CTA to exactly “✨ Create Magic Now”; add social proof text exactly “3,000+ Wishes Generated Today”; add a premium badge element; add an accessible pricing comparison table (section and/or modal).
- Add an authenticated Dashboard section showing subscription status/plan (from backend), remaining Free credits, download history, saved templates, and Creator earnings panel (placeholder if needed).
- Update marketplace behavior for Creator plan: restrict listing creation to Creator (Free/Pro can browse); add creator-facing tracking of listing interactions/downloads in dashboard or listing UI; label payouts as “Coming soon” if not implemented.
- Add/expand legal & trust sections: Terms & Conditions and Refund Policy (alongside existing Privacy Policy and Contact), styled consistently and fully in English.

**User-visible outcome:** Users can choose and see Free/Pro/Creator plans, experience clear premium locks and upgrade prompts, upgrade via Razorpay entry points (or see clear configuration messaging), use plan-appropriate downloads (watermark/HD/PDF), generate Surprise Links on Pro/Creator, and access a post-login dashboard and marketplace creator tools consistent with their plan, with updated homepage conversion elements and complete legal sections.
