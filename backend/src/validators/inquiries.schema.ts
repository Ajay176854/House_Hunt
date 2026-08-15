import { z } from "zod";

export const createInquirySchema = z.object({
  propertyId: z
    .string({ required_error: "Property ID is required" })
    .trim()
    .min(1, "Property ID is required"),
  senderName: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  senderEmail: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Please provide a valid email address")
    .toLowerCase(),
  senderPhone: z
    .string({ required_error: "Phone number is required" })
    .trim()
    .min(10, "Phone number must be at least 10 digits"),
  message: z
    .string()
    .trim()
    .max(2000, "Message must be at most 2000 characters")
    .optional(),
  visitDate: z.string().trim().optional(),
  visitTimeSlot: z.string().trim().optional(),
  userType: z
    .enum(["Buyer", "Tenant", "Investor"])
    .optional()
    .default("Buyer"),
  // Honeypot field — should always be empty. Bots auto-fill hidden fields.
  website: z
    .string()
    .max(0, "Invalid submission")
    .optional()
    .default(""),
});

export const updateInquiryStatusSchema = z.object({
  status: z.enum(["Pending", "Contacted", "Visit Scheduled", "Closed"], {
    required_error: "Status is required",
    invalid_type_error: "Status must be one of: Pending, Contacted, Visit Scheduled, Closed",
  }),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
export type UpdateInquiryStatusInput = z.infer<typeof updateInquiryStatusSchema>;
