import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import "./utils/env";

//import routers
import healthCheckRouter from "./routers/healthCheck.routers";
import AIRouter from "./routers/AI.routes";
import connectionRouter from "./routers/connection.routers";
import { codeExecution } from "./models/Connection.model";
const app = express();
const httpServer = createServer(app);
const isProd = process.env.NODE_ENV === "production";
const rawCorsOrigin = process.env.CORS_ORIGIN || "";
const corsOrigins = rawCorsOrigin
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOrigin =
  corsOrigins.length > 0 ? corsOrigins : isProd ? undefined : "*";

const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
    methods: ["GET", "POST"],
  },
});
app.use(
  cors({
    origin: corsOrigin || false,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// routes
app.use("/api/health", healthCheckRouter);
app.use("/api/ai", AIRouter);
app.use("/api", connectionRouter);

io.on("connection", (socket) => {
  socket.on("join-room", async ({ roomId }, ack) => {
    if (!roomId) {
      if (typeof ack === "function") {
        ack({ ok: false, error: "Missing roomId" });
      }
      return;
    }
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    const currentCode = await codeExecution.findOne({ roomId });
    if (currentCode) {
      socket.emit("receive-changes", currentCode.currentCodeContent);
    }

    if (typeof ack === "function") {
      ack({ ok: true });
    }
  });

  socket.on("code-change", async ({ roomId, code }) => {
    if (!roomId || typeof code !== "string") {
      return;
    }
    socket.to(roomId).emit("receive-changes", code);
    const currentCode = await codeExecution.findOne({ roomId });
    if (currentCode) {
      currentCode.currentCodeContent = code;
      await currentCode.save();
    } else {
      if (!code.trim()) {
        return;
      }
      const newCode = new codeExecution({
        roomId: roomId,
        currentCodeContent: code,
      });
      await newCode.save();
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("user disconnected from socket", reason);
  });
});

export { httpServer, io };

/*
 * ===========================================================================================
 *                              NOTES — app.ts
 * ===========================================================================================
 *
 * PURPOSE: The core application configuration file. It initializes Express, sets up global middleware, configures CORS, registers HTTP routes, and initializes the Socket.io WebSocket server.
 * ROLE IN ARCHITECTURE: App Initialization Layer. This is the heart of the backend server logic, wrapping HTTP and WebSocket handling into a single `httpServer` instance.
 * 
 * IMPORTS:
 * - `express`: Web framework.
 * - `http`: Node core module, required to share the same port between Express and Socket.io.
 * - `socket.io`: WebSocket server for real-time collaboration.
 * - `cors`: Middleware to allow cross-origin requests from the frontend.
 * - `./utils/env`: Loads environment variables first.
 * - `Routers`: Health, AI, and Connection routes.
 * - `codeExecution`: Mongoose model for Socket.io to read/write code states.
 * 
 * FUNCTION-BY-FUNCTION ANALYSIS:
 * - `Express Setup & Middleware`
 *   - Does: Parses JSON bodies, handles URL encoding, serves a `public` static folder, and configures CORS dynamically based on `CORS_ORIGIN` (allowing specific origins in production, or `*` in dev).
 * 
 * - `Route Registration`
 *   - Does: Mounts `/api/health`, `/api/ai`, and `/api` to their respective routers.
 * 
 * - `Socket.io Setup (io.on('connection'))`
 *   - Does: Listens for incoming WebSocket connections.
 *   - `join-room`: When a client joins, it assigns them to a Socket.io room (`socket.join(roomId)`), fetches any existing code from MongoDB, and emits `receive-changes` to sync the new client with the room's current state. Uses an `ack` callback to notify the client of success.
 *   - `code-change`: When a user types, it broadcasts the change to everyone else in the room (`socket.to(roomId).emit`) and updates the document in MongoDB. If no document exists, it creates one.
 *   - `disconnect`: Logs when a user drops the connection.
 * 
 * HOW THIS FILE CONNECTS TO OTHER FILES:
 * - Inbound: Imported by `index.ts`, which actually calls `httpServer.listen()`.
 * - Outbound: Depends on all routers, the `codeExecution` model, and environment variables.
 * 
 * DESIGN PATTERNS:
 * - App Factory / Configuration Pattern: Separates the *configuration* of the server (`app.ts`) from the *starting* of the server (`index.ts`).
 * - Publish-Subscribe (Pub/Sub) via WebSockets: `socket.to(roomId).emit` implements the observer/pub-sub pattern to sync state across clients.
 * 
 * POTENTIAL INTERVIEW QUESTIONS:
 * 1. Why do we need `createServer(app)` from the `http` module instead of just using `app.listen()`?
 *    - Answer: `app.listen()` internally creates an HTTP server, but returns it synchronously. Socket.io requires a raw `http.Server` instance to attach itself to the same port. By creating it explicitly, both Express and Socket.io share the same networking layer.
 * 2. In the `code-change` socket event, MongoDB is queried (`findOne`), updated (`save()`), and potentially created (`new codeExecution`) on EVERY keystroke. What is the danger here?
 *    - Answer: Massive database thrashing. MongoDB will be hammered with writes. In a real app, you should debounce DB writes (e.g., save only every 5 seconds or when the room is empty) and keep the "live" state in Redis or server memory.
 * 3. What does `socket.to(roomId).emit` do differently than `io.emit`?
 *    - Answer: `io.emit` broadcasts to ALL connected users across all rooms. `socket.to(roomId).emit` broadcasts ONLY to users in that specific room, EXCLUDING the sender. This is crucial for room-based collaboration.
 */
