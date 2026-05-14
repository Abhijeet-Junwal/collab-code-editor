// AI.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAssistantStore } from "@/store/useAssistantStore";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { RiRobot3Fill } from "react-icons/ri";
import axios from "axios";
import { backendUrl } from "@/lib/env";

export default function AI() {
  const showAssistant = useAssistantStore((state) => state.showAssistant);
  const assistantResponse = useAssistantStore(
    (state) => state.assistantResponse
  );
  const userQuery = useAssistantStore((state) => state.userQuery);
  const [sidebarWidth, setSidebarWidth] = useState(350); // Adjusted initial width for better AI assistant look
  const [isResizing, setIsResizing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const setUserQuery = useAssistantStore((state) => state.setUserQuery);
  const setShowAssistant = useAssistantStore((state) => state.setShowAssistant);
  const setAssistantResponse = useAssistantStore(
    (state) => state.setAssistantResponse
  );
  const code = useCodeEditorStore((state) => state.getCode());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setUserQuery(inputValue);
    setInputValue(""); // Clear the input
    const response = await axios.post(
      `${backendUrl}/api/ai/ask-ai`,
      {
        prompt: inputValue,
        code: code,
      }
    );
    setAssistantResponse(response.data.answer);
  };

  const MIN_WIDTH = 250;
  const MAX_WIDTH = 600;

  const sidebarRef = useRef<HTMLDivElement | null>(null);

  // Mouse move & up listeners for resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !sidebarRef.current) return;
      // Calculate new width based on mouse position relative to the right edge of the screen
      const newWidth = window.innerWidth - e.clientX;

      if (newWidth < MIN_WIDTH) {
        setShowAssistant(false);
        setSidebarWidth(350); // Reset width when closed
      } else {
        setSidebarWidth(Math.min(Math.max(newWidth, MIN_WIDTH), MAX_WIDTH));
      }
    };

    const handleMouseUp = () => {
      if (isResizing) setIsResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div
      className={`fixed bottom-0 right-0 h-[calc(100vh)] flex justify-end items-end pr-4 pb-4 z-50 ${
        isResizing ? "cursor-col-resize " : ""
      }`}
    >
      {/* Toggle Button for AI Assistant */}
      {!showAssistant && (
        <motion.button
          key="assistant-button"
          initial={{ x: 100, opacity: 0 }} // Starts off-screen to the right
          animate={{ x: 0, opacity: 1 }} // Slides in from the right
          exit={{ x: 100, opacity: 0 }} // Slides out to the right
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          onClick={() => setShowAssistant(true)}
          className="bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors cursor-pointer"
          aria-label="Open AI Assistant"
        >
          <RiRobot3Fill size={28} />
        </motion.button>
      )}

      {/* Sidebar Container */}
      <AnimatePresence>
        {showAssistant && (
          <motion.div
            ref={sidebarRef}
            initial={{ x: sidebarWidth, opacity: 0 }} // Starts off-screen to the right
            animate={{ x: 0, opacity: 1 }} // Slides in from the right
            exit={{ x: sidebarWidth, opacity: 0 }} // Slides out to the right
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="relative h-full bg-gradient-to-r from-gray-950 via-gray-900 to-gray-800 text-white p-4 shadow-lg border-l border-gray-700"
            style={{
              width: `${sidebarWidth}px`,
              minWidth: `${MIN_WIDTH}px`,
              maxWidth: `${MAX_WIDTH}px`,
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowAssistant(false)}
              className="absolute top-4 right-4 bg-gray-800 p-2 pr-3 pl-3 rounded-full hover:bg-gray-700 transition-colors text-white"
              aria-label="Close AI Assistant"
            >
              X {/* Simple 'X' icon for close */}
            </button>

            <h2 className="text-xl font-semibold mb-4 pt-8">AI Assistant</h2>
            {/* Content of your AI assistant goes here */}
            <div className="flex flex-col h-[calc(100%-60px)]">
              <div className="flex-grow overflow-y-auto flex flex-col">
                <p>Hello! How can I help you today?</p>
                {/* Example chat messages */}
                <div className="bg-[#2f3150] p-3 rounded-lg my-2 w-[75%] self-end">
                  <p className="text-sm">
                    {userQuery || `User: What's the weather like?`}
                  </p>
                </div>
                <div className="bg-[#6350ce] p-3 rounded-lg my-2 w-[75%]">
                  <p className="text-sm">
                    {assistantResponse ||
                      `AI: I can't provide real-time weather information.`}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <form onSubmit={(e) => handleSubmit(e)}>
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    className="mt-2 w-full bg-blue-600 p-3 rounded-lg hover:bg-blue-700 transition-colors"
                    type="submit"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>

            {/* Resizer Handle */}
            <div
              onMouseDown={() => setIsResizing(true)}
              className="absolute top-0 left-0 w-1.5 h-full cursor-col-resize z-30"
              style={{ backgroundColor: isResizing ? "#8884" : "transparent" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/*
 * ===========================================================================================
 *                              NOTES — AI-Assistant.tsx
 * ===========================================================================================
 *
 * PURPOSE: Renders a collapsible, resizable AI chat sidebar allowing users to ask questions about their code.
 * ROLE IN ARCHITECTURE: Frontend Component Layer. Integrates the `useAssistantStore` UI state with the backend AI API.
 * 
 * IMPORTS:
 * - `framer-motion`: For smooth slide-in/slide-out and hover animations.
 * - `useAssistantStore, useCodeEditorStore`: Zustand stores to access current UI state and the actual code content.
 * - `axios`: To make HTTP requests to the backend AI endpoints.
 * 
 * FUNCTION-BY-FUNCTION ANALYSIS:
 * - `AI()` (Main Component)
 *   - Does: Renders a floating Action Button (FAB) when closed, and a resizable sidebar when opened.
 * - `handleSubmit(e)`
 *   - Does: Prevents default form submit, clears input, and POSTs the user query + current code context to `/api/ai/ask-ai`. Updates the store with the AI's response.
 * - `useEffect` (Resizing Logic)
 *   - Does: Attaches `mousemove` and `mouseup` event listeners to the `window` when the user clicks the drag handle. Calculates new width based on mouse X coordinate. If dragged too small (<250px), it auto-closes the assistant.
 * 
 * HOW THIS FILE CONNECTS TO OTHER FILES:
 * - Inbound: Rendered as a global floating element inside a layout or specific room page.
 * - Outbound: Calls `backendUrl/api/ai/ask-ai` directly.
 * 
 * DESIGN PATTERNS:
 * - Floating Overlay Pattern: Exists outside the normal document flow (`fixed z-50`), ensuring it doesn't disrupt the editor layout when opened.
 * - Controlled Resizability: Implements custom drag-to-resize logic rather than relying on heavy third-party libraries.
 * 
 * POTENTIAL INTERVIEW QUESTIONS:
 * 1. Why attach the `mousemove` event to the `window` instead of the drag handle itself?
 *    - Answer: If you move your mouse too fast, the cursor can leave the bounds of a small drag handle. If the event listener is only on the handle, it will stop firing, breaking the resize functionality. Attaching it to the `window` ensures the drag continues no matter how fast the mouse moves.
 * 2. Why use Framer Motion's `<AnimatePresence>`?
 *    - Answer: In React, when a component is removed from the DOM (like conditionally rendering `showAssistant && <Sidebar/>`), it disappears instantly. `<AnimatePresence>` allows components to execute their `exit` animation before React actually unmounts them from the DOM.
 */
