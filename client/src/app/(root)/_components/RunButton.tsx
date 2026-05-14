"use client";

import {
  getExecutionResult,
  useCodeEditorStore,
} from "@/store/useCodeEditorStore";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { backendUrl } from "@/lib/env";
import { motion } from "framer-motion";
import { Loader2, Play } from "lucide-react";
import { usePathname } from "next/navigation";
// import { api } from "../../../../convex/_generated/api";

function RunButton() {
  const { user } = useUser();
  const runCode = useCodeEditorStore((state) => state.runCode);
  const isRunning = useCodeEditorStore((state) => state.isRunning);
  const getCode = useCodeEditorStore((state) => state.getCode);
  const pathName = usePathname();
  const roomId = pathName.split("/")[2];

  const handleRun = async () => {
    let code = getCode();

    if (!code?.trim() && roomId) {
      try {
        const response = await axios.get(
          `${backendUrl}/api/getCode`,
          {
            params: {
              roomId: roomId,
            },
          }
        );
        code = response.data?.data?.currentCodeContent || "";
      } catch (error) {
        console.log("Error fetching code for run:", error);
      }
    }

    await runCode(code || "");
    const result = getExecutionResult();

    if (user && result) {
      // Placeholder for future execution persistence.
    }
  };

  return (
    <motion.button
      onClick={handleRun}
      disabled={isRunning}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        group relative inline-flex items-center gap-2.5 px-5 py-2.5
        disabled:cursor-not-allowed
        focus:outline-none
      `}
    >
      {/* bg wit gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl opacity-100 transition-opacity group-hover:opacity-90" />

      <div className="relative flex items-center gap-2.5">
        {isRunning ? (
          <>
            <div className="relative">
              <Loader2 className="w-4 h-4 animate-spin text-white/70" />
              <div className="absolute inset-0 blur animate-pulse" />
            </div>
            <span className="text-sm font-medium text-white/90">
              Executing...
            </span>
          </>
        ) : (
          <>
            <div className="relative flex items-center justify-center w-4 h-4">
              <Play className="w-4 h-4 text-white/90 transition-transform group-hover:scale-110 group-hover:text-white" />
            </div>
            <span className="text-sm font-medium text-white/90 group-hover:text-white">
              Run Code
            </span>
          </>
        )}
      </div>
    </motion.button>
  );
}
export default RunButton;

/*
 * ===========================================================================================
 *                              NOTES — RunButton.tsx
 * ===========================================================================================
 *
 * PURPOSE: A button that triggers code execution. It fetches the latest code if necessary and dispatches the run action.
 * ROLE IN ARCHITECTURE: Frontend Component Layer. The primary action trigger for the Judge0/Piston API pipeline.
 * 
 * IMPORTS:
 * - `useCodeEditorStore`: Actions to run the code.
 * - `axios`, `backendUrl`: To fetch code from MongoDB if it's missing from local state.
 * - `useUser`: Clerk auth state.
 * 
 * FUNCTION-BY-FUNCTION ANALYSIS:
 * - `handleRun()`
 *   - Does: 
 *     1. Gets code from the local editor store.
 *     2. FALLBACK: If local code is empty (e.g., someone else typed it and the local user just joined/refreshed without typing), it makes an HTTP GET to `/api/getCode` to fetch the room's current code from the database.
 *     3. Calls the `runCode` Zustand action to execute it.
 *     4. (Placeholder) If the user is logged in, it prepares to save the execution result.
 * 
 * HOW THIS FILE CONNECTS TO OTHER FILES:
 * - Inbound: Placed in the `Header.tsx`.
 * - Outbound: Calls Zustand's `runCode` which calls Judge0. Also calls the backend `/api/getCode`.
 * 
 * DESIGN PATTERNS:
 * - Fallback / Defensive Programming: The button doesn't just assume the code is in local state. It actively verifies and fetches the authoritative state from the server if local state is empty, ensuring a collaborative user doesn't accidentally run "nothing".
 * 
 * POTENTIAL INTERVIEW QUESTIONS:
 * 1. Why might `getCode()` be empty even if there is code on the screen?
 *    - Answer: In a collaborative environment, if User A writes the code, User B's local Monaco instance might display it via WebSockets, but depending on how the Zustand state synchronizes, the *local storage cache* or *direct editor reference* might not be perfectly aligned at the exact millisecond. The fallback ensures the button is fault-tolerant.
 */
