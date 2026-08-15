import { Request, Response, NextFunction } from "express";

/**
 * Consistent error response shape for all API errors.
 * 
 * Shape: { success: false, error: { message, statusCode, details? } }
 */
export interface ApiError extends Error {
  statusCode?: number;
  details?: unknown;
}

export function createApiError(message: string, statusCode: number, details?: unknown): ApiError {
  const error = new Error(message) as ApiError;
  error.statusCode = statusCode;
  error.details = details;
  return error;
}

/**
 * Central error-handling middleware.
 * All thrown/next(err) errors funnel here for consistent JSON responses.
 */
export function errorHandler(err: ApiError, _req: Request, res: Response, _next: NextFunction): void {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log 5xx errors for debugging
  if (statusCode >= 500) {
    console.error(`[ERROR ${statusCode}]`, err.stack || err.message);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      ...(err.details ? { details: err.details } : {}),
    },
  });
}

/**
 * Catch-all for unhandled routes — produces 404.
 */
export function notFoundHandler(_req: Request, _res: Response, next: NextFunction): void {
  next(createApiError("The requested resource was not found.", 404));
}
