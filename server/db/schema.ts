import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const userTokens = sqliteTable("user_tokens", {
  token: text("token").notNull().primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updateAt: integer("update_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  revokedAt: integer("revoked_at", { mode: "timestamp" }),
});

export const roles = sqliteTable("roles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const userRoles = sqliteTable("user_roles", {
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  roleId: integer("role_id").references(() => roles.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const serverUsers = sqliteTable("server_users", {
  serverId: integer("server_id").references(() => servers.id, { onDelete: "cascade" }),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});


export const servers = sqliteTable("servers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ip: text("ip").notNull(),
  port: integer("port").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull(),
  type: text("type").notNull(),
  createdBy: integer("created_by").references(() => users.id, { onDelete: "set null" }),
  updatedBy: integer("updated_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Server = typeof servers.$inferSelect;
export type NewServer = typeof servers.$inferInsert;
export type ServerUser = typeof serverUsers.$inferSelect;
export type NewServerUser = typeof serverUsers.$inferInsert;
export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;
export type UserRole = typeof userRoles.$inferSelect;
export type NewUserRole = typeof userRoles.$inferInsert;
