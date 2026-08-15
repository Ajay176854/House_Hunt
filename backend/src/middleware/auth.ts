import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, getUserById, SafeUser } from "../services/auth.service";
import { createApiError } from "./errorHandler";

// Extend Express Request to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: SafeUser;
    }
  }
}

/**
 * requireAuth — Verifies JWT access token from Authorization header.
 * Attaches the authenticated user to req.user.
 */
export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(createApiError("Authentication required. Please provide a valid Bearer token.", 401));
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyAccessToken(token);
    if (!payload) {
      return next(createApiError("Session expired or invalid token. Please log in again.", 401));
    }

    const user = await getUserById(payload.userId);
    if (!user) {
      return next(createApiError("User account not found.", 401));
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      savedProperties: user.saved_properties || [],
      createdAt: new Date(user.created_at).toISOString(),
    };
    
    next();
  } catch (err: any) {
    if (err.statusCode) {
      next(err);
    } else {
      next(createApiError("Authentication failed.", 401));
    }
  }
}

/**
 * requireOwnership — Middleware factory that checks if the authenticated user
 * owns the resource being accessed. Must be used AFTER requireAuth.
 * 
 * @param getOwnerId - Function to extract the owner ID from the request context
 */
export function requireOwnership(getOwnerId: (req: Request) => string | null) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(createApiError("Authentication required.", 401));
    }

    const ownerId = getOwnerId(req);
    if (ownerId === null) {
      return next(createApiError("Resource not found.", 404));
    }

    if (ownerId !== req.user.id) {
      return next(
        createApiError(
          "Access Denied: You do not have permission to modify this resource because you are not the owner.",
          403
        )
      );
    }

    next();
  };
}
