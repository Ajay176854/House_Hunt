import { db } from "../db";
import { CreateInquiryInput } from "../validators/inquiries.schema";
import { createApiError } from "../middleware/errorHandler";

const DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000;

function mapDbInquiry(row: any) {
  return {
    id: row.id,
    propertyId: row.property_id,
    propertyTitle: row.property_title,
    propertyLocation: row.property_location,
    propertyPrice: row.property_price,
    propertyListingType: row.property_listing_type,
    ownerId: row.owner_id,
    senderName: row.name,
    senderEmail: row.email,
    senderPhone: row.phone,
    message: row.message,
    visitDate: row.visit_date,
    visitTimeSlot: row.visit_time_slot,
    userType: row.user_type,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function createInquiry(input: CreateInquiryInput, userId?: string) {
  const { rows: properties } = await db.query(`SELECT * FROM properties WHERE id = $1`, [input.propertyId]);
  if (!properties.length) throw createApiError("Property not found.", 404);
  const property = properties[0];

  const recentWindowStr = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString();
  const { rows: existing } = await db.query(
    `SELECT id FROM inquiries WHERE property_id = $1 AND email = $2 AND created_at > $3`,
    [input.propertyId, input.senderEmail.toLowerCase(), recentWindowStr]
  );

  if (existing.length > 0) {
    throw createApiError("You have already submitted an inquiry for this property within the last 24 hours.", 409);
  }

  if (input.website && input.website.length > 0) {
    throw createApiError("Invalid submission detected.", 400);
  }

  const message = input.message || "I am interested in this property. Please connect with me.";
  const status = input.visitDate ? "Visit Scheduled" : "Pending";
  const userType = input.userType || "Buyer";

  try {
    const { rows: newInquiries } = await db.query(
      `INSERT INTO inquiries (
         property_id, user_id, owner_id, name, email, phone, message, visit_date, visit_time_slot, user_type, status
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        input.propertyId,
        userId || null,
        property.owner_id,
        input.senderName,
        input.senderEmail,
        input.senderPhone,
        message,
        input.visitDate || null,
        input.visitTimeSlot || null,
        userType,
        status
      ]
    );

    // Add extra property info manually to match frontend interface format
    const inquiry = {
      ...newInquiries[0],
      property_title: property.title,
      property_location: `${property.locality}, ${property.city}`,
      property_price: property.price,
      property_listing_type: property.listing_type,
    };

    return {
      inquiry: mapDbInquiry(inquiry),
      ownerContact: {
        name: property.owner_name,
        phone: property.owner_phone,
        email: property.owner_email,
      },
    };
  } catch (err: any) {
    if (err.code === '23505') { // unique violation
      throw createApiError("You have already submitted an inquiry for this property.", 409);
    }
    throw err;
  }
}

export async function getOwnerInquiries(ownerId: string) {
  const { rows } = await db.query(
    `SELECT i.*, p.title as property_title, p.locality, p.city, p.price as property_price, p.listing_type as property_listing_type 
     FROM inquiries i 
     JOIN properties p ON i.property_id = p.id 
     WHERE i.owner_id = $1 ORDER BY i.created_at DESC`,
    [ownerId]
  );

  return rows.map(r => mapDbInquiry({
    ...r,
    property_location: `${r.locality}, ${r.city}`
  }));
}

export async function updateInquiryStatus(inquiryId: string, status: string, ownerId: string) {
  const { rows } = await db.query(
    `UPDATE inquiries SET status = $1 WHERE id = $2 AND owner_id = $3 RETURNING *`,
    [status, inquiryId, ownerId]
  );
  
  if (!rows.length) {
    throw createApiError("Inquiry not found or you are not authorized to update it.", 404);
  }
  
  return mapDbInquiry(rows[0]);
}
