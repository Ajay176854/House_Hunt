import { z } from "zod";

const propertyTypeEnum = z.enum([
  "Apartment",
  "Villa",
  "Independent House",
  "Builder Floor",
  "Studio",
  "Penthouse",
  "Commercial",
  "Plot",
  "Land",
]);

const furnishingEnum = z.enum(["Furnished", "Semi-Furnished", "Unfurnished"]);

const listingTypeEnum = z.enum(["rent", "buy"]);

export const createListingSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(10, "Title must be at least 10 characters")
    .max(200, "Title must be at most 200 characters"),
  description: z
    .string()
    .trim()
    .max(5000, "Description must be at most 5000 characters")
    .optional(),
  listingType: listingTypeEnum,
  propertyType: propertyTypeEnum,
  price: z
    .number({ required_error: "Price is required" })
    .positive("Price must be a positive number"),
  maintenanceCharges: z.number().nonnegative().optional(),
  depositAmount: z.number().nonnegative().optional(),
  bedrooms: z
    .number({ required_error: "Number of bedrooms is required" })
    .int()
    .min(0)
    .max(20),
  bathrooms: z.number().int().min(0).max(20).optional().default(1),
  balconies: z.number().int().min(0).max(10).optional().default(0),
  carpetAreaSqFt: z
    .number({ required_error: "Carpet area is required" })
    .positive("Carpet area must be positive"),
  superBuiltUpAreaSqFt: z.number().positive().optional(),
  furnishing: furnishingEnum.optional().default("Semi-Furnished"),
  facing: z.string().trim().optional(),
  floorNo: z.number().int().min(0).optional(),
  totalFloors: z.number().int().min(1).optional(),
  ageOfProperty: z.string().trim().optional(),
  availableFrom: z.string().trim().optional().default("Immediate"),
  address: z.string().trim().max(500).optional(),
  locality: z
    .string({ required_error: "Locality is required" })
    .trim()
    .min(2, "Locality must be at least 2 characters"),
  city: z
    .string({ required_error: "City is required" })
    .trim()
    .min(2, "City must be at least 2 characters"),
  pinCode: z.string().trim().optional(),
  landmark: z.string().trim().max(200).optional(),
  societyName: z.string().trim().max(200).optional(),
  images: z.array(z.string().url("Each image must be a valid URL")).optional(),
  amenities: z.array(z.string().trim()).optional(),
  isZeroBrokerage: z.boolean().optional().default(true),
  petFriendly: z.boolean().optional().default(false),
  preferredTenants: z.array(z.string().trim()).optional(),
});

export const updateListingSchema = createListingSchema.partial();

export const listingsQuerySchema = z.object({
  search: z.string().trim().optional(),
  city: z.string().trim().optional(),
  locality: z.string().trim().optional(),
  listingType: z.string().trim().optional(),
  propertyTypes: z.union([z.string(), z.array(z.string())]).optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  bedrooms: z.union([z.string(), z.array(z.string())]).optional(),
  furnishing: z.union([z.string(), z.array(z.string())]).optional(),
  isVerified: z.string().optional(),
  isZeroBrokerage: z.string().optional(),
  sort: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
