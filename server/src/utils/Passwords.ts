import bcrypt from "bcrypt";
import ApiError from "./ApiError";
import logger from "./logger";

export const encryptedPassword = async (password: string) => {
  if (password) {
    // 10 is salt round
    const newPassword = await bcrypt.hash(password, 10);
    return newPassword;
  } else {
    logger.error("password is required for encryption");
    throw new ApiError(400, "password is required for encryption");
  }
};

export const comparePassword = async (
  password: string,
  encryptedPassword: string
) => {
  if (!password || !encryptedPassword) {
    logger.error("password is required for comparison");
    throw new ApiError(400, "password is required for comparison");
  }
  const result = await bcrypt.compare(password, encryptedPassword);
  return result;
};

/*
 * ===========================================================================================
 *                              NOTES — Passwords.ts
 * ===========================================================================================
 *
 * PURPOSE: Provides utility functions for securely hashing and verifying passwords.
 * ROLE IN ARCHITECTURE: Security Utility Layer. Used primarily during user registration, login, or any authentication workflows.
 * 
 * IMPORTS:
 * - `bcrypt`: Library used for hashing passwords with salts.
 * - `./ApiError`: Used to throw standardized errors for missing inputs.
 * - `./logger`: Used for logging errors when validation fails.
 * 
 * FUNCTION-BY-FUNCTION ANALYSIS:
 * - `encryptedPassword(password)`
 *   - Does: Hashes a plaintext password using bcrypt with 10 salt rounds.
 *   - Parameters: `password` (string).
 *   - Returns: Promise resolving to the hashed password string.
 *   - Side effects: CPU-intensive blocking/asynchronous operation (bcrypt hashing).
 *   - Edge cases: Throws an `ApiError` if the password is falsy.
 * 
 * - `comparePassword(password, encryptedPassword)`
 *   - Does: Compares a plaintext password attempt with a stored bcrypt hash.
 *   - Parameters: `password` (string), `encryptedPassword` (string).
 *   - Returns: Promise resolving to a boolean (true if match, false otherwise).
 *   - Side effects: CPU-intensive asynchronous comparison.
 *   - Edge cases: Throws an `ApiError` if either parameter is missing.
 * 
 * HOW THIS FILE CONNECTS TO OTHER FILES:
 * - Inbound: Authentication controllers, user models (pre-save hooks).
 * - Outbound: Calls `bcrypt`, `ApiError`, `logger`.
 * 
 * DESIGN PATTERNS:
 * - Utility/Helper Pattern: Centralizes cryptography logic so controllers/models don't need to depend directly on `bcrypt`.
 * 
 * POTENTIAL INTERVIEW QUESTIONS:
 * 1. Why use `bcrypt` instead of a standard hash like `SHA-256`?
 *    - Answer: `bcrypt` includes a salt by default and is intentionally slow (computationally expensive), making it highly resistant to brute-force and rainbow table attacks.
 * 2. What are "salt rounds" in bcrypt, and why 10?
 *    - Answer: Salt rounds define the cost factor (2^10 iterations). 10 is a good balance between security and server performance. Higher rounds increase security but slow down logins.
 * 3. Why are you throwing an `ApiError` directly from a utility function?
 *    - Answer: It guarantees that if bad data makes its way to the security layer, the request is immediately aborted and handled by the global error boundary.
 */
