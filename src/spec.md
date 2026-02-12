# Specification

## Summary
**Goal:** Add a new prompt-based “Create Card With AI Prompt” studio mode alongside the existing Quick Form Mode, enabling multi-event card generation with 3 design variations, editable results, and premium export rules.

**Planned changes:**
- Add a clear mode toggle between “Quick Form Mode” (existing birthday form flow) and “Create Card With AI Prompt” (new prompt flow).
- Build Prompt Mode UI: a main prompt textbox with placeholder “Describe your card or invitation idea...” plus clickable example prompts that prefill the textbox and validation to prevent empty generation.
- Implement a deterministic, rule-based prompt analysis step to detect and display/store event type, tone, visual theme keywords, and layout style (with sensible defaults when ambiguous).
- Generate structured, sanitized card text for Prompt Mode (title/headline, short message, footer branding) and remove instruction-like phrases from rendered output.
- Update preview/export text logic to be event-adaptive (not hardcoded to birthdays) and support multiple event types without showing “Happy Birthday” unless the event is Birthday.
- Generate exactly 3 Prompt Mode design variations per run with distinct composition/typography/color treatments while enforcing layout safety (title, decorative focus element, message, footer branding; no overlap/clutter).
- Add event-adaptive auto-theming (e.g., Birthday vs Wedding vs Corporate vs Baby Shower) with the ability for users to manually override theme selection.
- Add Prompt Mode edit controls: edit title/message/footer, change tone, switch theme, keep prompt visible/editable, and regenerate to produce a fresh set of 3 variations.
- Apply existing premium entitlement rules to Prompt Mode exports (free: limited resolution and watermark; premium: HD export with watermark removed; preserve existing sign-in gating).
- Add premium-area “Coming Soon” UI placeholders for “Video invitation” and “Voice message” (no real capture/playback).
- Adjust Output section copy so Prompt Mode uses neutral multi-event labeling, while Quick Form Mode retains the existing birthday-pack labels and presentation.

**User-visible outcome:** Users can switch between Quick Form Mode and a new prompt-driven card studio, enter a natural-language prompt to generate 3 editable, event-appropriate card variations, and export with free vs premium download rules (plus premium “coming soon” items shown).
