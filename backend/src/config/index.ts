import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",

  // JWT
  jwtSecret: process.env.JWT_SECRET || "househunt_dev_secret_change_in_production",
  jwtAccessExpiresIn: "15m",
  jwtRefreshExpiresInMs: 7 * 24 * 60 * 60 * 1000, // 7 days

  // Bcrypt
  bcryptSaltRounds: 12,

  // Rate limiting
  rateLimitWindowMs: 60 * 60 * 1000, // 1 hour
  rateLimitMaxInquiries: 5,           // 5 inquiries per window per IP
  rateLimitMaxLogin: 10,              // 10 login attempts per window per IP

  // Database (for future PostgreSQL integration)
  databaseUrl: process.env.DATABASE_URL || "",

  // App
  appUrl: process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`,
};
