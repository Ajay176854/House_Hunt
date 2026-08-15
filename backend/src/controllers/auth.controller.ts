import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";

/**
 * POST /api/auth/register
 * Hash password (bcrypt), create user, issue access + refresh tokens.
 */
export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await authService.createUser(req.body);
    const result = await authService.loginUser({ email: req.body.email, password: req.body.password });

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token: result.accessToken,      // backward compat with frontend
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Verify password, issue access token (short-lived, ~15min) + refresh token.
 */
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await authService.loginUser(req.body);

    res.json({
      success: true,
      message: "Login successful!",
      token: result.accessToken,       // backward compat
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/refresh
 * Rotate refresh token, issue new access token.
 */
export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken } = req.body;
    const result = await authService.rotateRefreshToken(refreshToken);

    res.json({
      success: true,
      token: result.accessToken,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/logout
 * Invalidate refresh token.
 */
export function logout(req: Request, res: Response): void {
  const { refreshToken } = req.body;
  if (refreshToken) {
    authService.revokeRefreshToken(refreshToken);
  }

  res.json({ success: true, message: "Logged out successfully." });
}

/**
 * GET /api/auth/me
 * Get current authenticated user profile.
 */
export function getMe(req: Request, res: Response): void {
  res.json({ success: true, user: req.user });
}
