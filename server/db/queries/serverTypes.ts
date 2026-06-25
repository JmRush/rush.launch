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
      pullCount: imageData.pullCount,
      starCount: imageData.starCount,
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
