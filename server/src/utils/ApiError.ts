class ApiError extends Error {
  statusCode: number;
  success: boolean;

  constructor(statusCode: number, message?: string, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.stack = stack;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;

/*
 * ===========================================================================================
 *                              NOTES — ApiError.ts
 * ===========================================================================================
 *
 * PURPOSE: Provides a standardized Error class to be used across the application for throwing predictable HTTP errors.
 * ROLE IN ARCHITECTURE: Shared Utility layer. Used by controllers, middleware, and services to throw errors that are caught by global error handlers.
 * 
 * IMPORTS: None.
 * 
 * FUNCTION-BY-FUNCTION ANALYSIS:
 * - `constructor(statusCode, message, stack)`
 *   - Does: Initializes the custom error object with an HTTP status code, message, and stack trace. Automatically sets `success: false`.
 *   - Parameters:
 *     - `statusCode` (number): HTTP status code (e.g., 400, 404, 500).
 *     - `message` (string, optional): Detailed error message.
 *     - `stack` (string, optional): Pre-existing stack trace. If not provided, captures a new stack trace.
 *   - Returns: Instance of `ApiError`.
 *   - Side effects: None.
 * 
 * HOW THIS FILE CONNECTS TO OTHER FILES:
 * - Inbound (who calls this): Controllers (`AI.controllers.ts`, etc.), utilities (`Passwords.ts`), middlewares.
 * - Outbound (what this calls): None.
 * 
 * DESIGN PATTERNS:
 * - Custom Error/Extension Pattern: Extends the native JavaScript `Error` class to attach domain-specific data (status code, success flag) for the API.
 * 
 * POTENTIAL INTERVIEW QUESTIONS:
 * 1. Why extend the base `Error` class instead of just returning objects?
 *    - Answer: Throwing custom error objects preserves the stack trace, integrates naturally with `try/catch` and standard Express error-handling middleware, and allows for `instanceof ApiError` checks.
 * 2. Why capture the stack trace manually using `Error.captureStackTrace`?
 *    - Answer: It ensures the stack trace starts from where the error was thrown, omitting the constructor itself from the trace, making debugging cleaner.
 * 3. What is the purpose of the `success: boolean` flag?
 *    - Answer: To provide a consistent response structure across the entire API, so frontend clients can predictably check `response.success`.
 */
