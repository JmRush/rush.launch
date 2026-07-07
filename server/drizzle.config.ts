import { defineConfig } from "drizzle-kit";
import { env } from "./schema/env.schema";

export default defineConfig({
  schema: "./server/db/schema.ts",
  out: "./server/drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: env.DATABASE_URL ?? "server/data/sqlite.db",
  },
});
