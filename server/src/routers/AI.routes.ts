import { Router } from "express";
import { askAssistant, askSuggestion } from "../controllers/AI.controllers";

const router = Router();

router.route("/ask-ai").post(askAssistant);
router.route("/ask-suggestion").post(askSuggestion);
export default router;

/*
 * ===========================================================================================
 *                              NOTES — AI.routes.ts
 * ===========================================================================================
 *
 * PURPOSE: Defines the Express router for AI-related endpoints.
 * ROLE IN ARCHITECTURE: Routing Layer. Maps HTTP paths starting with `/api/ai` to their respective controller functions.
 * 
 * IMPORTS:
 * - `Router`: Express module to create modular, mountable route handlers.
 * - `askAssistant, askSuggestion`: Controller functions containing the business logic.
 * 
 * FUNCTION-BY-FUNCTION ANALYSIS:
 * - `router.route("/ask-ai").post(askAssistant)`
 *   - Does: Binds POST requests to `/api/ai/ask-ai` to the `askAssistant` controller.
 * - `router.route("/ask-suggestion").post(askSuggestion)`
 *   - Does: Binds POST requests to `/api/ai/ask-suggestion` to the `askSuggestion` controller.
 * 
 * HOW THIS FILE CONNECTS TO OTHER FILES:
 * - Inbound: Imported and mounted by `app.ts` as `app.use("/api/ai", AIRouter)`.
 * - Outbound: Delegates to `AI.controllers.ts`.
 * 
 * DESIGN PATTERNS:
 * - Front Controller / Routing Pattern: Centralizes URL mapping away from the main application file, keeping the codebase modular and organized by domain/feature.
 * 
 * POTENTIAL INTERVIEW QUESTIONS:
 * 1. Why use `router.route('/path').post(...)` instead of `router.post('/path', ...)`?
 *    - Answer: `router.route()` allows for chaining multiple HTTP methods on the same path (e.g., `.get().post().put()`) cleanly. If it's just one method, `router.post()` works identically, but using `.route()` is a stylistic choice for consistency and future expandability.
 */
