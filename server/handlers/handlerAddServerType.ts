import { db } from "../db";
import { fetchImagedata } from "../integrations/dockerhub/client";
import { Request, Response } from "express";
import { BadRequestError, InternalServerError } from "../types/types_error";
import { serverTypePorts, serverTypes, serverTypeVolumes } from "../db/schema";
import {
  CreateContainerPort,
  CreateContainerVolume,
} from "../schema/servertype.schema";

export const handlerAddServerType = async (req: Request, res: Response) => {
  try {
    const { ports, volumes, imageData } = await fetchImagedata(req);

    //add port and volumes here in transaction with the below
    const result = await db.transaction(async (tx) => {
      const [inserted] = await tx
        .insert(serverTypes)
        .values({
          name: imageData.name,
          description: imageData.description,
          imageUrl: imageData.imageUrl,
          namespace: imageData.namespace,
          repository: imageData.repository,
          tags: imageData.tags,
          lastUpdated: new Date(imageData.lastUpdated),
          storageSize: imageData.storageSize,
        })
        .returning();

      const validatedPorts = ports.map((port) => {
        return CreateContainerPort.parse({
          ...port,
          serverTypeId: inserted.id,
        });
      });

      const validatedVolumes = volumes.map((volume) => {
        return CreateContainerVolume.parse({
          ...volume,
          serverTypeId: inserted.id,
        });
      });
      if (
        !validatedVolumes ||
        !validatedVolumes.length ||
        !validatedPorts ||
        !validatedPorts.length
      ) {
        throw new BadRequestError("Error valdiating request data");
      }

      //insert here
      await tx.insert(serverTypePorts).values(validatedPorts);
      await tx.insert(serverTypeVolumes).values(validatedVolumes);

      return inserted;
    });

    res.status(200).json({ success: true, id: result.id });
  } catch (error) {
    throw new InternalServerError((error as Error).message);
  }
};
