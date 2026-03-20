import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL!);

export async function createLeadsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id          SERIAL PRIMARY KEY,
      type        VARCHAR(50)  NOT NULL,
      name        VARCHAR(255) NOT NULL,
      email       VARCHAR(255) NOT NULL,
      phone       VARCHAR(50),
      address     TEXT,
      message     TEXT,
      created_at  TIMESTAMPTZ  DEFAULT NOW()
    )
  `;
}
