import {
  serverTypePorts,
  serverTypeVolumes,
  serverTypes,
  servers,
  serversPorts,
  serversVolumes,
} from "./schema";
import { relations } from "drizzle-orm";

export const serverTypesRelations = relations(serverTypes, ({ many }) => ({
  ports: many(serverTypePorts),
  volumes: many(serverTypeVolumes),
}));

export const serverRelations = relations(servers, ({ many }) => ({
  ports: many(serversPorts),
  volumes: many(serversVolumes),
}));
