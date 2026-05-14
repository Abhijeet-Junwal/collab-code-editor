"use client";
import { io } from "socket.io-client";
import { backendUrl } from "./env";

const socketUrl = backendUrl;
export const socket = io(socketUrl, {
  transports: ["websocket", "polling"],
  timeout: 20000,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

console.log("[socket] init", socketUrl);

socket.on("connect", () => {
  console.log("[socket] connected", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("[socket] disconnected", reason);
});

socket.on("connect_error", (error) => {
  console.warn("[socket] connect_error", error?.message || error);
});

/*
 * ===========================================================================================
 *                              NOTES — socket.ts
 * ===========================================================================================
 *
 * PURPOSE: Initializes a singleton Socket.io client instance for real-time communication.
 * ROLE IN ARCHITECTURE: Frontend Network Layer. Manages the persistent WebSocket connection to the Node.js backend.
 * 
 * IMPORTS:
 * - `io`: Socket.io client library.
 * - `backendUrl`: URL of the server from `env.ts`.
 * 
 * FUNCTION-BY-FUNCTION ANALYSIS:
 * - `Global Execution Context`
 *   - Does: Creates the `socket` instance connecting to `backendUrl`. Configures transports to prefer WebSockets but allow HTTP polling fallback. Adds standard event listeners for `connect`, `disconnect`, and `connect_error` for debugging.
 * 
 * HOW THIS FILE CONNECTS TO OTHER FILES:
 * - Inbound: Imported by React components (like the main Room page) to emit and listen to events.
 * 
 * DESIGN PATTERNS:
 * - Singleton Pattern: By exporting the instantiated `socket` from the module level, the entire React application shares a single WebSocket connection rather than opening a new one per component.
 * 
 * POTENTIAL INTERVIEW QUESTIONS:
 * 1. Why set `transports: ["websocket", "polling"]`?
 *    - Answer: By default, Socket.io starts with HTTP polling and upgrades to WebSockets. By listing `websocket` first, we force it to try a direct WS connection immediately to reduce latency, falling back to polling only if WS is blocked by a proxy or firewall.
 */
