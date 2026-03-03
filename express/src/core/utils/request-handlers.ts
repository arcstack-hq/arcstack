import { NextFunction, Request, Response } from "express";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

import { BaseError } from "./errors";
import { Prisma } from "@prisma/client";
import { ServerResponse } from "node:http";
import { ValidationException } from "kanun";
import { buildHtmlErrorResponse } from "@arkstack/common";
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
  err: BaseError | string | ServerResponse,
  req: Request,
  res: Response,
  _next?: NextFunction,
) => {
  const logsDir = path.resolve(process.cwd(), "storage/logs");
  const message = "Something went wrong";
  let logContent = "";

  // oxlint-disable-next-line typescript/no-explicit-any
  const error: Record<string, any> = {
    status: "error",
    code: typeof err === "string" || !(err instanceof BaseError) ? 500 : err.statusCode,
    message: typeof err === "string" ? `${message}: ${err}` : err instanceof BaseError ? err.message : message,
  };

  if (typeof err !== "string" && err instanceof BaseError && err.errors) {
    error.errors = err.errors;
  } else if (typeof err !== "string" && (err as BaseError).stack) {
    const [stack, ...rest] = (err as BaseError)?.stack?.split("\n") ?? [];
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
    error.stack = err instanceof BaseError ? err.stack : undefined;
  }

  try {
    mkdirSync(logsDir, { recursive: true });
    logContent = readFileSync(path.join(logsDir, "error.log"), "utf-8");
  } catch { /** */ }

  if (!(err instanceof ValidationException)) {
    const newLogEntry = `[${new Date().toISOString()}] ${typeof err === "string" ? err : err instanceof BaseError ? err.stack || err.message : err.statusMessage}\n\n`;
    writeFileSync(path.join(logsDir, "error.log"), logContent + newLogEntry, "utf-8");
  }

  res.statusMessage = error.message;

  // If the request is an API call, return a JSON response. Otherwise, you might want to render an error page.
  const headers = req instanceof ServerResponse ? req.getHeaders() : req.headers;

  if (headers.accept?.includes("application/json")) {
    return res.status(error.code).json(error);
  } else {
    return res.status(error.code).setHeader("Content-Type", "text/html").send(buildHtmlErrorResponse({
      message: error.message,
      stack: error.stack,
      code: error.code,
    }));
  }
};

export default ErrorHandler;
