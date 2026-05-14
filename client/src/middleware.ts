import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

/*
 * ===========================================================================================
 *                              NOTES — middleware.ts
 * ===========================================================================================
 *
 * PURPOSE: Intercepts incoming requests before they hit Next.js routing, specifically to enforce authentication via Clerk.
 * ROLE IN ARCHITECTURE: Edge Middleware Layer. Runs on Vercel Edge / Node Edge to protect routes.
 * 
 * IMPORTS:
 * - `clerkMiddleware`: Clerk's provided middleware function.
 * 
 * FUNCTION-BY-FUNCTION ANALYSIS:
 * - `export default clerkMiddleware()`
 *   - Does: Executes Clerk's default authentication checks on requested routes. Without explicit custom logic, it usually protects all routes or parses session tokens so they are available in Server Components.
 * - `export const config`
 *   - Does: Defines a regex `matcher` telling Next.js exactly which routes should trigger this middleware.
 *   - Details: It skips static files (images, css, js) and internal Next.js paths (`_next`), but ensures it runs for all API routes and application pages.
 * 
 * HOW THIS FILE CONNECTS TO OTHER FILES:
 * - Inbound: Executed by the Next.js runtime automatically based on the `matcher` config.
 * 
 * DESIGN PATTERNS:
 * - Interceptor Pattern: Acts as a gateway to examine HTTP requests (like checking for JWT cookies) before the application code is ever invoked.
 * 
 * POTENTIAL INTERVIEW QUESTIONS:
 * 1. Why skip static files in the middleware matcher?
 *    - Answer: Performance. Middleware runs on every matching request. If we ran it for every `.png` or `.css` file requested, it would unnecessarily increase latency and edge function execution costs, as those files don't need auth protection.
 */
