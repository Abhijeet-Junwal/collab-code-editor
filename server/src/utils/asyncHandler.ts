import { Request, Response, NextFunction } from "express";

const asyncHandler = (requestHandler: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // convert to promise
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export default asyncHandler;

/*
 * ===========================================================================================
 *                              NOTES — asyncHandler.ts
 * ===========================================================================================
 *
 * PURPOSE: Wraps asynchronous Express route handlers to automatically catch unhandled exceptions and pass them to the `next` function.
 * ROLE IN ARCHITECTURE: Middleware Utility Layer. Prevents the application from crashing due to unhandled promise rejections in async routes.
 * 
 * IMPORTS:
 * - `express` types (`Request`, `Response`, `NextFunction`): Used for TypeScript typings.
 * 
 * FUNCTION-BY-FUNCTION ANALYSIS:
 * - `asyncHandler(requestHandler)`
 *   - Does: Returns a new Express middleware function. It executes the passed `requestHandler` inside a `Promise.resolve()`. If the handler throws or rejects, the `.catch` block catches the error and passes it to `next(err)`.
 *   - Parameters: `requestHandler` (Function): The async controller logic.
 *   - Returns: A standard Express middleware function `(req, res, next)`.
 *   - Side effects: Delegates error handling to Express's next middleware.
 * 
 * HOW THIS FILE CONNECTS TO OTHER FILES:
 * - Inbound: Used by all router files (`AI.routes.ts`, `connection.routers.ts`, etc.) to wrap controllers.
 * - Outbound: None.
 * 
 * DESIGN PATTERNS:
 * - Higher-Order Function (Decorator Pattern): Takes a function and returns an enhanced function with automatic try/catch error delegation.
 * 
 * POTENTIAL INTERVIEW QUESTIONS:
 * 1. Why do we need `asyncHandler` in an Express application?
 *    - Answer: Express 4 does not handle rejected promises natively. If an async route throws an error without a `try/catch`, the request will hang, and the app might crash. `asyncHandler` removes the need to write `try/catch` in every controller.
 * 2. How does `Promise.resolve(fn).catch(next)` work?
 *    - Answer: `Promise.resolve()` ensures that the return value is treated as a promise (even if a sync function was passed). The `.catch()` attaches a rejection handler that triggers Express's error middleware via `next()`.
 * 3. In Express 5, is this function still necessary?
 *    - Answer: No, Express 5 introduced built-in support for async/await promise rejections, making this pattern obsolete.
 */
