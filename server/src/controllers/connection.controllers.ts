import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import logger from "../utils/logger";
import { Request, Response } from "express";
import { codeExecution } from "../models/Connection.model";

const getCode = asyncHandler(async (req: Request, res: Response) => {
  logger.info("request recieved for code");
  try {
    const { roomId } = req.query;
    const code = await codeExecution.findOne({ roomId: roomId });
    res.status(200).json(new ApiResponse(201, "code", code));
  } catch (error) {
    console.log("error occurred in controller", error);
  }
});

export { getCode };

/*
 * ===========================================================================================
 *                              NOTES — connection.controllers.ts
 * ===========================================================================================
 *
 * PURPOSE: Handles requests related to fetching the saved code state for a specific room.
 * ROLE IN ARCHITECTURE: Controller Layer. Acts as the bridge between HTTP routes and the `codeExecution` MongoDB collection.
 * 
 * IMPORTS:
 * - `ApiResponse`: Standardized response formatter.
 * - `asyncHandler`: Catches async errors.
 * - `logger`: Winston logger.
 * - `codeExecution`: The Mongoose model for fetching DB records.
 * 
 * FUNCTION-BY-FUNCTION ANALYSIS:
 * - `getCode(req, res)`
 *   - Does: Looks up the saved code state in the database using the `roomId` query parameter.
 *   - Parameters: Extracts `roomId` from `req.query`.
 *   - Returns: Sends a 200 HTTP status (though it passes 201 to the ApiResponse constructor) with the retrieved `code` document.
 *   - Side effects: Database read operation.
 *   - Edge cases: Contains a custom `catch` block that logs the error but does NOT send a response back to the client if an error occurs.
 * 
 * HOW THIS FILE CONNECTS TO OTHER FILES:
 * - Inbound: Routed via `connection.routers.ts`.
 * - Outbound: Queries DB via `Connection.model.ts`. Returns data via `ApiResponse.ts`.
 * 
 * DESIGN PATTERNS:
 * - MVC Controller Pattern: Handles the "Controller" aspect, separating HTTP routing from business logic and database models.
 * 
 * POTENTIAL INTERVIEW QUESTIONS:
 * 1. Look at the `catch` block in `getCode`. What is the flaw here?
 *    - Answer: The `catch` block logs the error but fails to call `res.status(...).send()`. Because it catches the error, `asyncHandler` never sees it, and the client's HTTP request will hang indefinitely until it times out. It should either rethrow the error, call `next(error)`, or send an error response.
 * 2. Why extract `roomId` from `req.query` instead of `req.params` or `req.body`?
 *    - Answer: A GET request should not have a body. Whether to use query (`/code?roomId=123`) or params (`/code/123`) is a REST design choice. Query parameters are standard for filtering/searching.
 */
