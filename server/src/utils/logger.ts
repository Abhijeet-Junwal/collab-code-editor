import { createLogger, format, transports } from "winston";
import Transport from "winston-transport";
import fs from "fs";
import path from "path";

const { combine, timestamp, printf, colorize } = format;
const isProd = process.env.NODE_ENV === "production";

// Custom format for console logging
const consoleLogFormat = printf(({ level, message, timestamp }) => {
  return `\n${timestamp} [${level}]: ${message}`;
});

// Custom format for file logging (JSON)
const fileLogFormat = combine(
  timestamp(),
  format.errors({ stack: true }),
  format.json()
);

// Create logs directory path
const logsDir = path.join(__dirname, "../../logs");

// Ensure log directory exists for file transports.
fs.mkdirSync(logsDir, { recursive: true });

// Create a Winston logger
const loggerTransports: Transport[] = [
  // File transport
  new transports.File({
    filename: path.join(logsDir, "app.log"),
    format: fileLogFormat,
  }),
  // Error-only file transport
  new transports.File({
    filename: path.join(logsDir, "error.log"),
    level: "error",
    format: fileLogFormat,
  }),
];

if (!isProd) {
  loggerTransports.unshift(
    new transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        consoleLogFormat
      ),
    })
  );
}

const logger = createLogger({
  level: isProd ? "info" : "debug",
  transports: loggerTransports,
  exceptionHandlers: [
    new transports.File({
      filename: path.join(logsDir, "exceptions.log"),
      format: fileLogFormat,
    }),
  ],
});

// Log unhandled promise rejections
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
});

export default logger;
