import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

import { Toaster } from "react-hot-toast";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "Collab Code Editor",
  description: "Share and run code snippets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={` antialiased min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100 flex flex-col`}
        >
          {/* <Header>
            <NavigationHeader>

            </NavigationHeader>
          </Header>     */}

          <Toaster />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

// https://emkc.org/api/v2/piston/runtimes

/*
 * ===========================================================================================
 *                              NOTES — layout.tsx
 * ===========================================================================================
 *
 * PURPOSE: The root layout of the Next.js application, wrapping all pages.
 * ROLE IN ARCHITECTURE: App Router Root. Injects global providers (Clerk), sets HTML language, imports global CSS, and adds UI toast notifications.
 * 
 * IMPORTS:
 * - `Metadata` from `next`: Defines HTML head tags.
 * - `globals.css`: Tailwind and global styles.
 * - `ClerkProvider`: Wraps the app in Authentication context.
 * - `Toaster` from `react-hot-toast`: Global notification component.
 * 
 * FUNCTION-BY-FUNCTION ANALYSIS:
 * - `RootLayout({ children })`
 *   - Does: Returns the `<html>` and `<body>` tags. Wraps everything in `<ClerkProvider>` so auth state is available globally. Mounts the `<Toaster />` so toasts can be triggered from anywhere.
 *   - Returns: JSX Element.
 * 
 * HOW THIS FILE CONNECTS TO OTHER FILES:
 * - Inbound: Automatically invoked by Next.js App Router for every request.
 * - Outbound: Renders the active `page.tsx` as `children`.
 * 
 * DESIGN PATTERNS:
 * - Provider Pattern: Wrapping the tree in `<ClerkProvider>` allows any deeply nested component to access user auth state without prop drilling.
 * 
 * POTENTIAL INTERVIEW QUESTIONS:
 * 1. Why are `<html>` and `<body>` tags defined here instead of in `page.tsx`?
 *    - Answer: In the Next.js App Router, the `app/layout.tsx` is the root layout that defines the actual document structure. Pages are injected into this structure. This prevents React from unmounting and remounting the `body` during navigation.
 * 2. Why is `<Toaster />` placed at the root?
 *    - Answer: Toast notifications are global overlays. Placing them at the root ensures they are completely detached from specific page component lifecycles and won't disappear if the user navigates to a new page while a toast is showing.
 */
