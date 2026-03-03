import ErrorHandler from "./request-handlers";
import { HTTPError } from "h3";
import { HttpContext } from "clear-router/types/h3";

export class RequestError extends HTTPError {
  status: number;

  constructor(message?: string, statusCode: number = 400, options?: ErrorOptions) {
    super(message ?? "Bad Request", { ...options, status: statusCode });
    this.status = statusCode;
  }

  /**
   * @param value
   * @param message
   * @param code
   */
  static assertFound<T> (
    value: T | null | undefined,
    message: string,
    code: number = 404,
    ctx?: HttpContext,
  ): asserts value is T {
    if (!value) {
      if (ctx) {
        return ErrorHandler(new RequestError(message, code), ctx) as any;
      }

      throw new RequestError(message, code);
    }
  }

  /**
   * @param boolean
   * @param message
   * @param code
   * @param req
   * @param res
   * @throws {RequestError} Throws a RequestError if the boolean condition is true. If req and res are provided, it will send the error response immediately.
   */
  static abortIf<T> (
    boolean: T,
    message: string,
    code?: number,
    ctx?: HttpContext,
  ): asserts boolean is T {
    if (boolean) {
      if (ctx) {
        return ErrorHandler(new RequestError(message, code), ctx) as never;
      }

      throw new RequestError(message, code);
    }
  }
}

export class AutheticationError extends RequestError {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, 401, options);
    this.message = message ?? "Unauthenticated";
  }
}
