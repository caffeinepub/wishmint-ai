# Specification

## Summary
**Goal:** Add a pre-login “Demo mode” so anonymous users can try generating a Birthday Pack locally without signing in or selecting a plan.

**Planned changes:**
- Add a clear pre-login entry point to start Demo mode (e.g., “Try Demo” CTA in the Hero and/or Generator sections) with English demo-labeled messaging.
- Implement Demo mode onboarding that pre-fills the generator with realistic example data and auto-generates a Birthday Pack, then scrolls the user to the generator/outputs.
- Update generator gating so Demo mode bypasses authentication/plan requirements for core actions (at minimum: Generate and Surprise Me) while keeping existing authenticated flows unchanged.
- Keep advanced/auth-only actions disabled for anonymous Demo mode users and show clear English prompts indicating sign-in is required when those actions are unavailable.

**User-visible outcome:** Signed-out users can start a Demo mode from the landing experience, immediately see a generated Birthday Pack using pre-filled sample data, and use core generator actions offline; advanced features remain sign-in gated with clear English prompts.
