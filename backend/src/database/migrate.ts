/**
 * Migration runner
 * Usage:  npx ts-node src/database/migrate.ts
 *         npx ts-node src/database/migrate.ts --seed
 */
import fs from "fs";
import path from "path";
import { db } from "../config/database";
import { logger } from "../utils/logger";

const MIGRATIONS_DIR = path.resolve(__dirname, "../../../database/migrations");
const SEEDS_DIR      = path.resolve(__dirname, "../../../database/seeds");

async function ensureMigrationsTable(): Promise<void> {
  await db.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id         SERIAL      PRIMARY KEY,
      filename   VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function getAppliedMigrations(): Promise<Set<string>> {
  const result = await db.query<{ filename: string }>(
    "SELECT filename FROM _migrations ORDER BY id"
  );
  return new Set(result.rows.map((r) => r.filename));
}

async function runSqlFiles(dir: string, label: string): Promise<void> {
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    logger.info(`No ${label} files found in ${dir}`);
    return;
  }

  const applied = label === "migration" ? await getAppliedMigrations() : new Set<string>();

  for (const file of files) {
    if (label === "migration" && applied.has(file)) {
      logger.debug(`Skipping already applied migration: ${file}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(dir, file), "utf-8");
    logger.info(`Running ${label}: ${file}`);

    const client = await db.connect();
    try {
      await client.query("BEGIN");
      await client.query(sql);
      if (label === "migration") {
        await client.query("INSERT INTO _migrations (filename) VALUES ($1)", [file]);
      }
      await client.query("COMMIT");
      logger.info(`✓ ${file}`);
    } catch (err) {
      await client.query("ROLLBACK");
      logger.error(`✗ ${file} failed`, err);
      throw err;
    } finally {
      client.release();
    }
  }
}

async function main(): Promise<void> {
  const runSeeds = process.argv.includes("--seed");

  try {
    await ensureMigrationsTable();
    await runSqlFiles(MIGRATIONS_DIR, "migration");

    if (runSeeds) {
      await runSqlFiles(SEEDS_DIR, "seed");
    }

    logger.info("Database setup complete");
  } catch (err) {
    logger.error("Database setup failed", err);
    process.exit(1);
  } finally {
    await db.end();
  }
}

main();
