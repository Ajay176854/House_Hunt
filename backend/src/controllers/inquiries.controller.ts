import { Request, Response, NextFunction } from "express";
import * as inquiriesService from "../services/inquiries.service";

/**
 * POST /api/listings/:id/inquiries
 * Create inquiry for a property.
 * Rate limiting + Zod validation applied in route middleware.
 * Duplicate prevention + honeypot check in service layer.
 */
export async function createInquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Merge propertyId from URL params into body for service
    const input = { ...req.body, propertyId: req.params.id || req.body.propertyId };
    const userId = req.user?.id; // guest support
    const result = await inquiriesService.createInquiry(input, userId);

    res.status(201).json({
      success: true,
      message: "Your inquiry has been sent directly to the owner! They will reach out to you shortly.",
      inquiry: result.inquiry,
      ownerContact: result.ownerContact,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/inquiries/my
 * Protected: Inquiries received by the authenticated owner.
 */
export async function getMyInquiries(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, error: { message: "Authentication required." } });
    return;
  }

  const data = await inquiriesService.getOwnerInquiries(req.user.id);
  res.json({ success: true, data, total: data.length });
}

/**
 * PATCH /api/inquiries/:id/status
 * Protected: Update inquiry status (owner only).
 */
export async function updateInquiryStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      return next({ statusCode: 401, message: "Authentication required." });
    }

    const { status } = req.body;
    const updated = await inquiriesService.updateInquiryStatus(req.params.id, status, req.user.id);

    res.json({
      success: true,
      message: "Status updated.",
      inquiry: updated,
    });
  } catch (err) {
    next(err);
  }
}
