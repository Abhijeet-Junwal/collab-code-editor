"use client";
import LoginButton from "@/components/LoginButton";
import { SignedOut, UserButton } from "@clerk/nextjs";
import { User } from "lucide-react";

function HeaderProfileBtn() {
  return (
    <>
      <UserButton>
        <UserButton.MenuItems>
          <UserButton.Link
            label="Profile"
            labelIcon={<User className="size-4" />}
            href="/profile"
          />
        </UserButton.MenuItems>
      </UserButton>

      <SignedOut>
        <LoginButton />
      </SignedOut>
    </>
  );
}
export default HeaderProfileBtn;

/*
 * ===========================================================================================
 *                              NOTES — HeaderProfileBtn.tsx
 * ===========================================================================================
 *
 * PURPOSE: Modularizes the profile avatar / login button logic.
 * ROLE IN ARCHITECTURE: Frontend Component Layer.
 * 
 * IMPORTS:
 * - `UserButton, SignedOut`: Clerk components.
 * - `LoginButton`: Custom component.
 * 
 * FUNCTION-BY-FUNCTION ANALYSIS:
 * - `HeaderProfileBtn()`
 *   - Does: If the user is logged in, renders Clerk's `<UserButton>` (the circular avatar) and injects a custom menu item linking to `/profile`. If logged out, renders the custom `<LoginButton>`.
 * 
 * HOW THIS FILE CONNECTS TO OTHER FILES:
 * - Inbound: Imported by multiple header variations (`NavigationHeader.tsx` and `Header.tsx`) to ensure DRY (Don't Repeat Yourself) principles.
 * 
 * DESIGN PATTERNS:
 * - Auth-Aware Component: Abstracts authentication UI logic away from layout components.
 * 
 * POTENTIAL INTERVIEW QUESTIONS:
 * 1. Can we access user data (like email or name) inside this component?
 *    - Answer: Not directly through the JSX provided here. To get user data, you would need to use Clerk's `useUser()` hook inside the component. The `<UserButton>` component internally fetches and manages its own user data to render the avatar image.
 */