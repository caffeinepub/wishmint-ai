# Specification

## Summary
**Goal:** Make Sign In / Sign Up the first experience for unauthenticated users by automatically opening the existing authentication dialog before showing the main app content.

**Planned changes:**
- On initial app load, detect unauthenticated state and automatically open the existing AuthEntryDialog (Sign In / Sign Up) without user interaction.
- De-emphasize or block primary interaction with main sections (Hero/Generator/other content) until the auth dialog is dismissed or authentication completes.
- After successful Internet Identity authentication from the initial dialog, close the dialog automatically and proceed into the app, preserving current post-auth behavior (e.g., existing navigation/scroll behavior where applicable).
- If authentication fails, keep the user in the dialog and display the existing error UI.

**User-visible outcome:** Unauthenticated visitors immediately see the Sign In / Sign Up dialog on arrival; after signing in successfully the dialog closes and the full app is accessible without needing a refresh.
