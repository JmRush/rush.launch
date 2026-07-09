import { serverTypes } from "../schema";
import { db } from "..";
import { desc, eq } from "drizzle-orm";
import type { ImageData } from "@/server/integrations/dockerhub/client";

export const addServerType = async (imageData: ImageData) => {
  return await db
    .insert(serverTypes)
    .values({
      name: imageData.name,
      description: imageData.description,
      imageUrl: imageData.imageURL,
      namespace: imageData.namespace,
      repository: imageData.repository,
      lastUpdated: new Date(imageData.lastUpdated),
      storageSize: imageData.storageSize || null,
      tags: imageData.tags,
    })
    .returning({ id: serverTypes.id });
};

export const getAllServerTypes = async () => {
  return await db
    .select()
    .from(serverTypes)
    .orderBy(desc(serverTypes.createdAt));
};

export const getServerTypeById = async (id: string) => {
  return await db
    .select()
    .from(serverTypes)
    .where(eq(serverTypes.id, parseInt(id)));
};

//using relations we can return an object in the shape of {..serverTypeInfo, ports[], volumes[]}
export const getServerTypeAndMappingsById = async (serverTypeId: number) => {
  return await db.query.serverTypes.findFirst({
    where: eq(serverTypes.id, serverTypeId),
    with: { ports: true, volumes: true },
  });
};
