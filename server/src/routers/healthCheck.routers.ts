import { Router } from "express";

import { healthCheckController } from "../controllers/healthCheck.controllers";
const router = Router();

router.route("/").get(healthCheckController);

export default router;

/*
 * ===========================================================================================
 *                              NOTES — healthCheck.routers.ts
 * ===========================================================================================
 *
 * PURPOSE: Defines the Express router for server health checks.
 * ROLE IN ARCHITECTURE: Routing Layer. Exposes an endpoint for uptime monitors and load balancers.
 * 
 * IMPORTS:
 * - `Router`: Express module.
 * - `healthCheckController`: The controller that handles the ping.
 * 
 * FUNCTION-BY-FUNCTION ANALYSIS:
 * - `router.route("/").get(healthCheckController)`
 *   - Does: Binds GET requests at the root of the mounted path to the health check controller.
 * 
 * HOW THIS FILE CONNECTS TO OTHER FILES:
 * - Inbound: Imported and mounted by `app.ts` as `app.use("/api/health", healthCheckRouter)`.
 * - Outbound: Delegates to `healthCheck.controllers.ts`.
 * 
 * DESIGN PATTERNS:
 * - Health Check Endpoint Pattern.
 * 
 * POTENTIAL INTERVIEW QUESTIONS:
 * 1. Why put the health check in its own router file instead of just `app.get('/health', ...)` in `app.ts`?
 *    - Answer: Consistency. Even if a feature only has one endpoint, keeping everything in the `routers -> controllers` pattern ensures `app.ts` remains clean and strictly focused on top-level middleware and server setup.
 */
