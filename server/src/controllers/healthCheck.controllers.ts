import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import logger from "../utils/logger";
import { Request, Response } from "express";

// Health check for API
const healthCheckController = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info("Health check successful", req, res);
    res.status(200).json(new ApiResponse(201, "Health check successful"));
  }
);

export { healthCheckController };

/*
 * ===========================================================================================
 *                              NOTES — healthCheck.controllers.ts
 * ===========================================================================================
 *
 * PURPOSE: Provides a simple endpoint to verify that the server is running and accepting requests.
 * ROLE IN ARCHITECTURE: Infrastructure / Monitoring Layer. Used by load balancers and deployment platforms (like Docker, AWS, Vercel) to check service health.
 * 
 * IMPORTS:
 * - `ApiResponse`: Formats the success message.
 * - `asyncHandler`: Wraps the async function.
 * - `logger`: Logs the successful ping.
 * 
 * FUNCTION-BY-FUNCTION ANALYSIS:
 * - `healthCheckController(req, res)`
 *   - Does: Immediately responds with a success message.
 *   - Returns: JSON response `{ statusCode: 201, message: "Health check successful", success: true }`.
 *   - Side effects: Logs the request.
 * 
 * HOW THIS FILE CONNECTS TO OTHER FILES:
 * - Inbound: Routed via `healthCheck.routers.ts` (usually mapped to `/api/v1/healthcheck`).
 * - Outbound: None.
 * 
 * DESIGN PATTERNS:
 * - Health Check Pattern: A standard microservice pattern ensuring readiness and liveness probes have an extremely lightweight endpoint to ping without hitting the database.
 * 
 * POTENTIAL INTERVIEW QUESTIONS:
 * 1. What is the difference between a Liveness probe and a Readiness probe, and which one is this?
 *    - Answer: A Liveness probe checks if the app is running (if it fails, the app restarts). A Readiness probe checks if the app is ready to serve traffic (e.g., DB is connected). This specific controller acts as a Liveness probe since it doesn't check the DB connection before returning success.
 * 2. Why pass `req, res` to `logger.info`?
 *    - Answer: Usually, passing the entire raw Express `req` and `res` objects to a logger causes massive circular JSON reference errors or dumps massive amounts of raw socket data. It's better to log specific fields like `req.ip` or `req.originalUrl`.
 */
