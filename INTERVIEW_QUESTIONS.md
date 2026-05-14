# Collab Code Editor — Interview Questions

This document contains a curated list of potential technical interview questions based directly on the architecture, implementation, and potential edge cases of the Collab Code Editor codebase. It is organized by domain.

---

## 1. System Architecture & Scalability

**Q: In `app.ts`, you are writing every debounced keystroke to MongoDB. How does this scale, and how would you optimize it for a production environment with thousands of concurrent users?**
*Answer:* Writing every keystroke directly to MongoDB is an anti-pattern for high-frequency real-time data and will quickly cause database thrashing and high latency. 
*Optimization Strategy:* Introduce Redis as an in-memory cache layer. When a keystroke comes in, update the code state in Redis (which is extremely fast). Then, implement a "write-behind" cache pattern where a background worker flushes the Redis state to MongoDB either periodically (e.g., every 30 seconds) or when the last user disconnects from the room.

**Q: You make direct API calls to Judge0 from the client side for code execution. What are the security and architectural implications of this?**
*Answer:* 
- *Security:* If the API requires authentication/tokens (like a paid Judge0 tier), making the call from the client exposes those tokens to the user, allowing them to abuse our quota. 
- *Architecture:* If we want to implement rate limiting, custom validation, or log execution history, the backend has no visibility into these executions since the client bypasses it entirely.
*Better Approach:* The client should send the code to our Node.js backend, which then acts as a secure proxy to the Judge0 API.

**Q: How does the application handle Database connection failures on startup?**
*Answer:* The application implements a "Fail-Fast" initialization sequence in `server/src/index.ts`. The Express/Socket `httpServer` only calls `.listen()` *after* the `connectDB()` Promise resolves successfully. If the DB fails, the process exits. This prevents the server from entering a "zombie" state where it accepts HTTP requests but crashes internally.

---

## 2. React & Frontend Implementation

**Q: You store the `monaco.editor.IStandaloneCodeEditor` instance inside a global Zustand store. Is this considered an anti-pattern, and why?**
*Answer:* Yes, generally. State management libraries (Redux, Zustand) are designed to hold plain, serializable data. The Monaco Editor instance is a complex object containing DOM references, circular dependencies, and internal state. Storing it globally can cause memory leaks (if not properly cleaned up on unmount) and makes debugging tools like Redux DevTools crash. 
*Alternative:* Store the *code content* and *language* in Zustand, and use a local React `useRef` to hold the editor instance, interacting with the store via `useEffect` synchronization.

**Q: Why do you need the `useMounted` custom hook before rendering certain UI components?**
*Answer:* The application uses Next.js, which performs Server-Side Rendering (SSR). Components like `LanguageSelector` or `EditorPanel` rely on browser-only APIs like `localStorage` to fetch the user's previously saved language or theme. During SSR, `localStorage` is undefined, so the server might render the default theme. When the client loads and checks `localStorage`, it renders the saved theme. This mismatch between Server HTML and Client HTML causes a "Hydration Error" in React. `useMounted` forces the component to wait until it is strictly running on the client before rendering these dynamic pieces.

**Q: In the Editor Panel, what is the purpose of the `isRemoteChange` reference flag?**
*Answer:* It prevents an infinite WebSocket echo loop. When User A types, an `onChange` event fires, emitting a socket to User B. User B's socket receives the code and calls `editor.setValue()`. However, calling `setValue()` *also* triggers User B's `onChange` event, which would normally emit a socket *back* to User A. By setting `isRemoteChange.current = true` right before calling `setValue()`, the `onChange` handler knows to ignore that specific event and not emit it back.

**Q: Why do you pass `wait=true` to the Judge0 execution API?**
*Answer:* Code execution is asynchronous. Without `wait=true`, Judge0 returns a submission token immediately, and the client must set up a polling mechanism (e.g., `setInterval`) to continually hit a separate GET endpoint until the execution finishes. Passing `wait=true` holds the HTTP connection open until the execution completes, significantly simplifying the frontend logic.

---

## 3. Node.js & Backend Implementation

**Q: What is the purpose of the `asyncHandler` utility in the Express routes?**
*Answer:* In Express 4.x, if an asynchronous route handler throws an error or rejects a Promise, it will crash the Node process unless explicitly caught. `asyncHandler` is a Higher-Order Function that wraps async controllers in a `Promise.resolve().catch(next)` block. This eliminates the need to write boilerplate `try/catch` blocks inside every single controller, delegating all errors to the global Express error middleware.

**Q: Explain the difference between `.env` and `.env.local` handling in `server/src/utils/env.ts`.**
*Answer:* The `env.ts` utility configures `dotenv` to load `.env.local` first, and then `.env` as a fallback. This is a common pattern where `.env` contains sensible defaults or template keys committed to the repository, while `.env.local` is ignored by Git and contains the actual secret keys specific to the developer's machine.

**Q: Why do we share the `httpServer` between Express and Socket.io in `app.ts`?**
*Answer:* It allows both standard HTTP REST traffic (Express) and WebSocket traffic (Socket.io) to flow over the exact same port (e.g., 8000). Socket.io intercepts requests upgrading to the `ws://` protocol, while Express handles standard `http://` routing. This drastically simplifies deployment, as you only need to expose one port to the internet.

---

## 4. Troubleshooting & Edge Cases

**Q: A user joins a room, but their editor is blank, even though their friend has been typing for 10 minutes. How would you debug this?**
*Answer:* 
1. Check the `join-room` flow. When the user joins, the backend should ideally send them the *current* state of the room from MongoDB or Redis.
2. Check `pendingCodeRef` in `EditorPanel.tsx`. Monaco Editor loads asynchronously. If the socket message containing the room's code arrived *before* Monaco finished mounting, the code might have been lost if `pendingCodeRef` isn't properly caching and flushing the payload upon the `onMount` event.

**Q: Users report that the "Copy" button on the Output panel stops working sometimes.**
*Answer:* The `handleCopy` function uses `navigator.clipboard.writeText()`. This API is strictly gated by browser security and *only* works in a Secure Context (HTTPS) or `localhost`. If the app is deployed on an insecure HTTP server, or accessed via an IP address without an SSL certificate, the `navigator.clipboard` object will be `undefined`, causing the function to crash.

**Q: How does the AI Assistant "know" what code the user is asking about without them copy-pasting it?**
*Answer:* The frontend `useAssistantStore` is bound to the `useCodeEditorStore`. When the user clicks "Send" in the AI sidebar, the `handleSubmit` function actively calls `codeEditorStore.getCode()` to retrieve the raw string from the Monaco instance and sends it in the JSON body payload alongside the user's text prompt to the `/api/ai/ask-ai` endpoint. The backend then formats this into a hidden system prompt for the LLM.
