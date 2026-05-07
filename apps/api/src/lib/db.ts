import { Pool } from "pg";
import { env } from "./env";
import { logger } from "./logger";
import { LOG_EVENTS } from "@/constants/logger.constants";

let pool: Pool | undefined;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on("error", (err) => {
      logger.error(
        {
          err,
          action: LOG_EVENTS.DB_POOL_ERROR,
        },
        "Unexpected pg pool error",
      );
    });
  }
  return pool;
}
