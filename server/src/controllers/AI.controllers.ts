import { Request, Response } from "express";
import Together from "together-ai";
import asyncHandler from "../utils/asyncHandler";
import "../utils/env";

const together = new Together();
export const askAssistant = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("User request recieved for ai assistant");
    const { prompt, code } = req.body;
    try {
      const response = await together.chat.completions.create({
        model: "deepseek-ai/DeepSeek-V3",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful coding assistant. You can use code for getting context.  Try to give answer without markdown (in simple words and normal code).",
          },
          { role: "user", content: `${prompt}/n/n${code}` },
        ],
      });

      if (
        response.choices &&
        response.choices.length > 0 &&
        response.choices[0].message
      ) {
        const answer = response.choices[0].message.content;
        res.json({ answer });
      } else {
        res.status(500).json({ error: "Failed to fetch AI response" });
      }
    } catch (error: any) {
      console.error("AI error:", error.message);
      res.status(500).json({ error: "Failed to fetch AI response" });
    }
  }
);

export const askSuggestion = asyncHandler(
  async (req: Request, res: Response) => {
    console.log(`User request recieved for suggestion`);
    const { code } = req.body;
    try {
      const response = await together.chat.completions.create({
        model: "deepseek-ai/DeepSeek-V3",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful coding assistant.Your work is to provide suggestion based on the code provided. Try to give answer without markdown (in simple words and normal code).",
          },
          { role: "user", content: `${code}` },
        ],
      });

      if (
        response.choices &&
        response.choices.length > 0 &&
        response.choices[0].message
      ) {
        const answer = response.choices[0].message.content;
        res.json({ answer });
      } else {
        res.status(500).json({ error: "Failed to fetch AI response" });
      }
    } catch (error: any) {
      console.error("AI error:", error.message);
      res.status(500).json({ error: "Failed to fetch AI response" });
    }
  }
);

/*
 * ===========================================================================================
 *                              NOTES — AI.controllers.ts
 * ===========================================================================================
 *
 * PURPOSE: Handles API requests related to AI code assistance and suggestions using the Together AI API.
 * ROLE IN ARCHITECTURE: Controller Layer. Parses frontend requests, communicates with external AI services, and returns the AI's response to the client.
 * 
 * IMPORTS:
 * - `Request, Response`: Express typings.
 * - `together-ai`: SDK for interacting with Together AI's LLM endpoints.
 * - `asyncHandler`: Utility to auto-catch promise rejections.
 * - `env`: To ensure API keys are loaded.
 * 
 * FUNCTION-BY-FUNCTION ANALYSIS:
 * - `askAssistant(req, res)`
 *   - Does: Takes a user prompt and current code context, sends it to Together AI (using `deepseek-ai/DeepSeek-V3`), and returns the assistant's answer.
 *   - Parameters: Extracts `prompt` and `code` from `req.body`.
 *   - Returns: JSON response with `{ answer: "..." }`.
 *   - Side effects: Makes an external HTTP/WebSocket request to Together AI.
 *   - Edge cases: Includes a custom `try/catch` block that overrides `asyncHandler` for manual logging and specific 500 error mapping.
 * 
 * - `askSuggestion(req, res)`
 *   - Does: Takes only the current code and asks the AI for proactive suggestions or improvements.
 *   - Parameters: Extracts `code` from `req.body`.
 *   - Returns: JSON response with `{ answer: "..." }`.
 *   - Side effects: Makes an external request to Together AI.
 * 
 * HOW THIS FILE CONNECTS TO OTHER FILES:
 * - Inbound: Routed via `AI.routes.ts`.
 * - Outbound: Calls Together AI API.
 * 
 * DESIGN PATTERNS:
 * - Proxy Pattern: The server acts as a proxy between the frontend client and the Together AI API. This hides the Together AI API key from the frontend and allows backend control over rate limits and prompts.
 * 
 * POTENTIAL INTERVIEW QUESTIONS:
 * 1. Why is the AI request made from the backend instead of directly from the React frontend?
 *    - Answer: Security. If the frontend calls Together AI directly, the API key must be shipped to the client, exposing it to theft. Routing it through the backend keeps the key secure.
 * 2. Notice you used `try/catch` inside `asyncHandler`. Is this redundant?
 *    - Answer: Yes and no. `asyncHandler` prevents crashes by passing unhandled errors to Express's `next()`. However, the explicit `try/catch` here intercepts the error *before* `asyncHandler` catches it, allowing the controller to return a specific `res.status(500).json(...)` response instead of relying on a global error handler.
 */
