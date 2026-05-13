# TODO

## Immediate
- Add client .env.local with NEXT_PUBLIC_BACKEND_URL (backend origin) and Clerk keys or disable Clerk middleware if not used.
- Add server env with MONGODB_URI, DB_NAME, PORT, CORS_ORIGIN, TOGETHER_API_KEY.
- Mount file router in server/src/app.ts so file CRUD routes work.
- Replace hardcoded roomId in client/src/store/useFileTreeStore.ts with the actual room id from routing/state.
- Guard socket init in client/src/lib/socket.ts against missing backend URL and add basic error handling.

## Short-term
- Add input validation (e.g., zod/express-validator) for AI, file, and connection controllers; return consistent error shapes.
- Add auth/authorization for APIs and sockets (Clerk/JWT) to restrict room access and mutations.
- Configure CORS correctly and add rate limiting, especially on AI endpoints.
- Add server-side IDs and indexes for file documents; avoid client-generated IDs.
- Normalize responses via ApiResponse; add try/catch where missing.

## Long-term
- Add tests (unit/integration/e2e) and CI.
- Improve logging/monitoring and log rotation; add metrics.
- Document APIs and architecture; remove dead/commented code (Passwords.ts).
- Consider versioning/persistence improvements for code and file trees and add optimistic concurrency for socket updates.
