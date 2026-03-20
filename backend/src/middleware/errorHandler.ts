import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { env } from "../config/env";

export interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const statusCode = err.statusCode ?? 500;
  const message = statusCode === 500 ? "Internal Server Error" : err.message;

  logger.error(err.message, { statusCode, stack: err.stack });

  res.status(statusCode).json({
    status: "error",
    message,
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
}
