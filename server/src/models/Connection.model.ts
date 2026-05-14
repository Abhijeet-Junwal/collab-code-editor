import mongoose from "mongoose";

const codeExecutionSchema = new mongoose.Schema({
  currentCodeContent: {
    type: String,
    required: true,
  },
  roomId: {
    type: String,
    required: true,
  },
});

export const codeExecution = mongoose.model(
  "codeExecution",
  codeExecutionSchema
);

/*
 * ===========================================================================================
 *                              NOTES — Connection.model.ts
 * ===========================================================================================
 *
 * PURPOSE: Defines the Mongoose schema and model for storing real-time code editor states per room.
 * ROLE IN ARCHITECTURE: Database / Model Layer. Maps MongoDB documents to TypeScript/Node.js objects for the `codeExecution` collection.
 * 
 * IMPORTS:
 * - `mongoose`: The ODM (Object Data Modeling) library used to interact with MongoDB.
 * 
 * FUNCTION-BY-FUNCTION ANALYSIS:
 * - `codeExecutionSchema`
 *   - Does: Defines the structure of the document stored in the database.
 *   - Fields:
 *     - `currentCodeContent` (String, required): The actual source code currently typed in the room.
 *     - `roomId` (String, required): The unique identifier for the collaborative session.
 * 
 * - `mongoose.model("codeExecution", codeExecutionSchema)`
 *   - Does: Compiles the schema into a Mongoose model.
 *   - Returns: The compiled model `codeExecution` which provides methods like `.findOne()`, `.save()`, etc.
 * 
 * HOW THIS FILE CONNECTS TO OTHER FILES:
 * - Inbound: Used by `connection.controllers.ts` to fetch code by `roomId`. (Also likely used by websocket logic in `app.ts` or `index.ts` to update the DB on changes, though that's not explicitly in the controller yet).
 * - Outbound: Talks directly to MongoDB via the Mongoose connection.
 * 
 * DESIGN PATTERNS:
 * - Active Record Pattern (via Mongoose): The model instance represents a single row (document) in the DB, and static methods represent table-level operations.
 * 
 * POTENTIAL INTERVIEW QUESTIONS:
 * 1. Why store real-time code in MongoDB instead of just Redis or holding it in memory?
 *    - Answer: While memory or Redis is faster for real-time sync, MongoDB provides persistence. If the server crashes or all users leave the room, the code is saved and can be retrieved when someone rejoins.
 * 2. If many people are typing at once, won't constant MongoDB writes cause performance issues?
 *    - Answer: Yes. In a production app, you would typically use WebSockets to sync state in memory/Redis and "debounce" the saves to MongoDB (e.g., saving only every 5 seconds or when the user stops typing).
 */
