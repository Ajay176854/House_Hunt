import { db } from "../db";
import { CreateListingInput, UpdateListingInput } from "../validators/listings.schema";
import { createApiError } from "../middleware/errorHandler";
import { SafeUser } from "./auth.service";

// =================== Types ===================

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    nextCursor: string | null;
    limit: number;
  };
}

interface ListingsQuery {
  search?: string;
  city?: string;
  locality?: string;
  listingType?: string;
  propertyTypes?: string | string[];
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string | string[];
  furnishing?: string | string[];
  isVerified?: string;
  isZeroBrokerage?: string;
  sort?: string;
  cursor?: string;
  limit?: string;
  ids?: string | string[];
}

// Convert DB snake_case row to camelCase Property object
function mapDbProperty(row: any) {
  return {
    id: row.id,
    ownerId: row.owner_id,
    title: row.title,
    description: row.description,
    listingType: row.listing_type,
    propertyType: row.property_type,
    price: parseFloat(row.price),
    priceUnit: row.price_unit,
    maintenanceCharges: parseFloat(row.maintenance_charges) || 0,
    depositAmount: parseFloat(row.deposit_amount) || null,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    balconies: row.balconies,
    carpetAreaSqFt: parseFloat(row.carpet_area_sqft),
    superBuiltUpAreaSqFt: parseFloat(row.super_built_up_sqft) || null,
    pricePerSqFt: parseFloat(row.price_per_sqft) || null,
    furnishing: row.furnishing,
    facing: row.facing,
    floorNo: row.floor_no,
    totalFloors: row.total_floors,
    ageOfProperty: row.age_of_property,
    availableFrom: row.available_from,
    address: row.address,
    locality: row.locality,
    city: row.city,
    pinCode: row.pin_code,
    landmark: row.landmark,
    societyName: row.society_name,
    images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images || [],
    amenities: typeof row.amenities === 'string' ? JSON.parse(row.amenities) : row.amenities || [],
    isVerified: row.is_verified,
    isZeroBrokerage: row.is_zero_brokerage,
    gatedSecurity: row.gated_security,
    petFriendly: row.pet_friendly,
    preferredTenants: typeof row.preferred_tenants === 'string' ? JSON.parse(row.preferred_tenants) : row.preferred_tenants || [],
    viewsCount: row.views_count,
    shortlistedCount: row.shortlisted_count,
    ownerName: row.owner_name,
    ownerPhone: row.owner_phone,
    ownerEmail: row.owner_email,
    ownerType: row.owner_type,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// =================== Search & Filtering ===================

export async function searchListings(query: ListingsQuery): Promise<PaginatedResponse<any>> {
  let whereClauses: string[] = ["status = 'active'"];
  let params: any[] = [];
  let paramIndex = 1;

  // 1. Explicit Global City Filter (from Navbar)
  if (query.city && query.city.toLowerCase() !== "all") {
    const explicitCities = query.city.split(',').map(c => c.trim()).filter(c => c.length > 0);
    if (explicitCities.length > 0) {
      let mappedCities = explicitCities.map(cityQuery => {
        const lower = cityQuery.toLowerCase();
        if (lower === 'bangalore') return 'Bengaluru';
        if (lower === 'bombay') return 'Mumbai';
        if (lower === 'delhi') return 'Delhi-NCR';
        if (lower === 'madras') return 'Chennai';
        if (lower === 'gurgaon') return 'Gurugram';
        return cityQuery;
      });
      mappedCities = [...new Set(mappedCities)];
      const cityClauses = mappedCities.map(cityQuery => {
        const pIndex = paramIndex++;
        params.push(`%${cityQuery}%`);
        return `city ILIKE $${pIndex}`;
      });
      whereClauses.push(`(${cityClauses.join(' OR ')})`);
    }
  }

  // 2. Dynamic Search Bar Tokens
  if (query.search && query.search.trim() !== "") {
    const terms = query.search.split(',').map(t => t.trim()).filter(t => t.length > 0);
    const searchOrClauses: string[] = [];
    const KNOWN_CITIES = ['mumbai', 'bengaluru', 'bangalore', 'delhi', 'delhi-ncr', 'chennai', 'madras', 'hyderabad', 'pune', 'kolkata', 'ahmedabad', 'gurugram', 'gurgaon', 'noida'];

    terms.forEach(term => {
      const lower = term.toLowerCase();
      if (KNOWN_CITIES.includes(lower)) {
        let mappedCity = term;
        if (lower === 'bangalore') mappedCity = 'Bengaluru';
        if (lower === 'bombay') mappedCity = 'Mumbai';
        if (lower === 'delhi') mappedCity = 'Delhi-NCR';
        if (lower === 'madras') mappedCity = 'Chennai';
        if (lower === 'gurgaon') mappedCity = 'Gurugram';

        const pIndex = paramIndex++;
        params.push(`%${mappedCity}%`);
        searchOrClauses.push(`city ILIKE $${pIndex}`);
      } else {
        const pIndex = paramIndex++;
        params.push(`%${term}%`);
        searchOrClauses.push(`(title ILIKE $${pIndex} OR locality ILIKE $${pIndex} OR description ILIKE $${pIndex})`);
      }
    });

    if (searchOrClauses.length > 0) {
      whereClauses.push(`(${searchOrClauses.join(' OR ')})`);
    }
  }

  if (query.locality && query.locality.toLowerCase() !== "all") {
    whereClauses.push(`locality ILIKE $${paramIndex}`);
    params.push(`%${query.locality}%`);
    paramIndex++;
  }

  if (query.listingType && query.listingType !== "all") {
    whereClauses.push(`listing_type = $${paramIndex}`);
    params.push(query.listingType);
    paramIndex++;
  }

  if (query.propertyTypes) {
    const types = Array.isArray(query.propertyTypes) ? query.propertyTypes : [query.propertyTypes];
    if (types.length > 0) {
      whereClauses.push(`property_type = ANY($${paramIndex})`);
      params.push(types);
      paramIndex++;
    }
  }

  if (query.minPrice && !isNaN(Number(query.minPrice))) {
    whereClauses.push(`price >= $${paramIndex}`);
    params.push(Number(query.minPrice));
    paramIndex++;
  }
  
  if (query.maxPrice && !isNaN(Number(query.maxPrice))) {
    whereClauses.push(`price <= $${paramIndex}`);
    params.push(Number(query.maxPrice));
    paramIndex++;
  }

  if (query.bedrooms) {
    const bhkList = (Array.isArray(query.bedrooms) ? query.bedrooms : [query.bedrooms]).map(Number);
    if (bhkList.length > 0) {
      if (bhkList.includes(5)) {
        whereClauses.push(`(bedrooms = ANY($${paramIndex}) OR bedrooms >= 5)`);
      } else {
        whereClauses.push(`bedrooms = ANY($${paramIndex})`);
      }
      params.push(bhkList);
      paramIndex++;
    }
  }

  if (query.furnishing) {
    const furnList = Array.isArray(query.furnishing) ? query.furnishing : [query.furnishing];
    if (furnList.length > 0) {
      whereClauses.push(`furnishing = ANY($${paramIndex})`);
      params.push(furnList);
      paramIndex++;
    }
  }

  if (query.isVerified === "true") {
    whereClauses.push(`is_verified = true`);
  }
  if (query.isZeroBrokerage === "true") {
    whereClauses.push(`is_zero_brokerage = true`);
  }

  if (query.ids) {
    const idList = typeof query.ids === 'string' ? query.ids.split(',') : query.ids;
    if (Array.isArray(idList) && idList.length > 0) {
      whereClauses.push(`id = ANY($${paramIndex})`);
      params.push(idList);
      paramIndex++;
    }
  }

  let orderBy = "created_at DESC, id ASC";
  let sortField = "created_at";
  let sortDir = "DESC";
  
  switch (query.sort) {
    case "price_asc": 
      orderBy = "price ASC, id ASC"; 
      sortField = "price";
      sortDir = "ASC";
      break;
    case "price_desc": 
      orderBy = "price DESC, id ASC"; 
      sortField = "price";
      sortDir = "DESC";
      break;
    case "newest": 
      orderBy = "created_at DESC, id ASC"; 
      sortField = "created_at";
      sortDir = "DESC";
      break;
  }

  const baseWhereClauses = [...whereClauses];
  const baseParams = [...params];

  if (query.cursor) {
    try {
      const decoded = JSON.parse(Buffer.from(query.cursor, 'base64').toString('utf-8'));
      if (decoded.val !== undefined && decoded.id) {
        const op = sortDir === "ASC" ? ">" : "<";
        // Keyset pagination condition: (sortField > val) OR (sortField = val AND id > id)
        whereClauses.push(`(${sortField} ${op} $${paramIndex} OR (${sortField} = $${paramIndex} AND id > $${paramIndex + 1}))`);
        params.push(decoded.val, decoded.id);
        paramIndex += 2;
      }
    } catch (e) {
      // Invalid cursor, ignore
    }
  }

  const limit = parseInt(query.limit || "20", 10);
  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";
  const baseWhereSql = baseWhereClauses.length > 0 ? `WHERE ${baseWhereClauses.join(" AND ")}` : "";
  
  const countSql = `SELECT COUNT(*) FROM properties ${baseWhereSql}`;
  const countResult = await db.query(countSql, baseParams);
  const total = parseInt(countResult.rows[0].count, 10);

  const sql = `
    SELECT * FROM properties 
    ${whereSql}
    ORDER BY ${orderBy}
    LIMIT $${paramIndex}
  `;
  params.push(limit);

  const { rows } = await db.query(sql, params);
  
  let nextCursor = null;
  if (rows.length === limit) {
    const lastRow = rows[rows.length - 1];
    let val = lastRow[sortField];
    if (val instanceof Date) val = val.toISOString(); // Format dates for JSON
    nextCursor = Buffer.from(JSON.stringify({ val, id: lastRow.id })).toString('base64');
  }

  return {
    data: rows.map(mapDbProperty),
    pagination: {
      total,
      nextCursor,
      limit,
    }
  };
}

// =================== Metadata ===================

export async function getMetadata() {
  // 1. Fetch top cities with counts
  const cityCountQuery = `
    SELECT city, COUNT(*) as count 
    FROM properties 
    WHERE status = 'active' AND city IS NOT NULL
    GROUP BY city
    ORDER BY count DESC;
  `;
  const cityCountResult = await db.query(cityCountQuery);
  const cities = cityCountResult.rows.map(row => row.city);
  const cityCounts: Record<string, number> = {};
  for (const row of cityCountResult.rows) {
    cityCounts[row.city] = parseInt(row.count, 10);
  }

  // 2. Fetch a "Featured Property" (e.g. newest or highest price)
  const heroQuery = `
    SELECT * 
    FROM properties 
    WHERE status = 'active' 
      AND images IS NOT NULL 
      AND images != '[]'::jsonb
    ORDER BY created_at DESC 
    LIMIT 1;
  `;
  const heroResult = await db.query(heroQuery);
  const heroProperty = heroResult.rows.length > 0 ? mapDbProperty(heroResult.rows[0]) : null;

  // 3. Aggregate stats
  const statsQuery = `
    SELECT 
      COUNT(*) as total_properties,
      COUNT(CASE WHEN listing_type = 'rent' THEN 1 END) as rent_properties,
      COUNT(CASE WHEN listing_type = 'buy' THEN 1 END) as buy_properties
    FROM properties
    WHERE status = 'active';
  `;
  const statsResult = await db.query(statsQuery);
  const stats = {
    totalProperties: parseInt(statsResult.rows[0].total_properties || '0', 10),
    rentProperties: parseInt(statsResult.rows[0].rent_properties || '0', 10),
    buyProperties: parseInt(statsResult.rows[0].buy_properties || '0', 10)
  };

  return {
    cities,
    cityCounts,
    heroProperty,
    stats
  };
}

// =================== DB Operations ===================

// Explicit overrides for camelCase keys where the naive regex produces wrong snake_case
const CAMEL_TO_SNAKE_OVERRIDES: Record<string, string> = {
  carpetAreaSqFt: 'carpet_area_sqft',
  superBuiltUpSqFt: 'super_built_up_sqft',
  superBuiltUpAreaSqFt: 'super_built_up_sqft',
  pricePerSqFt: 'price_per_sqft',
};

function camelToSnake(key: string): string {
  if (CAMEL_TO_SNAKE_OVERRIDES[key]) return CAMEL_TO_SNAKE_OVERRIDES[key];
  return key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

export async function getListingById(id: string) {
  const { rows } = await db.query(`SELECT * FROM properties WHERE id = $1`, [id]);
  if (!rows.length) throw createApiError("Listing not found", 404);
  
  await db.query(`UPDATE properties SET views_count = views_count + 1 WHERE id = $1`, [id]);
  return mapDbProperty(rows[0]);
}

export async function getListingsByOwner(ownerId: string) {
  const { rows } = await db.query(`SELECT * FROM properties WHERE owner_id = $1 ORDER BY created_at DESC`, [ownerId]);
  return rows.map(mapDbProperty);
}

export async function createListing(data: CreateListingInput, user: SafeUser) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  
  let columns = ['owner_id', 'owner_name', 'owner_email', 'owner_phone'];
  let placeholders = ['$1', '$2', '$3', '$4'];
  let sqlValues: any[] = [user.id, user.name, user.email, user.phone || null];
  
  let i = 5;
  for (const key of keys) {
    const snakeKey = camelToSnake(key);
    columns.push(snakeKey);
    placeholders.push(`$${i}`);
    
    // Convert arrays/objects to JSON for JSONB columns
    const val = values[i-5];
    if (typeof val === 'object' && val !== null) {
      sqlValues.push(JSON.stringify(val));
    } else {
      sqlValues.push(val);
    }
    i++;
  }

  const sql = `INSERT INTO properties (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`;
  
  const { rows } = await db.query(sql, sqlValues);
  return mapDbProperty(rows[0]);
}

export async function updateListing(id: string, data: UpdateListingInput, user: SafeUser) {
  const { rows: check } = await db.query(`SELECT owner_id FROM properties WHERE id = $1`, [id]);
  if (!check.length) throw createApiError("Listing not found", 404);
  if (check[0].owner_id !== user.id) throw createApiError("Unauthorized. You can only edit your own listings.", 403);

  const keys = Object.keys(data);
  if (keys.length === 0) return await getListingById(id);

  const updates = [];
  const sqlValues = [];
  let i = 1;
  for (const key of keys) {
    const snakeKey = camelToSnake(key);
    updates.push(`${snakeKey} = $${i}`);
    const val = (data as any)[key];
    sqlValues.push(typeof val === 'object' && val !== null ? JSON.stringify(val) : val);
    i++;
  }
  
  sqlValues.push(id);
  const sql = `UPDATE properties SET ${updates.join(', ')}, updated_at = now() WHERE id = $${i} RETURNING *`;
  
  const { rows } = await db.query(sql, sqlValues);
  return mapDbProperty(rows[0]);
}

export async function deleteListing(id: string, user: SafeUser) {
  const { rows: check } = await db.query(`SELECT owner_id FROM properties WHERE id = $1`, [id]);
  if (!check.length) throw createApiError("Listing not found", 404);
  if (check[0].owner_id !== user.id) throw createApiError("Unauthorized.", 403);

  await db.query(`DELETE FROM properties WHERE id = $1`, [id]);
}

// =================== Recommendation / Similar ===================

export async function getSimilarListings(propertyId: string) {
  const { rows: current } = await db.query(`SELECT city, property_type, price FROM properties WHERE id = $1`, [propertyId]);
  if (!current.length) return [];
  
  const { city, property_type, price } = current[0];
  const minPrice = parseFloat(price) * 0.8;
  const maxPrice = parseFloat(price) * 1.2;

  const { rows } = await db.query(
    `SELECT * FROM properties 
     WHERE id != $1 AND city = $2 AND property_type = $3 AND price BETWEEN $4 AND $5 AND status = 'active'
     ORDER BY price ASC LIMIT 5`,
    [propertyId, city, property_type, minPrice, maxPrice]
  );
  
  return rows.map(mapDbProperty);
}

// =================== Shortlist ===================

export async function toggleShortlist(propertyId: string, userId: string) {
  const { rows } = await db.query(`SELECT saved_properties FROM users WHERE id = $1`, [userId]);
  if (!rows.length) throw createApiError("User not found", 404);

  const savedProperties: string[] = rows[0].saved_properties || [];
  const index = savedProperties.indexOf(propertyId);
  let isSaved = false;

  if (index > -1) {
    savedProperties.splice(index, 1);
    await db.query(`UPDATE properties SET shortlisted_count = GREATEST(shortlisted_count - 1, 0) WHERE id = $1`, [propertyId]);
  } else {
    savedProperties.push(propertyId);
    isSaved = true;
    await db.query(`UPDATE properties SET shortlisted_count = shortlisted_count + 1 WHERE id = $1`, [propertyId]);
  }

  await db.query(`UPDATE users SET saved_properties = $1 WHERE id = $2`, [savedProperties, userId]);

  const { rows: propRows } = await db.query(`SELECT shortlisted_count FROM properties WHERE id = $1`, [propertyId]);
  const shortlistedCount = propRows[0]?.shortlisted_count || 0;

  return { savedProperties, isSaved, shortlistedCount };
}
