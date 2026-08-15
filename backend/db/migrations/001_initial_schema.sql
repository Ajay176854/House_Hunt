-- ============================================================
-- HouseHunt — PostgreSQL Schema Migration 001
-- Run against a PostgreSQL 15+ database
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =================== USERS ===================
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone         TEXT,
  role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'agent', 'builder')),
  avatar        TEXT,
  saved_properties UUID[] DEFAULT '{}',
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);

-- =================== PROPERTIES ===================
CREATE TABLE properties (
  id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title                  TEXT NOT NULL,
  description            TEXT,
  listing_type           TEXT NOT NULL CHECK (listing_type IN ('rent', 'buy')),
  property_type          TEXT NOT NULL,  -- Apartment, Villa, Plot, etc.
  price                  NUMERIC NOT NULL,
  price_unit             TEXT NOT NULL DEFAULT 'total' CHECK (price_unit IN ('month', 'total')),
  maintenance_charges    NUMERIC DEFAULT 0,
  deposit_amount         NUMERIC,
  bedrooms               INT NOT NULL DEFAULT 1,
  bathrooms              INT DEFAULT 1,
  balconies              INT DEFAULT 0,
  carpet_area_sqft       NUMERIC NOT NULL,
  super_built_up_sqft    NUMERIC,
  price_per_sqft         NUMERIC,
  furnishing             TEXT DEFAULT 'Semi-Furnished' CHECK (furnishing IN ('Furnished', 'Semi-Furnished', 'Unfurnished')),
  facing                 TEXT,
  floor_no               INT,
  total_floors           INT,
  age_of_property        TEXT,
  available_from         TEXT DEFAULT 'Immediate',
  address                TEXT NOT NULL,
  locality               TEXT NOT NULL,
  city                   TEXT NOT NULL,
  pin_code               TEXT,
  landmark               TEXT,
  society_name           TEXT,
  images                 JSONB DEFAULT '[]'::jsonb,   -- array of URL strings
  amenities              JSONB DEFAULT '[]'::jsonb,   -- array of amenity strings
  is_verified            BOOLEAN DEFAULT false,
  is_zero_brokerage      BOOLEAN DEFAULT true,
  gated_security         BOOLEAN DEFAULT false,
  pet_friendly           BOOLEAN DEFAULT false,
  preferred_tenants      JSONB DEFAULT '[]'::jsonb,
  views_count            INT DEFAULT 0,
  shortlisted_count      INT DEFAULT 0,
  owner_name             TEXT,
  owner_phone            TEXT,
  owner_email            TEXT,
  owner_type             TEXT DEFAULT 'Owner' CHECK (owner_type IN ('Owner', 'Builder', 'Agent')),
  status                 TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'inactive')),
  created_at             TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at             TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =================== INDEXING STRATEGY ===================
-- Single-column indexes for common standalone filters
CREATE INDEX idx_properties_city       ON properties(city);
CREATE INDEX idx_properties_price      ON properties(price);
CREATE INDEX idx_properties_created_at ON properties(created_at DESC);

-- Composite index for the most common search filter combo:
-- city + property_type + bedrooms + price
-- This covers: search by city, city+type, city+type+bhk, city+type+bhk+price range
-- The planner will use leftmost prefix matching on this index.
CREATE INDEX idx_properties_search ON properties(city, property_type, bedrooms, price);

-- Partial index on active listings — most queries only care about live listings
-- This is smaller than a full index and faster for the common case.
CREATE INDEX idx_properties_active ON properties(city, property_type, bedrooms, price)
  WHERE status = 'active';

-- Covering index for listing-type filtered searches (rent vs buy)
CREATE INDEX idx_properties_listing_type ON properties(listing_type, city, price);

-- =================== INQUIRIES ===================
CREATE TABLE inquiries (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id   UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES users(id) ON DELETE SET NULL,  -- nullable for guest inquiries
  owner_id      UUID NOT NULL REFERENCES users(id),
  name          TEXT,
  email         TEXT NOT NULL,
  phone         TEXT,
  message       TEXT,
  visit_date    TEXT,
  visit_time_slot TEXT,
  user_type     TEXT DEFAULT 'Buyer' CHECK (user_type IN ('Buyer', 'Tenant', 'Investor')),
  status        TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Contacted', 'Visit Scheduled', 'Closed')),
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- Duplicate prevention: one inquiry per email per property
  UNIQUE(property_id, email)
);

CREATE INDEX idx_inquiries_owner    ON inquiries(owner_id);
CREATE INDEX idx_inquiries_property ON inquiries(property_id);

-- =================== REFRESH TOKENS ===================
-- Server-side refresh token storage for secure token rotation
CREATE TABLE refresh_tokens (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL,
  expires_at  TIMESTAMP WITH TIME ZONE NOT NULL,
  revoked     BOOLEAN DEFAULT false,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_refresh_tokens_user    ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_hash    ON refresh_tokens(token_hash);
CREATE INDEX idx_refresh_tokens_cleanup ON refresh_tokens(expires_at) WHERE revoked = false;

-- =================== QUERY OPTIMIZATION NOTES ===================
-- 
-- 1. The composite index idx_properties_search covers the main search query:
--    SELECT * FROM properties 
--    WHERE city = $1 AND property_type = $2 AND bedrooms = $3 AND price BETWEEN $4 AND $5
--    ORDER BY price ASC LIMIT 10;
--
-- 2. For similar properties (same city + type, price ±20%):
--    SELECT * FROM properties
--    WHERE city = $1 AND property_type = $2 AND price BETWEEN $3 AND $4 AND id != $5
--    LIMIT 5;
--    → This also uses idx_properties_search via leftmost prefix (city, property_type, price range).
--
-- 3. Keyset pagination for 50k+ scale:
--    SELECT * FROM properties WHERE id > $lastId ORDER BY id LIMIT $limit;
--    Uses primary key index. For sorted pagination:
--    WHERE (created_at, id) < ($lastCreatedAt, $lastId) ORDER BY created_at DESC, id DESC LIMIT $limit;
--    → Uses idx_properties_created_at.
--
-- 4. OFFSET pagination problem at scale:
--    OFFSET 50000 forces the DB to scan and discard 50k rows.
--    Keyset avoids this by seeking directly to the cursor position.
--
-- 5. Always verify with: EXPLAIN ANALYZE <your_query>;
--    Confirm "Index Scan" or "Index Only Scan", not "Seq Scan".
