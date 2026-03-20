import { env } from "../config/env";

type LogLevel = "info" | "warn" | "error" | "debug";

const COLORS: Record<LogLevel, string> = {
  info:  "\x1b[36m",  // cyan
  warn:  "\x1b[33m",  // yellow
  error: "\x1b[31m",  // red
  debug: "\x1b[90m",  // gray
};
const RESET = "\x1b[0m";

function log(level: LogLevel, message: string, meta?: unknown): void {
  if (level === "debug" && env.NODE_ENV === "production") return;

  const timestamp = new Date().toISOString();
  const color = COLORS[level];
  const prefix = `${color}[${level.toUpperCase()}]${RESET} ${timestamp}`;
  const metaStr = meta !== undefined ? ` ${JSON.stringify(meta)}` : "";

  console[level === "error" ? "error" : "log"](`${prefix} ${message}${metaStr}`);
}

export const logger = {
  info:  (msg: string, meta?: unknown) => log("info",  msg, meta),
  warn:  (msg: string, meta?: unknown) => log("warn",  msg, meta),
  error: (msg: string, meta?: unknown) => log("error", msg, meta),
  debug: (msg: string, meta?: unknown) => log("debug", msg, meta),
};
