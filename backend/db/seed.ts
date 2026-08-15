import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/househunt',
});

// =================== Seed Data Constants ===================

const CITIES = ['Mumbai', 'Bengaluru', 'Delhi-NCR', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad'];
const PROPERTY_TYPES = ['Apartment', 'Villa', 'Builder Floor', 'Studio', 'Penthouse'];

const LOCALITIES: Record<string, string[]> = {
  'Mumbai': ['Bandra', 'Andheri', 'Powai', 'Worli', 'Juhu', 'Malad', 'Goregaon', 'Thane'],
  'Bengaluru': ['Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'Jayanagar', 'Electronic City', 'Marathahalli', 'Hebbal'],
  'Delhi-NCR': ['Gurugram', 'Noida', 'Vasant Vihar', 'Dwarka', 'South Extension', 'Greater Noida', 'Faridabad', 'Saket'],
  'Pune': ['Koregaon Park', 'Kalyani Nagar', 'Viman Nagar', 'Baner', 'Hinjewadi', 'Kharadi', 'Wakad', 'Aundh'],
  'Hyderabad': ['Jubilee Hills', 'Banjara Hills', 'HITEC City', 'Gachibowli', 'Kondapur', 'Madhapur', 'Kukatpally', 'Miyapur'],
  'Chennai': ['Adyar', 'Besant Nagar', 'T Nagar', 'Velachery', 'OMR', 'Anna Nagar', 'Porur', 'Guindy'],
  'Kolkata': ['Salt Lake', 'New Town', 'Ballygunge', 'Alipore', 'Park Street', 'Howrah', 'Dum Dum', 'Rajarhat'],
  'Ahmedabad': ['Satellite', 'Bodakdev', 'Prahlad Nagar', 'SG Highway', 'Vastrapur', 'Navrangpura', 'Thaltej', 'Bopal'],
};

const PIN_CODES: Record<string, string[]> = {
  'Mumbai': ['400050', '400053', '400076', '400018', '400049', '400064', '400062', '400601'],
  'Bengaluru': ['560038', '560034', '560066', '560102', '560011', '560100', '560037', '560024'],
  'Delhi-NCR': ['122001', '201301', '110057', '110075', '110049', '201310', '121001', '110017'],
  'Pune': ['411001', '411006', '411014', '411045', '411057', '411048', '411027', '411007'],
  'Hyderabad': ['500033', '500034', '500081', '500032', '500084', '500081', '500072', '500049'],
  'Chennai': ['600020', '600090', '600017', '600042', '600097', '600040', '600116', '600032'],
  'Kolkata': ['700064', '700156', '700019', '700027', '700016', '711101', '700028', '700135'],
  'Ahmedabad': ['380015', '380054', '380015', '380054', '380015', '380009', '380054', '380058'],
};

const LANDMARKS: Record<string, string[]> = {
  'Mumbai': ['Near Bandra Station', 'Near Infinity Mall', 'Near Hiranandani Gardens', 'Near Siddhivinayak Temple', 'Near Juhu Beach', 'Near Inorbit Mall', 'Near Film City', 'Near Viviana Mall'],
  'Bengaluru': ['Near 100 Feet Road', 'Near Forum Mall', 'Near ITPL', 'Near Agara Lake', 'Near Jayanagar 4th Block', 'Near Infosys Campus', 'Near Phoenix Mall', 'Near Manyata Tech Park'],
  'Delhi-NCR': ['Near Cyber Hub', 'Near Sector 18 Market', 'Near IIT Delhi', 'Near Dwarka Sector 21 Metro', 'Near South Ex Market', 'Near Pari Chowk', 'Near Crown Mall', 'Near Select Citywalk'],
  'Pune': ['Near Aga Khan Palace', 'Near Kalyani Nagar Bridge', 'Near Phoenix Market City', 'Near Baner Road', 'Near Rajiv Gandhi Infotech Park', 'Near EON IT Park', 'Near Dange Chowk', 'Near Aundh Road'],
  'Hyderabad': ['Near KBR Park', 'Near GVK One Mall', 'Near Inorbit Mall', 'Near ISB', 'Near Botanical Garden', 'Near Cyber Towers', 'Near KPHB Metro', 'Near Miyapur Metro'],
  'Chennai': ['Near IIT Madras', 'Near Elliot Beach', 'Near Pondy Bazaar', 'Near Phoenix Mall', 'Near Tidel Park', 'Near VR Mall', 'Near Porur Junction', 'Near Guindy Station'],
  'Kolkata': ['Near Sector V', 'Near Eco Park', 'Near Ballygunge Station', 'Near Alipore Zoo', 'Near Park Street Metro', 'Near Howrah Bridge', 'Near Dum Dum Airport', 'Near City Centre 2'],
  'Ahmedabad': ['Near Iscon Cross Roads', 'Near Sindhubhavan Road', 'Near Prahlad Nagar Garden', 'Near SG Highway Flyover', 'Near Vastrapur Lake', 'Near HL Commerce', 'Near Thaltej Cross Road', 'Near SP Ring Road'],
};

const SOCIETY_PREFIXES = ['Royal', 'Green', 'Sun', 'Sky', 'Palm', 'Golden', 'Silver', 'Sapphire', 'Ruby', 'Emerald', 'Crystal', 'Diamond', 'Platinum', 'Pearl', 'Opal'];
const SOCIETY_SUFFIXES = ['Residency', 'Heights', 'Towers', 'Gardens', 'Enclave', 'Paradise', 'Greens', 'Vista', 'Courtyard', 'Square', 'Meadows', 'Apartments', 'Pinnacle', 'Elite', 'Avenue'];

const FURNISHING_TYPES = ['Furnished', 'Semi-Furnished', 'Unfurnished'] as const;
const FACING_DIRECTIONS = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];
const AGE_OPTIONS = ['Under Construction', 'Ready to Move (0-1 yr)', '1-5 years', '5-10 years', '10+ years'];
const OWNER_TYPES = ['Owner', 'Builder', 'Agent'] as const;
const PREFERRED_TENANT_OPTIONS = ['Family', 'Bachelors (Male)', 'Bachelors (Female)', 'Company Lease', 'Any'];

const AMENITIES_LIST = [
  'Swimming Pool', 'Gymnasium', 'Clubhouse', 'Power Backup (100%)',
  'Covered Car Parking', '24x7 Security & CCTV', 'Children\'s Play Area',
  'Jogging Track', 'Piped Gas', 'EV Charging Station', 'Intercom',
  'Lift', 'Rain Water Harvesting', 'Fire Safety', 'Garden / Park',
  'Indoor Games Room', 'Visitor Parking', 'Servant Room',
  'Vastu Compliant', 'Wi-Fi Connectivity',
];

// Diverse Unsplash image sets per property type
const IMAGES_BY_TYPE: Record<string, string[]> = {
  'Apartment': [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=1200&auto=format&fit=crop&q=80',
  ],
  'Villa': [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&auto=format&fit=crop&q=80',
  ],
  'Builder Floor': [
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560448075-bb5c681a4e75?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&auto=format&fit=crop&q=80',
  ],
  'Studio': [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=1200&auto=format&fit=crop&q=80',
  ],
  'Penthouse': [
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
  ],
};

// =================== Utility Functions ===================

function randomChoice<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomSubset<T>(arr: readonly T[], minItems: number, maxItems: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, randomInt(minItems, maxItems));
}

function randomBool(probability: number): boolean {
  return Math.random() < probability;
}

function generateIndianPhone(): string {
  const prefixes = ['98', '97', '96', '95', '94', '93', '91', '90', '88', '87', '86', '85', '84', '83', '82', '81', '80', '79', '78', '77', '76', '75', '74', '73', '72', '71', '70'];
  return `+91 ${randomChoice(prefixes)}${randomInt(100, 999)} ${randomInt(10000, 99999)}`;
}

function generateSocietyName(): string {
  return `${randomChoice(SOCIETY_PREFIXES)} ${randomChoice(SOCIETY_SUFFIXES)}`;
}

function pickImages(propType: string): string[] {
  const pool = IMAGES_BY_TYPE[propType] || IMAGES_BY_TYPE['Apartment'];
  // Pick 3-6 random images from the pool, with random start offset for diversity
  const count = randomInt(3, Math.min(6, pool.length));
  const startOffset = randomInt(0, pool.length - 1);
  const picked: string[] = [];
  for (let i = 0; i < count; i++) {
    picked.push(pool[(startOffset + i) % pool.length]);
  }
  return picked;
}

// =================== Main Seed Function ===================

async function runSeed() {
  console.log('Starting HouseHunt DB Migration & Seeding process...');
  const client = await pool.connect();
  
  try {
    // 1. Run migrations
    console.log('Running migrations...');
    const migrationPath = path.join(process.cwd(), 'db/migrations/001_initial_schema.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');
    
    // Drop tables for a clean slate
    await client.query(`
      DROP TABLE IF EXISTS refresh_tokens CASCADE;
      DROP TABLE IF EXISTS inquiries CASCADE;
      DROP TABLE IF EXISTS properties CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);
    
    await client.query(migrationSql);
    console.log('Migrations completed successfully.');

    // 2. Insert Demo Users
    console.log('Seeding demo users...');
    const demoPasswordHash = bcrypt.hashSync('demo123', 10);
    
    const demoUsers = [
      { id: uuidv4(), name: 'Rahul Verma', email: 'rahul@nobrokerdemo.in', role: 'user', phone: '+91 98765 43210' },
      { id: uuidv4(), name: 'Priya Sharma', email: 'priya.sharma@nobrokerdemo.in', role: 'user', phone: '+91 98201 88765' },
      { id: uuidv4(), name: 'Vikram Mehta', email: 'vikram.mehta@nobrokerdemo.in', role: 'builder', phone: '+91 99100 23456' },
      { id: uuidv4(), name: 'Ananya Reddy', email: 'ananya.reddy@nobrokerdemo.in', role: 'agent', phone: '+91 90088 54321' },
      { id: uuidv4(), name: 'Suresh Patel', email: 'suresh.patel@nobrokerdemo.in', role: 'builder', phone: '+91 87654 32100' },
    ];

    for (const user of demoUsers) {
      await client.query(
        `INSERT INTO users (id, name, email, password_hash, phone, role) VALUES ($1, $2, $3, $4, $5, $6)`,
        [user.id, user.name, user.email, demoPasswordHash, user.phone, user.role]
      );
    }
    
    // 3. Batch insert 50,000 properties with ALL fields populated
    const TOTAL_PROPERTIES = 50000;
    const BATCH_SIZE = 1000;
    const COLUMNS_PER_ROW = 40;
    console.log(`Seeding ${TOTAL_PROPERTIES} properties in batches of ${BATCH_SIZE}...`);

    for (let i = 0; i < TOTAL_PROPERTIES; i += BATCH_SIZE) {
      const values: any[] = [];
      const placeholders: string[] = [];
      
      for (let j = 0; j < BATCH_SIZE; j++) {
        const owner = randomChoice(demoUsers);
        const city = randomChoice(CITIES);
        const localityIdx = randomInt(0, LOCALITIES[city].length - 1);
        const locality = LOCALITIES[city][localityIdx];
        const listingType = Math.random() > 0.3 ? 'rent' : 'buy';
        const propType = randomChoice(PROPERTY_TYPES);
        const bedrooms = propType === 'Studio' ? 1 : randomInt(1, 5);
        const bathrooms = Math.max(1, bedrooms - 1 + randomInt(0, 2));
        const balconies = randomInt(0, 3);
        
        // Price logic
        let price = 0;
        let priceUnit = 'total';
        let depositAmount: number | null = null;
        if (listingType === 'rent') {
          price = randomInt(15, 150) * 1000; // 15k to 1.5L per month
          priceUnit = 'month';
          depositAmount = price * randomInt(2, 6); // 2-6 months deposit
        } else {
          price = randomInt(50, 500) * 100000; // 50L to 5Cr
        }
        
        const carpetArea = propType === 'Studio' ? randomInt(300, 600) : randomInt(400, 3000);
        const superBuiltUp = Math.round(carpetArea * (1 + Math.random() * 0.15 + 0.15)); // 1.15x to 1.30x
        const pricePerSqft = listingType === 'buy' ? Math.round(price / carpetArea) : null;
        const maintenanceCharges = randomInt(2000, 8000);
        
        const furnishing = randomChoice(FURNISHING_TYPES);
        const facing = randomChoice(FACING_DIRECTIONS);
        const floorNo = propType === 'Villa' ? 0 : randomInt(1, 20);
        const totalFloors = propType === 'Villa' ? randomInt(2, 4) : floorNo + randomInt(0, 10);
        const ageOfProperty = randomChoice(AGE_OPTIONS);
        const availableFrom = randomBool(0.4) ? 'Immediate' : `${randomInt(1, 12)}/${2026}`;
        
        const pinCode = PIN_CODES[city][localityIdx];
        const landmark = LANDMARKS[city][localityIdx];
        const societyName = generateSocietyName();
        
        const amenities = JSON.stringify(randomSubset(AMENITIES_LIST, 4, 10));
        const images = JSON.stringify(pickImages(propType));
        
        const isVerified = randomBool(0.4);
        const isZeroBrokerage = randomBool(0.7);
        const gatedSecurity = randomBool(0.6);
        const petFriendly = randomBool(0.25);
        const preferredTenants = listingType === 'rent' 
          ? JSON.stringify(randomSubset(PREFERRED_TENANT_OPTIONS, 1, 3))
          : JSON.stringify([]);
        
        const ownerType = randomChoice(OWNER_TYPES);
        const ownerPhone = generateIndianPhone();
        const ownerEmail = owner.email;
        
        const viewsCount = randomInt(5, 2000);
        const shortlistedCount = randomInt(0, Math.floor(viewsCount * 0.3));
        
        const title = `${bedrooms} BHK ${propType} in ${locality}`;
        const description = `A beautiful ${bedrooms} bedroom ${propType.toLowerCase()} located in the heart of ${locality}, ${city}. This ${furnishing.toLowerCase()} property spans ${carpetArea} sq.ft. of carpet area with ${bathrooms} bathroom(s) and ${balconies} balcony/balconies. Features ${facing} facing, ${gatedSecurity ? 'gated security, ' : ''}and excellent connectivity. ${isVerified ? 'Owner verified listing.' : ''} ${ageOfProperty === 'Under Construction' ? 'Under construction with expected delivery soon.' : `Property age: ${ageOfProperty}.`}`;
        const address = `${societyName}, ${locality}, ${city} - ${pinCode}`;

        // Build placeholder for this row (40 columns)
        const offset = j * COLUMNS_PER_ROW;
        const phs = [];
        for (let k = 1; k <= COLUMNS_PER_ROW; k++) phs.push(`$${offset + k}`);
        placeholders.push(`(${phs.join(', ')})`);
        
        values.push(
          owner.id,           // 1: owner_id
          title,              // 2: title
          description,        // 3: description
          listingType,        // 4: listing_type
          propType,           // 5: property_type
          price,              // 6: price
          priceUnit,          // 7: price_unit
          maintenanceCharges, // 8: maintenance_charges
          depositAmount,      // 9: deposit_amount
          bedrooms,           // 10: bedrooms
          bathrooms,          // 11: bathrooms
          balconies,          // 12: balconies
          carpetArea,         // 13: carpet_area_sqft
          superBuiltUp,       // 14: super_built_up_sqft
          pricePerSqft,       // 15: price_per_sqft
          furnishing,         // 16: furnishing
          facing,             // 17: facing
          floorNo,            // 18: floor_no
          totalFloors,        // 19: total_floors
          ageOfProperty,      // 20: age_of_property
          availableFrom,      // 21: available_from
          address,            // 22: address
          locality,           // 23: locality
          city,               // 24: city
          pinCode,            // 25: pin_code
          landmark,           // 26: landmark
          societyName,        // 27: society_name
          images,             // 28: images
          amenities,          // 29: amenities
          isVerified,         // 30: is_verified
          isZeroBrokerage,    // 31: is_zero_brokerage
          gatedSecurity,      // 32: gated_security
          petFriendly,        // 33: pet_friendly
          preferredTenants,   // 34: preferred_tenants
          owner.name,         // 35: owner_name
          ownerPhone,         // 36: owner_phone
          ownerEmail,         // 37: owner_email
          ownerType,          // 38: owner_type
          viewsCount,         // 39: views_count
          shortlistedCount,   // 40: shortlisted_count
        );
      }

      // Execute batch insert
      const insertQuery = `
        INSERT INTO properties (
          owner_id, title, description, listing_type, property_type, price, price_unit,
          maintenance_charges, deposit_amount, bedrooms, bathrooms, balconies,
          carpet_area_sqft, super_built_up_sqft, price_per_sqft, furnishing, facing,
          floor_no, total_floors, age_of_property, available_from, address, locality, city,
          pin_code, landmark, society_name, images, amenities,
          is_verified, is_zero_brokerage, gated_security, pet_friendly,
          preferred_tenants, owner_name, owner_phone, owner_email, owner_type,
          views_count, shortlisted_count
        ) VALUES ${placeholders.join(', ')}
      `;
      
      await client.query(insertQuery, values);
      console.log(`Inserted ${Math.min(i + BATCH_SIZE, TOTAL_PROPERTIES)} / ${TOTAL_PROPERTIES} properties...`);
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

runSeed();
