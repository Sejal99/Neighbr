
import "../config/env";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pool } from "../config/database";

async function runMigrations() {
  const migrationsDirectory = path.join(
    process.cwd(),
    "src/database/migrations",
  );

  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const files = (await readdir(migrationsDirectory))
      .filter((file) => file.endsWith(".sql"))
      .sort();

    for (const file of files) {
      await client.query("BEGIN");

      try {
        const result = await client.query(
          "SELECT filename FROM schema_migrations WHERE filename = $1",
          [file],
        );

        if (result.rowCount && result.rowCount > 0) {
          await client.query("ROLLBACK");
          console.info(`Already applied: ${file}`);
          continue;
        }

        const sql = await readFile(
          path.join(migrationsDirectory, file),
          "utf8",
        );

        await client.query(sql);

        await client.query(
          "INSERT INTO schema_migrations (filename) VALUES ($1)",
          [file],
        );

        await client.query("COMMIT");
        console.info(`Applied: ${file}`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }

    console.info("Database migrations completed.");
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch((error: unknown) => {
  console.error("Migration failed:", error);
  process.exitCode = 1;
});
