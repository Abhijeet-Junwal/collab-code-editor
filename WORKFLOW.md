# Collab Code Editor — Workflow & Deployment Guide

This document outlines the standard development workflows, architectural constraints, and considerations for deploying the Collab Code Editor.

---

## 1. Local Development Workflow

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI
- API Keys:
  - Clerk (for Authentication)
  - Together AI (for the AI Assistant)

### Environment Setup
1. **Server**:
   Navigate to `/server` and create a `.env.local` file:
   ```env
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/collab-code-editor
   CORS_ORIGIN=http://localhost:3000
   TOGETHER_API_KEY=your_together_ai_key
   ```
2. **Client**:
   Navigate to `/client` and create a `.env.local` file:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   NEXT_PUBLIC_ENABLE_AI=true
   ```

### Running the App
The application relies on concurrent execution of both the client and the server.
1. Start the Server:
   ```bash
   cd server
   npm run dev
   ```
2. Start the Client:
   ```bash
   cd client
   npm run dev
   ```

---

## 2. Testing the Collaborative Features Locally

To test real-time Socket.io synchronization locally without deploying:
1. Open Google Chrome and navigate to `http://localhost:3000`.
2. Create a new Room and enter it.
3. Open a completely different browser (e.g., Firefox, Safari) OR open an Incognito Window in Chrome.
   *(Note: Two tabs in the same standard Chrome session share Local Storage, which can confuse the Zustand state sync. Incognito ensures a clean test).*
4. Navigate to the exact same URL (`http://localhost:3000/Home/YOUR_ROOM_ID`).
5. Type in the Monaco editor in one window and watch it replicate in the other window.

---

## 3. Deployment Considerations

### The Backend (Node.js/Socket.io)
The backend maintains persistent WebSocket connections. This introduces specific challenges for deployment:
- **Statefulness**: Because users connect directly to a specific server instance via websockets, you cannot simply deploy this behind a standard round-robin load balancer if you have multiple server instances. 
- **Sticky Sessions**: If deploying multiple Node.js instances (e.g., on AWS ECS or Heroku), you MUST enable "Sticky Sessions" (Session Affinity) on your load balancer. This ensures that a client's HTTP polling requests (which Socket.io uses as a fallback) hit the exact same server instance that holds their socket connection.
- **Redis Adapter**: If two users in the same "Room" connect to two *different* Node.js servers, they will not see each other's messages. To scale horizontally beyond one server, you must implement the `@socket.io/redis-adapter`. This uses a Redis pub/sub mechanism to broadcast socket events across multiple server instances.

### The Frontend (Next.js)
The frontend is a standard Next.js App Router application.
- **Vercel**: The recommended host for Next.js. 
- **Environment Variables**: Ensure `NEXT_PUBLIC_BACKEND_URL` is updated in your hosting dashboard to point to your deployed Node.js backend (e.g., `https://api.collabeditor.com`) rather than `localhost`.

### The Database (MongoDB)
- The current architecture writes to MongoDB heavily (on debounced keystrokes). If deploying to a serverless MongoDB instance (like Mongo Atlas free tier), be mindful of write-operation quotas.
- Ensure the backend's IP address is whitelisted in MongoDB Atlas Network Access settings.

---

## 4. Current Known Limitations & Technical Debt

If extending this project, the following areas require immediate attention:

1. **Database Thrashing**: The `code-change` event in `app.ts` performs a `.findOneAndUpdate` on MongoDB. For 10 users typing rapidly, this translates to dozens of DB writes per second. **Fix:** Move active room state to Redis, and flush to MongoDB only on room closure.
2. **Client-Side Execution Execution**: The `RunButton.tsx` makes HTTP POST requests directly to `ce.judge0.com`. **Fix:** Route this through the Node.js backend to protect API keys and implement rate-limiting.
3. **Error Handling Silencing**: In `connection.controllers.ts`, some `try/catch` blocks catch errors but do not utilize `res.status().json()`, potentially leaving the client's HTTP request hanging until it times out. **Fix:** Ensure all catch blocks return an `ApiError`.
