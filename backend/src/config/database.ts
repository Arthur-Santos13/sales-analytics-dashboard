import { Pool } from "pg";
import { env } from "./env";

export const db = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function connectDatabase(): Promise<void> {
  const client = await db.connect();
  client.release();
  console.log("Database connection established");
}
