import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { createApiError } from "./errorHandler";

/**
 * Zod validation middleware factory.
 * Validates req.body against a Zod schema.
 * Returns 400 with detailed field-level errors on failure.
 */
export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req.body);
      // Replace body with parsed/transformed values (e.g., trimmed strings)
      req.body = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors = err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));

        return next(
          createApiError("Validation failed. Please check your input.", 400, fieldErrors)
        );
      }
      next(err);
    }
  };
}

/**
 * Validate query parameters against a Zod schema.
 */
export function validateQuery(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req.query);
      req.query = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors = err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));

        return next(
          createApiError("Invalid query parameters.", 400, fieldErrors)
        );
      }
      next(err);
    }
  };
}
