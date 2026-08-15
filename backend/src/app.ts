import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { config } from "./config";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { generalLimiter } from "./middleware/rateLimiter";
import { setupSwagger } from "./docs/swagger";

// Route imports
import authRoutes from "./routes/auth.routes";
import listingsRoutes from "./routes/listings.routes";
import inquiriesRoutes from "./routes/inquiries.routes";

/**
 * Express app factory — creates and configures the Express application.
 * Separated from server bootstrap for testability.
 */
export function createApp(): express.Express {
  const app = express();

  // =================== Global Middleware ===================

  // Security headers
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // Disable for development
  }));

  // CORS — allow Next.js frontend
  app.use(cors({
    origin: config.nodeEnv === "production"
      ? config.appUrl
      : ["http://localhost:3000", "http://localhost:5000"],
    credentials: true,
  }));

  // Request logging
  if (config.nodeEnv !== "test") {
    app.use(morgan("dev"));
  }

  // Body parsing
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // General rate limiting
  app.use("/api/", generalLimiter);

  // =================== Swagger Documentation ===================
  setupSwagger(app);

  // =================== API Routes ===================
  app.use("/api/auth", authRoutes);
  app.use("/api/listings", listingsRoutes);
  app.use("/api/inquiries", inquiriesRoutes);

  // Also support legacy /api/properties path for backward compatibility
  app.use("/api/properties", listingsRoutes);

  // =================== Health Check ===================
  app.get("/api/health", (_req, res) => {
    res.json({
      success: true,
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // =================== Error Handling ===================
  // 404 handler for unmatched API routes
  app.use("/api/*", notFoundHandler);

  // Central error handler — consistent JSON error shape
  app.use(errorHandler);

  return app;
}
