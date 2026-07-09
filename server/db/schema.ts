import { sqliteTable, text, integer, unique } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
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
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updateAt: integer("update_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  revokedAt: integer("revoked_at", { mode: "timestamp" }).default(sql`null`),
});

//ROLES AND LOOKUP ROLES

export const roles = sqliteTable("roles", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const userRoles = sqliteTable("user_roles", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  roleId: integer("role_id").references(() => roles.id, {
    onDelete: "cascade",
  }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

//Template for servers, stores all image data and will have default container bindings

export const serverTypes = sqliteTable("server_types", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  namespace: text("namespace").notNull(),
  repository: text("repository").notNull(),
  tags: text("tags", { mode: "json" })
    .notNull()
    .$type<string[]>()
    .default(sql`(json_array())`),
  lastUpdated: integer("last_updated", { mode: "timestamp" }).notNull(),
  storageSize: integer("storage_size"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const serverTypePorts = sqliteTable(
  "server_type_ports",
  {
    id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
    serverTypeId: integer("server_type_id")
      .notNull()
      .references(() => serverTypes.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    protocol: text("protocol").notNull(),
    container_port: integer("container_port").notNull(),
  },
  (t) => [unique().on(t.container_port, t.protocol)],
);

export const serverTypeVolumes = sqliteTable("server_type_volumes", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  serverTypeId: integer("server_type_id")
    .notNull()
    .references(() => serverTypes.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  container_path: text("container_path").notNull(),
});

/////////////////////////////////////
//ACTIVE SERVER INFO - PORTS,VOLS,ETC
/////////////////////////////////////
export const servers = sqliteTable("active_servers", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(), //this will be the container id after container creation is confirmed successful
  containerId: text("container_id").notNull(),
  ip: text("ip").notNull(),
  name: text("name").notNull(),
  status: text("status").notNull(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  serverTypeId: integer("server_type_id")
    .references(() => serverTypes.id, {
      onDelete: "cascade",
    })
    .notNull(),
});
//group servers by type when displaying active_servers
//"Minecraft" - 1 active minecraft server
//"Factorio" - Currently no active servers

export const serversPorts = sqliteTable(
  "active_servers_ports",
  {
    id: integer("id").notNull().primaryKey({ autoIncrement: true }),
    serverId: integer("server_id")
      .references(() => servers.id, {
        onDelete: "cascade",
      })
      .notNull(),
    serverTypePortId: integer("server_port_type_id")
      .references(() => serverTypePorts.id)
      .notNull(),
    host_port: integer("host_port").notNull(),
    protocol: text("protocol").notNull(),
  },
  (t) => [unique().on(t.host_port, t.protocol)],
);

export const serversVolumes = sqliteTable("active_servers_volumes", {
  id: integer("id").notNull().primaryKey({ autoIncrement: true }),
  serverId: integer("server_id").references(() => servers.id, {
    onDelete: "cascade",
  }),
  serverTypeVolumeId: integer("sever_type_volume_id")
    .references(() => serverTypeVolumes.id)
    .notNull(),
  host_path: text("host_path").notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Server = typeof servers.$inferSelect;
export type NewServer = typeof servers.$inferInsert;
export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;
export type UserRole = typeof userRoles.$inferSelect;
export type NewUserRole = typeof userRoles.$inferInsert;
export type ServerType = typeof serverTypes.$inferSelect;
export type NewServerType = typeof serverTypes.$inferInsert;
