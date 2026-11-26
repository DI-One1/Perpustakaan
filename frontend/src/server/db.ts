import postgres from "postgres";

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://bilik_user:bilik_password@localhost:5432/bilik_db?sslmode=disable";

// Singleton client postgres untuk Next.js server runtime
const globalForDb = globalThis as unknown as {
  sql: postgres.Sql | undefined;
};

export const sql =
  globalForDb.sql ??
  postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    // prepare: false sangat krusial untuk mode transaksi connection pooler (misal Supabase pooler di port 6543)
    prepare: false,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.sql = sql;
}

export default sql;
