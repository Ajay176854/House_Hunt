import rateLimit from "express-rate-limit";
import { config } from "../config";

/**
 * Rate limiter for inquiry submissions.
 * 5 inquiries per hour per IP.
 */
export const inquiryLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxInquiries,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: "Too many inquiries submitted. Please try again after an hour.",
      statusCode: 429,
    },
  },
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise IP
    return (req.user?.id || req.ip || "unknown") as string;
  },
});

/**
 * Rate limiter for login/register attempts.
 * 10 attempts per hour per IP.
 */
export const authLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxLogin,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: "Too many authentication attempts. Please try again after an hour.",
      statusCode: 429,
    },
  },
});

/**
 * General API rate limiter.
 * 100 requests per 15 minutes per IP.
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: "Too many requests. Please slow down.",
      statusCode: 429,
    },
  },
});
