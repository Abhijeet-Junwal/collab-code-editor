import { httpServer } from "./app";
import connectDB from "./db";

const PORT: number = Number(process.env.PORT);

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

/*
 * ===========================================================================================
 *                              NOTES — index.ts
 * ===========================================================================================
 *
 * PURPOSE: The main entry point for the Node.js process. Connects to the database and starts the HTTP/WebSocket server.
 * ROLE IN ARCHITECTURE: Bootstrapping Layer.
 * 
 * IMPORTS:
 * - `httpServer`: The fully configured Express/Socket.io instance from `app.ts`.
 * - `connectDB`: The database initialization function from `db/index.ts`.
 * 
 * FUNCTION-BY-FUNCTION ANALYSIS:
 * - `Top-level execution`
 *   - Does: Reads `PORT` from environment variables.
 *   - Does: Calls `connectDB()`. Because it returns a Promise, `.then()` is chained.
 *   - Does: Inside the `.then()`, calls `httpServer.listen(PORT)` to finally bind to the network port and start accepting traffic.
 * 
 * HOW THIS FILE CONNECTS TO OTHER FILES:
 * - Inbound: This is the file executed by `npm start` or `ts-node`.
 * - Outbound: Calls `app.ts` and `db/index.ts`.
 * 
 * DESIGN PATTERNS:
 * - Two-Phase Bootstrapping Pattern: Ensures external dependencies (like the Database) are fully connected and healthy *before* the server starts listening on its HTTP port.
 * 
 * POTENTIAL INTERVIEW QUESTIONS:
 * 1. Why connect to the DB *before* calling `app.listen()`?
 *    - Answer: To prevent the application from accepting incoming HTTP requests before it is actually capable of processing them. If requests arrive before the DB is connected, they will fail and throw errors. This ensures the app is 100% ready when it binds to the port.
 */
