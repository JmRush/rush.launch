import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema from "./schema";

const dbPath = process.env.DATABASE_URL ?? "server/data/sqlite.db";
const sqlite = new Database(dbPath);
export const db = drizzle({ client: sqlite, schema });
