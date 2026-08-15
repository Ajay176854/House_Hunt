import type { Knex } from "knex";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function up(knex: Knex): Promise<void> {
  // Read the raw SQL file directly to maintain exactly the same structure, indexes, and constraints
  const sql = fs.readFileSync(path.resolve(__dirname, "../db/migrations/001_initial_schema.sql"), "utf-8");
  await knex.raw(sql);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TABLE IF EXISTS refresh_tokens CASCADE;');
  await knex.raw('DROP TABLE IF EXISTS inquiries CASCADE;');
  await knex.raw('DROP TABLE IF EXISTS properties CASCADE;');
  await knex.raw('DROP TABLE IF EXISTS users CASCADE;');
}
