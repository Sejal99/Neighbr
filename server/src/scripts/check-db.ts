
import "../config/env";
import { pool } from "../config/database";

async function checkDatabase() {
  try {
    const result = await pool.query(
      "SELECT NOW() AS current_time",
    );

    console.info("PostgreSQL connected successfully!");
    console.info("Database time:", result.rows[0].current_time);
  } catch (error) {
    console.error("PostgreSQL connection failed:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

void checkDatabase();
