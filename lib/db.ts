import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var _tablesReady: boolean | undefined;
}

function getPool(): Pool {
  if (global._pgPool) return global._pgPool;

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL environment variable is not set");

  const pool = new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  if (process.env.NODE_ENV !== "production") global._pgPool = pool;
  return pool;
}

export async function initTables(): Promise<void> {
  if (global._tablesReady) return;
  const db = getPool();
  await db.query(`
    CREATE TABLE IF NOT EXISTS generations (
      id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
      topic         TEXT          NOT NULL,
      media_brand   VARCHAR(50)   NOT NULL,
      brand_target  TEXT          NOT NULL,
      ratio         VARCHAR(10)   NOT NULL,
      output_type   VARCHAR(20)   NOT NULL,
      style         VARCHAR(30)   NOT NULL,
      main_headline TEXT,
      language      VARCHAR(5),
      story_sections JSONB        NOT NULL DEFAULT '[]',
      images        JSONB         NOT NULL DEFAULT '[]',
      thumbnail     TEXT,
      created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_gen_brand   ON generations(media_brand);
    CREATE INDEX IF NOT EXISTS idx_gen_created ON generations(created_at DESC);
  `);
  global._tablesReady = true;
}

// Call this in every API handler before any query
export async function query(
  text: string,
  params?: unknown[]
): Promise<{ rows: Record<string, unknown>[]; rowCount: number | null }> {
  await initTables();
  return getPool().query(text, params) as Promise<{
    rows: Record<string, unknown>[];
    rowCount: number | null;
  }>;
}
