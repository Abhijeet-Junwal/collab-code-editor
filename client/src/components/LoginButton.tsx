import { SignInButton } from "@clerk/nextjs";
import { LogIn } from "lucide-react";

function LoginButton() {
  return (
    <SignInButton mode="modal">
      <button
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg
             transition-all duration-200 font-medium shadow-lg shadow-blue-500/20"
      >
        <LogIn className="w-4 h-4 transition-transform" />
        <span>Sign In</span>
      </button>
    </SignInButton>
  );
}
export default LoginButton;

/*
 * ===========================================================================================
 *                              NOTES — LoginButton.tsx
 * ===========================================================================================
 *
 * PURPOSE: A stylized button that triggers the Clerk authentication modal.
 * ROLE IN ARCHITECTURE: Frontend Component Layer / Auth.
 * 
 * IMPORTS:
 * - `SignInButton` from `@clerk/nextjs`: Wraps children to trigger Clerk's sign-in flow.
 * - `LogIn` from `lucide-react`: Icon.
 * 
 * FUNCTION-BY-FUNCTION ANALYSIS:
 * - `LoginButton()`
 *   - Does: Renders a button with gradients and hover animations wrapped in Clerk's `<SignInButton mode="modal">`.
 *   - Returns: JSX element.
 * 
 * HOW THIS FILE CONNECTS TO OTHER FILES:
 * - Inbound: Potentially used in headers or landing pages for unauthenticated users.
 * 
 * DESIGN PATTERNS:
 * - Compound Components / Wrapper Pattern: Clerk's `SignInButton` does not render DOM itself but attaches click handlers to its children.
 * 
 * POTENTIAL INTERVIEW QUESTIONS:
 * 1. What does `mode="modal"` do in Clerk's `SignInButton`?
 *    - Answer: Instead of redirecting the user to a separate hosted login page (which is the default), it opens an overlay modal on the current page, providing a smoother UX without full page navigations.
 */