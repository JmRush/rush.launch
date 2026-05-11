import { serverTypes } from "../schema"
import { db } from "..";
import { desc } from "drizzle-orm";
import type { ImageData } from "@/server/integrations/dockerhub/client";

export const addServerType = async (imageData: ImageData) => {
    return await db.insert(serverTypes).values({
        name: imageData.name,
        description: imageData.description,
        imageUrl: imageData.imageURL,
        namespace: imageData.namespace,
        repository: imageData.repository,
    });
}

export const getAllServerTypes = async () => {
    return await db.select().from(serverTypes).orderBy(desc(serverTypes.createdAt));
}