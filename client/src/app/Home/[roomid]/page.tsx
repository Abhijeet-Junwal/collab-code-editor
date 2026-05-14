import EditorPanel from "../../(root)/_components/EditorPanel";
import Header from "../../(root)/_components/Header";
import OutputPanel from "../../(root)/_components/OutputPanel";

export default async function Page({
  params,
}: {
  params: Promise<{ roomid: string }>;
}) {
  const { roomid } = await params;
  console.log(roomid);

  return (
    <div className="min-h-screen">
      <div className="max-w-[1800px] mx-auto p-4">
        <Header />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EditorPanel />
          <OutputPanel />
        </div>
      </div>
    </div>
  );
}

/*
 * ===========================================================================================
 *                              NOTES — Home/[roomid]/page.tsx
 * ===========================================================================================
 *
 * PURPOSE: The main layout for a collaborative coding room.
 * ROLE IN ARCHITECTURE: Frontend Page Layer. Assembles the Header, Editor, and Output panels into a responsive grid.
 * 
 * IMPORTS:
 * - `EditorPanel`, `Header`, `OutputPanel`: Main UI components.
 * 
 * FUNCTION-BY-FUNCTION ANALYSIS:
 * - `Page({ params })`
 *   - Does: Asynchronously resolves the route parameters to get the `roomid`. Renders the `Header` at the top, and a two-column CSS grid (on large screens) containing the `EditorPanel` and `OutputPanel`.
 *   - Returns: JSX Element.
 * 
 * HOW THIS FILE CONNECTS TO OTHER FILES:
 * - Inbound: Routed to via Next.js App Router when a user visits `/Home/123`.
 * 
 * DESIGN PATTERNS:
 * - Composition Root: This page acts as the orchestrator, bringing together distinct, complex components into a unified layout without passing heavy props (since the components use global Zustand/Socket state).
 * 
 * POTENTIAL INTERVIEW QUESTIONS:
 * 1. Why does the Page component take `params: Promise<{ roomid: string }>` instead of just an object?
 *    - Answer: In newer versions of Next.js 15+ App Router, route parameters are strictly asynchronous and must be awaited before use to support partial prerendering and streaming architectures.
 */
