import { BadRequestError } from "../types/types_error";
import { Request, Response } from "express";

//This create server will be done for the users role, and admins that dont want anything special. There will be an admin path that allows custom commands/builds, (this will probably require a worker);
export async function handlerCreateServer(req: Request, res: Response) {
  //process selected server, match it to a server type
  if (!req.body) {
    throw new BadRequestError("Error, not a valid request");
  }

  const { server } = req.body;
  if (!server) {
    throw new BadRequestError("Error, not a valid request");
  }
  //Logistical Issues:
  //
  //Create Container vs Deploy container
  //
  //Create container
  //
  //
  //
  //
  //We need to check which ports are open/in use
  //We need to verify the user doesn't already have an active_server of this type
  //
  //
  // export const serverTypes = sqliteTable("server_types", {
  //   id: integer("id").primaryKey({ autoIncrement: true }),
  //   name: text("name").notNull(),
  //   description: text("description").notNull(),
  //   imageUrl: text("image_url").notNull(),
  //   namespace: text("namespace").notNull(),
  //   repository: text("repository").notNull(),
  //   tags: text("tags", { mode: "json" })
  //     .notNull()
  //     .$type<string[]>()
  //     .default(sql`(json_array())`),
  //   pullCount: integer("pull_count").notNull(),
  //   starCount: integer("star_count").notNull(),
  //   lastUpdated: integer("last_updated", { mode: "timestamp" }).notNull(),
  //   storageSize: integer("storage_size"),
  //   createdAt: integer("created_at", { mode: "timestamp" })
  //     .$defaultFn(() => new Date())
  //     .notNull(),
  //   updatedAt: integer("updated_at", { mode: "timestamp" })
  //     .$defaultFn(() => new Date())
  //     .notNull(),
  // });
  //
  //
  // export const servers = sqliteTable("active_servers", {
  //   id: integer("id").primaryKey({ autoIncrement: true }),
  //   ip: text("ip").notNull(),
  //   port: integer("port").notNull(),
  //   name: text("name").notNull(),
  //   status: text("status").notNull(),
  //   createdBy: integer("created_by").references(() => users.id, {
  //     onDelete: "set null",
  //   }),
  //   updatedBy: integer("updated_by").references(() => users.id, {
  //     onDelete: "set null",
  //   }),
  //   createdAt: integer("created_at", { mode: "timestamp" })
  //     .$defaultFn(() => new Date())
  //     .notNull(),
  //   updatedAt: integer("updated_at", { mode: "timestamp" })
  //     .$defaultFn(() => new Date())
  //     .notNull(),
  //   serverTypeId: integer("server_type_id").references(() => serverTypes.id, {
  //     onDelete: "cascade",
  //   }),
  // });
  //
  //   //

  //otherwise we verify server data by finding a match and using that data from the DB;

  //pass server creation data to worker
  //worker handles connection to Docker engine API, creation of server, and finally a response or retries for server creation
}
