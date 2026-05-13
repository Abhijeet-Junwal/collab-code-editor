"use client";
import { io } from "socket.io-client";
import { backendUrl } from "./env";

const socketUrl = backendUrl;
export const socket = io(socketUrl, {
  transports: ["websocket", "polling"],
  timeout: 20000,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

console.log("[socket] init", socketUrl);

socket.on("connect", () => {
  console.log("[socket] connected", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("[socket] disconnected", reason);
});

socket.on("connect_error", (error) => {
  console.warn("[socket] connect_error", error?.message || error);
});
