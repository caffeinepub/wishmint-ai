# Specification

## Summary
**Goal:** Add a Google-style sign-in experience by using the existing Internet Identity login flow, with basic authenticated state display and a simple backend “Who am I” verification.

**Planned changes:**
- Add a visible “Sign in” control on the landing experience that triggers `useInternetIdentity().login()` (presented as the app’s Google-based login alternative).
- When authenticated, show an authenticated UI state with a “Sign out” action wired to `useInternetIdentity().clear()`, and display the user’s Principal (or shortened) near the auth controls.
- Display an English login error message when login fails using the existing `loginError`.
- Add a minimal Motoko query method in `backend/main.mo` that returns the caller’s principal.
- When logged in, call the backend method from the frontend via the identity-bound actor from the existing `useActor` hook, and display or non-intrusively log the returned principal; handle anonymous/unauthenticated behavior gracefully.
- Ensure the app remains usable when not logged in (no blocking of generating/copying/sharing wishes).

**User-visible outcome:** Users can sign in and sign out via Internet Identity (as a Google-style login alternative), see their Principal when signed in, and the app continues to work normally without login.
