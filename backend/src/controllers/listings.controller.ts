import { Request, Response, NextFunction } from "express";
import * as listingsService from "../services/listings.service";

/**
 * GET /api/listings
 * List with query params: city, minPrice, maxPrice, type, bedrooms, sort, page, limit.
 * Uses dynamic parameterized filters (never string-concatenated).
 */
export async function getListings(req: Request, res: Response): Promise<void> {
  try {
    const result = await listingsService.searchListings(req.query as any);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: { message: "Internal Server Error" } });
  }
}

/**
 * GET /api/listings/metadata
 * Global metadata: distinct cities, featured property, and aggregate stats.
 */
export async function getMetadata(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const metadata = await listingsService.getMetadata();
    res.json({ success: true, ...metadata });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/listings/:id
 * Property detail + triggers similar-properties query.
 */
export async function getListingById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const property = await listingsService.getListingById(id);

    // Similar properties: same city + type, price ±20%, LIMIT 5
    const similar = await listingsService.getSimilarListings(id);

    res.json({ success: true, property, similar });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/listings
 * Create listing (auth required). Body validated by Zod middleware.
 */
export async function createListing(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      return next({ statusCode: 401, message: "Authentication required." });
    }

    const result = await listingsService.createListing(req.body, req.user);

    res.status(201).json({
      success: true,
      message: "Property listed successfully.",
      property: result,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/listings/:id
 * Edit listing (auth + ownership required). Body validated by Zod middleware.
 */
export async function updateListing(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      return next({ statusCode: 401, message: "Authentication required." });
    }

    const result = await listingsService.updateListing(req.params.id, req.body, req.user);

    res.json({
      success: true,
      message: "Property updated successfully.",
      property: result,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/listings/:id
 * Delete listing (auth + ownership required).
 */
export async function deleteListing(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      return next({ statusCode: 401, message: "Authentication required." });
    }

    await listingsService.deleteListing(req.params.id, req.user);

    res.json({ success: true, message: "Property listing removed successfully." });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/listings/my
 * Protected: Listings owned by the authenticated user.
 */
export async function getMyListings(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, error: { message: "Authentication required." } });
    return;
  }

  const data = await listingsService.getListingsByOwner(req.user.id);
  res.json({ success: true, data, total: data.length });
}

/**
 * POST /api/listings/:id/shortlist
 * Protected: Toggle saved/shortlisted status.
 */
export async function toggleShortlist(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      return next({ statusCode: 401, message: "Authentication required." });
    }

    const result = await listingsService.toggleShortlist(req.params.id, req.user.id);

    res.json({
      success: true,
      message: "Property shortlisted status toggled.",
      savedProperties: result.savedProperties,
      isSaved: result.isSaved,
      shortlistedCount: result.shortlistedCount,
    });
  } catch (err) {
    next(err);
  }
}
