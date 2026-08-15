import { Router } from "express";
import * as inquiriesController from "../controllers/inquiries.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { inquiryLimiter } from "../middleware/rateLimiter";
import { createInquirySchema, updateInquiryStatusSchema } from "../validators/inquiries.schema";

const router = Router();

/**
 * @swagger
 * /api/inquiries:
 *   post:
 *     tags: [Inquiries]
 *     summary: Send an inquiry to the property owner
 *     description: |
 *       Rate limited (5/hour per IP/user). Validates with Zod.
 *       Duplicate prevention: UNIQUE(property_id, email) + 24h time-window.
 *       Spam prevention: honeypot field, required fields, email format validation.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [propertyId, senderName, senderEmail, senderPhone]
 *             properties:
 *               propertyId:
 *                 type: string
 *               senderName:
 *                 type: string
 *               senderEmail:
 *                 type: string
 *                 format: email
 *               senderPhone:
 *                 type: string
 *               message:
 *                 type: string
 *               visitDate:
 *                 type: string
 *               visitTimeSlot:
 *                 type: string
 *               userType:
 *                 type: string
 *                 enum: [Buyer, Tenant, Investor]
 *               website:
 *                 type: string
 *                 description: Honeypot field — must be empty. Bots auto-fill hidden fields.
 *     responses:
 *       201:
 *         description: Inquiry sent successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Property not found
 *       409:
 *         description: Duplicate inquiry within 24h
 *       429:
 *         description: Rate limit exceeded
 */
router.post("/", inquiryLimiter, validate(createInquirySchema), inquiriesController.createInquiry);

/**
 * @swagger
 * /api/inquiries/my:
 *   get:
 *     tags: [Inquiries]
 *     summary: Get inquiries received by the authenticated owner
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of inquiries
 *       401:
 *         description: Not authenticated
 */
router.get("/my", requireAuth, inquiriesController.getMyInquiries);

/**
 * @swagger
 * /api/inquiries/{id}/status:
 *   patch:
 *     tags: [Inquiries]
 *     summary: Update inquiry status (owner only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Contacted, Visit Scheduled, Closed]
 *     responses:
 *       200:
 *         description: Status updated
 *       404:
 *         description: Inquiry not found or unauthorized
 */
router.patch("/:id/status", requireAuth, validate(updateInquiryStatusSchema), inquiriesController.updateInquiryStatus);

export default router;
