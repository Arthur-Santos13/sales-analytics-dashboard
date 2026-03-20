import { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";
import { env } from "./env";
import { logger } from "../utils/logger";

export const db = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Log unexpected pool-level errors so they never crash the process silently
db.on("error", (err: Error) => {
  logger.error("Unexpected PostgreSQL pool error", err.message);
});

export async function connectDatabase(): Promise<void> {
  const client: PoolClient = await db.connect();
  try {
    await client.query("SELECT 1");
    logger.info(`Connected to PostgreSQL — ${env.DB_NAME}@${env.DB_HOST}:${env.DB_PORT}`);
  } finally {
    client.release();
  }
}

/**
 * Typed query wrapper — avoids importing Pool everywhere.
 * Usage: const result = await query<MyRow>('SELECT ...', [param])
 */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  const result = await db.query<T>(text, params);
  const duration = Date.now() - start;
  logger.debug(`Query executed in ${duration}ms — rows: ${result.rowCount}`, { text });
  return result;
}

/** Run multiple statements inside a single transaction. */
export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
