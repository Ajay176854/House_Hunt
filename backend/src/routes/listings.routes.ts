import { Router } from "express";
import multer from "multer";
import * as listingsController from "../controllers/listings.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createListingSchema, updateListingSchema } from "../validators/listings.schema";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB max


/**
 * @swagger
 * /api/listings:
 *   get:
 *     tags: [Listings]
 *     summary: Search and list properties with filters
 *     description: |
 *       Dynamic parameterized filters. Supports city, price range, property type, bedrooms, furnishing, sort, and pagination.
 *       Uses composite index (city, property_type, bedrooms, price) for optimal query performance at 50k+ scale.
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Full-text search across title, locality, city, address, description
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city name
 *       - in: query
 *         name: listingType
 *         schema:
 *           type: string
 *           enum: [rent, buy, all]
 *       - in: query
 *         name: propertyTypes
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: bedrooms
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, price_asc, price_desc, area_desc, popular]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 9
 *     responses:
 *       200:
 *         description: Paginated list of properties
 */
router.get("/", listingsController.getListings);

/**
 * @swagger
 * /api/listings/user/my-listings:
 *   get:
 *     tags: [Listings]
 *     summary: Get authenticated user's own listings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Owner's property listings
 *       401:
 *         description: Not authenticated
 */
router.get("/user/my-listings", requireAuth, listingsController.getMyListings);

/**
 * @swagger
 * /api/listings/metadata:
 *   get:
 *     tags: [Listings]
 *     summary: Get global properties metadata (cities, featured, stats)
 *     responses:
 *       200:
 *         description: Metadata fetched
 */
router.get("/metadata", listingsController.getMetadata);

/**
 * @swagger
 * /api/listings/{id}:
 *   get:
 *     tags: [Listings]
 *     summary: Get property details + similar properties
 *     description: |
 *       Returns full property detail and triggers similar-properties query.
 *       Similar: same city + type, price within ±20%, exclude current, LIMIT 5.
 *       Increments view count on access.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property detail with similar properties
 *       404:
 *         description: Property not found
 */
router.get("/:id", listingsController.getListingById);

/**
 * @swagger
 * /api/listings:
 *   post:
 *     tags: [Listings]
 *     summary: Create a new property listing
 *     description: Auth required. Body validated with Zod schema. Images stored as URLs (pre-signed upload to S3/Cloudinary).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, listingType, propertyType, price, bedrooms, carpetAreaSqFt, locality, city]
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 10
 *               listingType:
 *                 type: string
 *                 enum: [rent, buy]
 *               propertyType:
 *                 type: string
 *                 enum: [Apartment, Villa, Independent House, Builder Floor, Studio, Penthouse, Commercial]
 *               price:
 *                 type: number
 *               bedrooms:
 *                 type: integer
 *               carpetAreaSqFt:
 *                 type: number
 *               locality:
 *                 type: string
 *               city:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *     responses:
 *       201:
 *         description: Property created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 */
const parseMultipartBody = (req: any, res: any, next: any) => {
  if (req.body) {
    const numberFields = ['price', 'maintenanceCharges', 'depositAmount', 'bedrooms', 'bathrooms', 'balconies', 'carpetAreaSqFt', 'superBuiltUpAreaSqFt', 'pricePerSqFt', 'floorNo', 'totalFloors'];
    for (const field of numberFields) {
      if (req.body[field] !== undefined) {
        req.body[field] = Number(req.body[field]);
      }
    }
    const jsonFields = ['amenities', 'preferredTenants', 'images'];
    for (const field of jsonFields) {
      if (typeof req.body[field] === 'string') {
        try { req.body[field] = JSON.parse(req.body[field]); } catch (e) {}
      }
    }
    const boolFields = ['isVerified', 'isZeroBrokerage', 'gatedSecurity', 'petFriendly'];
    for (const field of boolFields) {
      if (typeof req.body[field] === 'string') {
        req.body[field] = req.body[field] === 'true';
      }
    }
  }
  next();
};

router.post("/", requireAuth, upload.array("images", 10), parseMultipartBody, validate(createListingSchema), listingsController.createListing);

/**
 * @swagger
 * /api/listings/{id}:
 *   put:
 *     tags: [Listings]
 *     summary: Update a property listing
 *     description: Auth + ownership required. Returns 403 if not owner.
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
 *     responses:
 *       200:
 *         description: Property updated
 *       403:
 *         description: Not the owner
 *       404:
 *         description: Property not found
 */
router.put("/:id", requireAuth, upload.array("images", 10), parseMultipartBody, validate(updateListingSchema), listingsController.updateListing);

/**
 * @swagger
 * /api/listings/{id}:
 *   delete:
 *     tags: [Listings]
 *     summary: Delete a property listing
 *     description: Auth + ownership required. Cascade-deletes related inquiries.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property deleted
 *       403:
 *         description: Not the owner
 *       404:
 *         description: Property not found
 */
router.delete("/:id", requireAuth, listingsController.deleteListing);

/**
 * @swagger
 * /api/listings/{id}/shortlist:
 *   post:
 *     tags: [Listings]
 *     summary: Toggle shortlist/favorite for a property
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shortlist toggled
 */
router.post("/:id/shortlist", requireAuth, listingsController.toggleShortlist);

export default router;
