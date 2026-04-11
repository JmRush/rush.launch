import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

const dbPath = process.env.DATABASE_URL ?? "server/data/sqlite.db";
const sqlite = new Database(dbPath);
const db = drizzle({ client: sqlite });

migrate(db, { migrationsFolder: "server/drizzle" });
