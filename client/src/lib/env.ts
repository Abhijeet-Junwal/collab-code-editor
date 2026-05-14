const isProd = process.env.NODE_ENV === "production";
const fallbackBackendUrl = "http://localhost:8001";

export const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || (isProd ? "" : fallbackBackendUrl);

if (!backendUrl) {
  console.warn(
    "[env] NEXT_PUBLIC_BACKEND_URL is not set in production; requests may fail"
  );
}

/*
 * ===========================================================================================
 *                              NOTES — env.ts
 * ===========================================================================================
 *
 * PURPOSE: Resolves the backend URL for the frontend based on the environment.
 * ROLE IN ARCHITECTURE: Frontend Utility/Config Layer.
 * 
 * IMPORTS: None.
 * 
 * FUNCTION-BY-FUNCTION ANALYSIS:
 * - `Global Execution Context`
 *   - Does: Determines if the app is in production (`NODE_ENV === "production"`). Sets `backendUrl` from `NEXT_PUBLIC_BACKEND_URL`, falling back to `http://localhost:8001` in development. Logs a warning if missing in production.
 * 
 * HOW THIS FILE CONNECTS TO OTHER FILES:
 * - Inbound: Imported by `socket.ts` and potentially API fetch wrappers to know where to send requests.
 * 
 * DESIGN PATTERNS:
 * - Environment Fallback Pattern: Provides a sensible default for local development so devs don't need to configure `.env` files just to spin up the UI.
 * 
 * POTENTIAL INTERVIEW QUESTIONS:
 * 1. Why must the environment variable be prefixed with `NEXT_PUBLIC_`?
 *    - Answer: In Next.js, only variables prefixed with `NEXT_PUBLIC_` are bundled into the client-side JavaScript. Without it, the variable would only be accessible on the server during SSR/SSG.
 */
