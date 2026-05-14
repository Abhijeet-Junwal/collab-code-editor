const RunningCodeSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="space-y-2">
      <div className="h-4 bg-gray-800/50 rounded w-3/4" />
      <div className="h-4 bg-gray-800/50 rounded w-1/2" />
      <div className="h-4 bg-gray-800/50 rounded w-5/6" />
    </div>

    <div className="space-y-2 pt-4">
      <div className="h-4 bg-gray-800/50 rounded w-2/3" />
      <div className="h-4 bg-gray-800/50 rounded w-4/5" />
      <div className="h-4 bg-gray-800/50 rounded w-3/4" />
    </div>
  </div>
);

export default RunningCodeSkeleton;

/*
 * ===========================================================================================
 *                              NOTES — RunningCodeSkeleton.tsx
 * ===========================================================================================
 *
 * PURPOSE: A simple skeleton loader displaying while code is executing on the remote server.
 * ROLE IN ARCHITECTURE: Frontend Component Layer / UX Optimization.
 * 
 * IMPORTS: None.
 * 
 * FUNCTION-BY-FUNCTION ANALYSIS:
 * - `RunningCodeSkeleton()`
 *   - Does: Renders several animated (`animate-pulse`) divs resembling lines of text to indicate processing.
 * 
 * HOW THIS FILE CONNECTS TO OTHER FILES:
 * - Inbound: Rendered conditionally inside `OutputPanel.tsx` when `isRunning === true`.
 * 
 * DESIGN PATTERNS:
 * - Skeleton Loading Pattern: See `EditorPanelSkeleton.tsx`.
 * 
 * POTENTIAL INTERVIEW QUESTIONS:
 * 1. Why use Tailwind's `animate-pulse` here?
 *    - Answer: `animate-pulse` applies a subtle CSS opacity animation that signals to the user that the system is actively working (waiting for a response), rather than frozen or broken.
 */