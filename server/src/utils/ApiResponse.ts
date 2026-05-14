class ApiResponse {
  statusCode: number;
  message?: string;
  data?: any;
  success: boolean;
  constructor(statusCode: number, message?: string, data?: any) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }
}

export default ApiResponse;

/*
 * ===========================================================================================
 *                              NOTES — ApiResponse.ts
 * ===========================================================================================
 *
 * PURPOSE: Standardizes the shape of successful HTTP responses sent back to the client.
 * ROLE IN ARCHITECTURE: Shared Utility layer. Used by all controllers to wrap data before calling `res.send()` or `res.json()`.
 * 
 * IMPORTS: None.
 * 
 * FUNCTION-BY-FUNCTION ANALYSIS:
 * - `constructor(statusCode, message, data)`
 *   - Does: Creates a structured response object. Automatically computes the `success` flag based on whether the `statusCode` is below 400.
 *   - Parameters:
 *     - `statusCode` (number): HTTP status code (e.g., 200, 201).
 *     - `message` (string, optional): Human-readable success message.
 *     - `data` (any, optional): The actual payload/data to be returned to the client.
 *   - Returns: Instance of `ApiResponse`.
 *   - Side effects: None.
 * 
 * HOW THIS FILE CONNECTS TO OTHER FILES:
 * - Inbound (who calls this): All API controllers (`healthCheck.controllers.ts`, `connection.controllers.ts`, etc.).
 * - Outbound (what this calls): None.
 * 
 * DESIGN PATTERNS:
 * - Data Transfer Object (DTO) Wrapper: Standardizes the outgoing data format for consistent frontend consumption.
 * 
 * POTENTIAL INTERVIEW QUESTIONS:
 * 1. How does this class determine the `success` property automatically?
 *    - Answer: It checks if `statusCode < 400`. Since 1xx, 2xx, and 3xx are not errors, anything below 400 is considered a successful operation.
 * 2. Why use a class for responses instead of inline object literals in controllers?
 *    - Answer: Consistency. It ensures every endpoint follows the exact same `{ statusCode, message, data, success }` contract without duplicating the logic or making a typo.
 * 3. How does this pair with `ApiError`?
 *    - Answer: `ApiResponse` handles the happy path (sent explicitly in try blocks), while `ApiError` handles the sad path (thrown and caught by an error middleware).
 */
