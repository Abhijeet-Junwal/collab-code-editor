# Collab Code Editor

Collab Code Editor is a real-time collaborative coding workspace built with a Next.js client and an Express + Socket.IO backend. It lets multiple users join a shared room, edit code together, manage a room-based file tree, and get AI assistance while they work.

## What It Does

- Real-time code collaboration through Socket.IO rooms.
- Room-based persistence for editor content and file structure.
- A Monaco-powered editor with language selection, theming, font sizing, and local draft persistence.
- A file tree with create, rename, delete, and folder management actions.
- An AI assistant for general coding help and code suggestions.
- Code execution flow wired through the backend and surfaced from the room state.
- Clerk-based authentication support in the client.

## Tech Stack

- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS 4, Monaco Editor, MUI, Framer Motion, Zustand.
- Backend: Express, Socket.IO, MongoDB, Mongoose, Together AI, Winston.
- Auth: Clerk.

## Project Structure

- `client/` - Next.js app, editor UI, file tree, AI assistant, and client-side state.
- `server/` - API, socket events, persistence, and AI endpoints.
- `docs/` - planning notes and project tracking.

## Getting Started

### Prerequisites

- Node.js 18 or newer.
- A MongoDB database.
- A Clerk application for authentication.
- A Together AI account or equivalent credentials for the AI endpoints.

### Installation

Install dependencies from the repository root and from each app directory:

```bash
npm install
cd client && npm install
cd ../server && npm install
```

### Environment Variables

Create the required environment files for both apps.

#### Client

Set the backend URL used by the browser app:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

If your Clerk setup requires additional variables, add them here as well.

#### Server

Set the API and database configuration:

```bash
PORT=5000
CORS_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017
DB_NAME=collab_code_editor
```

Provide any Together AI credentials required by your local environment so the AI endpoints can authenticate successfully.

## Running the Project

Start the backend first, then the client.

### Server

```bash
cd server
npm run dev
```

### Client

```bash
cd client
npm run dev
```

The client typically runs on `http://localhost:3000` and the server on the port defined by `PORT`.

## Available Scripts

### Root

- `npm run typecheck` - Type-checks the client workspace.

### Client

- `npm run dev` - Starts the Next.js development server.
- `npm run build` - Builds the production client.
- `npm run start` - Starts the built client.
- `npm run lint` - Runs the Next.js lint command.

### Server

- `npm run dev` - Runs TypeScript in watch mode and restarts the server build output.
- `npm run build` - Compiles the server TypeScript.
- `npm run start` - Starts the compiled server.

## How It Works

1. A user opens the home screen, enters a room ID and username, or creates a new room.
2. The client joins the room over Socket.IO and syncs the current code state.
3. Edits are broadcast to other connected users and persisted by room.
4. The file tree is stored on the server and can be updated from the client UI.
5. The AI assistant can be opened from the editor view to ask questions or request code suggestions.

## Notes

- The backend origin must match the client origin for sockets and API requests to work correctly.
- Some flows are still wired directly from the client to the backend, so the backend URL must be reachable from the browser.
- Room IDs and file state are persisted in MongoDB, so a running database is required for collaboration features.

## License

This repository does not currently define a license.