import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { config } from "../config";
import { db } from "../db";
// Removed frontend types import

import { createApiError } from "../middleware/errorHandler";

// Types from frontend/src/types that backend needs
export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  avatar?: string;
  savedProperties: string[];
  createdAt: string;
}

// =================== Password Hashing ===================

export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, config.bcryptSaltRounds);
}

export async function verifyPassword(plainPassword: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hash);
}

// =================== JWT Tokens ===================

interface AccessTokenPayload {
  userId: string;
  email: string;
}

export function signAccessToken(userId: string, email: string): string {
  return jwt.sign({ userId, email } as AccessTokenPayload, config.jwtSecret, {
    expiresIn: config.jwtAccessExpiresIn as any,
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    return jwt.verify(token, config.jwtSecret) as AccessTokenPayload;
  } catch {
    return null;
  }
}

// =================== Refresh Tokens ===================

export async function createRefreshToken(userId: string): Promise<string> {
  const rawToken = uuidv4();
  const tokenHash = await bcrypt.hash(rawToken, 10);
  const tokenId = uuidv4();
  const expiresAt = new Date(Date.now() + config.jwtRefreshExpiresInMs);

  await db.query(
    `INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, revoked, created_at)
     VALUES ($1, $2, $3, $4, false, now())`,
    [tokenId, userId, tokenHash, expiresAt]
  );

  return `${tokenId}:${rawToken}`;
}

export async function rotateRefreshToken(
  compoundToken: string
): Promise<{ accessToken: string; refreshToken: string; user: SafeUser }> {
  const parts = compoundToken.split(":");
  if (parts.length !== 2) {
    throw createApiError("Invalid refresh token format.", 401);
  }

  const [tokenId, rawToken] = parts;
  
  const { rows: tokens } = await db.query(`SELECT * FROM refresh_tokens WHERE id = $1`, [tokenId]);
  const record = tokens[0];

  if (!record || record.revoked) {
    throw createApiError("Refresh token is invalid or has been revoked.", 401);
  }

  if (new Date(record.expires_at) < new Date()) {
    await db.query(`UPDATE refresh_tokens SET revoked = true WHERE id = $1`, [tokenId]);
    throw createApiError("Refresh token has expired. Please log in again.", 401);
  }

  const isValid = await bcrypt.compare(rawToken, record.token_hash);
  if (!isValid) {
    await db.query(`UPDATE refresh_tokens SET revoked = true WHERE user_id = $1`, [record.user_id]);
    throw createApiError("Refresh token mismatch. All sessions revoked for security.", 401);
  }

  await db.query(`UPDATE refresh_tokens SET revoked = true WHERE id = $1`, [tokenId]);

  const { rows: users } = await db.query(`SELECT * FROM users WHERE id = $1`, [record.user_id]);
  const user = users[0];
  
  if (!user) {
    throw createApiError("User account not found.", 401);
  }

  const accessToken = signAccessToken(user.id, user.email);
  const newRefreshToken = await createRefreshToken(user.id);

  const safeUser: SafeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    avatar: user.avatar,
    savedProperties: user.saved_properties || [],
    createdAt: new Date(user.created_at).toISOString(),
  };

  return { accessToken, refreshToken: newRefreshToken, user: safeUser };
}

export async function revokeRefreshToken(compoundToken: string): Promise<void> {
  const parts = compoundToken.split(":");
  if (parts.length !== 2) return;
  const [tokenId] = parts;
  await db.query(`UPDATE refresh_tokens SET revoked = true WHERE id = $1`, [tokenId]);
}

// =================== User Services ===================

export async function getUserByEmail(email: string) {
  const { rows } = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
  return rows[0] || null;
}

export async function getUserById(id: string) {
  const { rows } = await db.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return rows[0] || null;
}

export async function createUser(data: any): Promise<SafeUser> {
  const existing = await getUserByEmail(data.email);
  if (existing) {
    throw createApiError("Email is already registered.", 400);
  }

  const passwordHash = await hashPassword(data.password);
  const id = uuidv4();

  const { rows } = await db.query(
    `INSERT INTO users (id, name, email, password_hash, phone, role)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [id, data.name, data.email, passwordHash, data.phone || null, data.role || 'user']
  );

  const user = rows[0];

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    avatar: user.avatar,
    savedProperties: user.saved_properties || [],
    createdAt: new Date(user.created_at).toISOString(),
  };
}

export async function loginUser(data: any): Promise<{ accessToken: string; refreshToken: string; user: SafeUser }> {
  const existing = await getUserByEmail(data.email);
  if (!existing) {
    throw createApiError("Invalid credentials.", 401);
  }

  const isValid = await verifyPassword(data.password, existing.password_hash);
  if (!isValid) {
    throw createApiError("Invalid credentials.", 401);
  }

  const accessToken = signAccessToken(existing.id, existing.email);
  const refreshToken = await createRefreshToken(existing.id);

  const safeUser: SafeUser = {
    id: existing.id,
    name: existing.name,
    email: existing.email,
    role: existing.role,
    phone: existing.phone,
    avatar: existing.avatar,
    savedProperties: existing.saved_properties || [],
    createdAt: existing.created_at,
  };

  return { accessToken, refreshToken, user: safeUser };
}

