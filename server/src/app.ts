import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import "./utils/env";

//import routers
import healthCheckRouter from "./routers/healthCheck.routers";
import AIRouter from "./routers/AI.routes";
import connectionRouter from "./routers/connection.routers";
import { codeExecution } from "./models/Connection.model";
const app = express();
const httpServer = createServer(app);
const isProd = process.env.NODE_ENV === "production";
const rawCorsOrigin = process.env.CORS_ORIGIN || "";
const corsOrigins = rawCorsOrigin
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOrigin =
  corsOrigins.length > 0 ? corsOrigins : isProd ? undefined : "*";

const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
    methods: ["GET", "POST"],
  },
});
app.use(
  cors({
    origin: corsOrigin || false,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// routes
app.use("/api/health", healthCheckRouter);
app.use("/api/ai", AIRouter);
app.use("/api", connectionRouter);

io.on("connection", (socket) => {
  socket.on("join-room", async ({ roomId }, ack) => {
    if (!roomId) {
      if (typeof ack === "function") {
        ack({ ok: false, error: "Missing roomId" });
      }
      return;
    }
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    const currentCode = await codeExecution.findOne({ roomId });
    if (currentCode) {
      socket.emit("receive-changes", currentCode.currentCodeContent);
    }

    if (typeof ack === "function") {
      ack({ ok: true });
    }
  });

  socket.on("code-change", async ({ roomId, code }) => {
    if (!roomId || typeof code !== "string") {
      return;
    }
    socket.to(roomId).emit("receive-changes", code);
    const currentCode = await codeExecution.findOne({ roomId });
    if (currentCode) {
      currentCode.currentCodeContent = code;
      await currentCode.save();
    } else {
      if (!code.trim()) {
        return;
      }
      const newCode = new codeExecution({
        roomId: roomId,
        currentCodeContent: code,
      });
      await newCode.save();
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("user disconnected from socket", reason);
  });
});

export { httpServer, io };
