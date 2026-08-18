
const fs = require('fs');
const broken = JSON.parse(fs.readFileSync('broken_urls.json', 'utf8'));
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/househunt'
});

async function fix() {
  await client.connect();
  try {
    for (const url of broken) {
      console.log('Replacing', url);
      const res = await client.query(\
        UPDATE properties 
        SET images = CAST(REPLACE(CAST(images AS TEXT), \, \) AS JSONB)
        WHERE CAST(images AS TEXT) LIKE \
      \, [url, 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&auto=format&fit=crop&q=80', '%' + url + '%']);
      console.log('Updated rows:', res.rowCount);
    }
  } catch(e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
fix();

