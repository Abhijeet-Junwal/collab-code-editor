import { Blocks } from "lucide-react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="relative border-t border-gray-800/50 mt-auto">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gray-900 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Blocks className="size-5" />
            <span>Built for developers, by developers</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/support" className="text-gray-400 hover:text-gray-300 transition-colors">
              Support
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-gray-300 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-gray-300 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;

/*
 * ===========================================================================================
 *                              NOTES — Footer.tsx
 * ===========================================================================================
 *
 * PURPOSE: Renders the standard footer component at the bottom of the application.
 * ROLE IN ARCHITECTURE: Frontend Component Layer. Provides standard navigation links (Support, Privacy, Terms).
 * 
 * IMPORTS:
 * - `Blocks` from `lucide-react`: UI Icon.
 * - `Link` from `next/link`: Client-side routing.
 * 
 * FUNCTION-BY-FUNCTION ANALYSIS:
 * - `Footer()`
 *   - Does: Renders a static layout with a gradient border, branding text, and policy links.
 *   - Returns: JSX element (`<footer>`).
 * 
 * HOW THIS FILE CONNECTS TO OTHER FILES:
 * - Inbound: Currently standalone, but meant to be imported into layouts or specific pages.
 * 
 * DESIGN PATTERNS:
 * - Dumb/Presentational Component: It contains no state and no side effects, making it highly reusable and easy to test.
 * 
 * POTENTIAL INTERVIEW QUESTIONS:
 * 1. Why use `next/link` instead of a standard HTML `<a>` tag for internal links?
 *    - Answer: `next/link` intercept the click event, prevents a full browser reload, and performs client-side routing, making the application feel like an SPA (Single Page Application) while retaining SSR benefits.
 */