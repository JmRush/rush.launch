import { servers, serversPorts, serversVolumes } from "../schema";
import { db } from "..";
import { eq, and, desc } from "drizzle-orm";

export const getActiveServers = async () => {
  //might cut down on what is actually returned by the query
  return await db.select().from(servers);
};

export const getLatestServer = async () => {
  return await db
    .select()
    .from(servers)
    .orderBy(desc(servers.createdAt))
    .limit(1);
};

export const createActiveServer = async (
  userId: number,
  server_type_id: number,
) => {
  return await db
    .select()
    .from(servers)
    .where(
      and(
        eq(servers.createdBy, userId),
        eq(servers.serverTypeId, server_type_id),
      ),
    );
};

//get all ports and volumes of the given container
export const getActiveServerPorts = async () => {
  return await db.select().from(serversPorts);
};

export const getActiveServerVolumes = async () => {
  return await db.select().from(serversVolumes);
};
