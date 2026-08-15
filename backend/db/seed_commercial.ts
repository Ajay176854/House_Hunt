import { Pool } from 'pg';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/househunt',
});

const CITIES = ['Mumbai', 'Bengaluru', 'Delhi-NCR', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad'];

async function runSeed() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT id, name, email FROM users LIMIT 5');
    if (res.rows.length === 0) {
      console.log('No users found. Cannot seed commercial properties.');
      return;
    }
    const demoUsers = res.rows;

    const TOTAL_PROPERTIES = 200;
    console.log('Seeding ' + TOTAL_PROPERTIES + ' Commercial properties...');

    const commercialImages = [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1572025442646-866d16c84a54?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800'
    ];
    
    const plotImages = [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=800'
    ];

    // Clear old seeded commercial/plot properties to avoid duplicates
    await client.query("DELETE FROM properties WHERE property_type IN ('Commercial', 'Plot', 'Land')");

    for (let i = 0; i < TOTAL_PROPERTIES; i++) {
      const owner = demoUsers[Math.floor(Math.random() * demoUsers.length)];
      const city = CITIES[Math.floor(Math.random() * CITIES.length)];
      const listingType = Math.random() > 0.5 ? 'rent' : 'buy';
      
      const isPlot = Math.random() > 0.7; // 30% chance to be a Plot
      const propertyType = isPlot ? 'Plot' : 'Commercial';
      const typeLabel = isPlot ? 'Premium Land/Plot' : 'Premium Commercial Space';
      
      const price = listingType === 'rent' ? Math.floor(Math.random() * 150 + 50) * 1000 : Math.floor(Math.random() * 500 + 100) * 100000;
      const priceUnit = listingType === 'rent' ? 'month' : 'total';
      const carpetArea = Math.floor(Math.random() * 2000 + 500);
      const depositAmount = listingType === 'rent' ? price * Math.floor(Math.random() * 4 + 2) : null;
      
      // Select 2 random images from the appropriate pool
      const poolImages = isPlot ? plotImages : commercialImages;
      const img1 = poolImages[Math.floor(Math.random() * poolImages.length)];
      const img2 = poolImages[Math.floor(Math.random() * poolImages.length)];
      const images = JSON.stringify([img1, img2]);

      await client.query(
        `INSERT INTO properties (
          id, owner_id, title, description, listing_type, property_type, price, price_unit, deposit_amount, 
          bedrooms, carpet_area_sqft, address, locality, city, images, is_verified, is_zero_brokerage, status,
          owner_name, owner_email, owner_type
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)`,
        [
          uuidv4(), owner.id, typeLabel + ' in ' + city, 'Excellent ' + propertyType.toLowerCase() + ' suitable for your requirements.',
          listingType, propertyType, price, priceUnit, depositAmount,
          0, carpetArea, 'Main Road, ' + city, 'Central Business District', city, images, true, true, 'active',
          owner.name, owner.email, 'Owner'
        ]
      );
    }
    console.log('Successfully seeded commercial properties.');
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    pool.end();
  }
}
runSeed();
