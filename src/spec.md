# Specification

## Summary
**Goal:** Make all upgrade actions open an in-app pricing modal first, with an explicit in-modal confirmation before starting Razorpay, and prevent any full-page navigation during payment initiation.

**Planned changes:**
- Update all upgrade entry points (e.g., “Upgrade to Pro/Creator”, “Unlock Premium”, “Upgrade Plan”) to only open `PricingComparisonModal` and keep the user on the current page (no external/checkout navigation on first click).
- Modify `PricingComparisonModal` so selecting a plan shows an in-modal confirmation step; only an explicit “Proceed to payment” (or equivalent) action initiates Razorpay.
- Adjust `useRazorpayUpgrade` client behavior to avoid any full-page redirects; if checkout cannot open (e.g., SDK/config missing), show a clear English error toast and keep the app usable.

**User-visible outcome:** Clicking any upgrade button opens the in-app pricing modal; choosing a plan requires a confirmation inside the modal before payment begins, and payment failures show an English error without navigating away from the app.
