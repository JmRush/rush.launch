import { servers, serversPorts, serversVolumes } from "../schema";
import { db } from "..";
import { eq, and, desc } from "drizzle-orm";
import { Protocol } from "../../integrations/dockerengine/client";
import { env } from "../../schema/env.schema";
import { ServerTypeAndMappings_T } from "@/server/schema/common.schema";

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

export const addContainerToDB = async (
  stm: ServerTypeAndMappings_T,
  userId: number,
  tag: string,
  name: string,
) => {
  return await db
    .insert(servers)
    .values({
      serverTypeId: stm.id,
      tag: tag,
      name: name,
      ip: env.MAIN_HOST,
      status: "pending",
      containerId: null,
      createdBy: userId,
      updatedBy: userId,
    })
    .returning();
};

//get all ports and volumes of the given container
export const getPortsMatch = async (port: number, proto: Protocol) => {
  return await db
    .select()
    .from(serversPorts)
    .where(
      and(eq(serversPorts.host_port, port), eq(serversPorts.protocol, proto)),
    );
};
