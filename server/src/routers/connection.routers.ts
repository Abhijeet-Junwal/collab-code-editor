import { Router } from "express";
import { getCode } from "../controllers/connection.controllers";

const router = Router();

router.route("/getCode").get(getCode);
export default router;

/*
 * ===========================================================================================
 *                              NOTES — connection.routers.ts
 * ===========================================================================================
 *
 * PURPOSE: Defines the Express router for connection and code state retrieval.
 * ROLE IN ARCHITECTURE: Routing Layer. Maps paths starting with `/api` to connection controllers.
 * 
 * IMPORTS:
 * - `Router`: Express module to create route handlers.
 * - `getCode`: Controller function to fetch saved code from the DB.
 * 
 * FUNCTION-BY-FUNCTION ANALYSIS:
 * - `router.route("/getCode").get(getCode)`
 *   - Does: Binds GET requests for `/api/getCode` to the `getCode` controller.
 * 
 * HOW THIS FILE CONNECTS TO OTHER FILES:
 * - Inbound: Imported and mounted by `app.ts` as `app.use("/api", connectionRouter)`.
 * - Outbound: Delegates to `connection.controllers.ts`.
 * 
 * DESIGN PATTERNS:
 * - Modular Routing: Keeps routes specific to connection state in their own file.
 * 
 * POTENTIAL INTERVIEW QUESTIONS:
 * 1. The route is mounted at `/api` and the path is `/getCode`, making the full URL `/api/getCode`. Is this good RESTful design?
 *    - Answer: No. "getCode" is an action verb. REST APIs should use nouns representing resources. A better RESTful path would be `GET /api/rooms/:roomId/code`.
 */
