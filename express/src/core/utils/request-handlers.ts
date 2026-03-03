import { NextFunction, Request, Response } from "express";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

import { BaseError } from "./errors";
import { Prisma } from "@prisma/client";
import { ValidationException } from "kanun";
import { env } from "./helpers";
import path from "node:path";

/**
 * Global error handler for the Express application. 
 * It handles both string errors and instances of BaseError, logs the 
 * error details to a file, and sends a JSON response with the error information.
 * 
 * @param err 
 * @param req 
 * @param res 
 * @param next 
 */
export const ErrorHandler = (
  err: BaseError | string,
  req: Request,
  res: Response,
  next?: NextFunction,
) => {
  const logsDir = path.resolve(process.cwd(), "storage/logs");
  const message = "Something went wrong";
  let logContent = "";

  // oxlint-disable-next-line typescript/no-explicit-any
  const error: Record<string, any> = {
    status: "error",
    code: typeof err === "string" || !err.statusCode ? 500 : err.statusCode,
    message: typeof err === "string" ? `${message}: ${err}` : err.message || message,
  };

  if (typeof err !== "string" && err.errors) {
    error.errors = err.errors;
  } else if (typeof err !== "string" && err.stack) {
    const [stack, ...rest] = err.stack.split("\n");
    const [key, content] = stack.split(":");
    error.errors = { [key]: [content.trim(), ...rest.map((e) => e.trim())] };
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
    error.code = 404;
    error.message = `${err.meta?.modelName} not found!`;
  }

  if (err instanceof ValidationException) {
    error.code = 422;
    error.message = err.message;
    error.errors = err.errors();
  }

  if (
    typeof err !== "string" &&
    env("NODE_ENV") === "development" &&
    env<boolean>("HIDE_ERROR_STACK") !== true &&
    !(err instanceof ValidationException)
  ) {
    error.stack = err.stack;
  }

  try {
    mkdirSync(logsDir, { recursive: true });
    logContent = readFileSync(path.join(logsDir, "error.log"), "utf-8");
  } catch { /** */ }

  if (!(err instanceof ValidationException)) {
    const newLogEntry = `[${new Date().toISOString()}] ${typeof err === "string" ? err : err.stack || err.message}\n\n`;
    writeFileSync(path.join(logsDir, "error.log"), logContent + newLogEntry, "utf-8");
  }

  res.statusMessage = error.message;
  res.status(error.code).json(error);
  if (next) next();
};

export default ErrorHandler;
