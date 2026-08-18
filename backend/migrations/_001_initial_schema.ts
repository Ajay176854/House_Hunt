import type { Knex } from "knex";
export async function up(knex: Knex): Promise<void> {
  const sql = `
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
CREATE INDEX idx_properties_city       ON properties(city);
CREATE INDEX idx_properties_price      ON properties(price);
CREATE INDEX idx_properties_created_at ON properties(created_at DESC);
CREATE INDEX idx_properties_search ON properties(city, property_type, bedrooms, price);
CREATE INDEX idx_properties_active ON properties(city, property_type, bedrooms, price)
  WHERE status = 'active';
CREATE INDEX idx_properties_listing_type ON properties(listing_type, city, price);

-- =================== INQUIRIES ===================
CREATE TABLE inquiries (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id   UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES users(id) ON DELETE SET NULL,  
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
  UNIQUE(property_id, email)
);

CREATE INDEX idx_inquiries_owner    ON inquiries(owner_id);
CREATE INDEX idx_inquiries_property ON inquiries(property_id);

-- =================== REFRESH TOKENS ===================
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
  `;
  await knex.raw(sql);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TABLE IF EXISTS refresh_tokens CASCADE;');
  await knex.raw('DROP TABLE IF EXISTS inquiries CASCADE;');
  await knex.raw('DROP TABLE IF EXISTS properties CASCADE;');
  await knex.raw('DROP TABLE IF EXISTS users CASCADE;');
}
