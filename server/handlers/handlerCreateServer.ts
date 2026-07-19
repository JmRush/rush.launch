import {
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from "../types/types_error";
import { Request, Response } from "express";
import { getServerTypeAndMappingsById } from "../db/queries/serverTypes";
import {
  createContainer,
  pullDockerImage,
} from "../integrations/dockerengine/client";
import { db } from "../db";
import { servers } from "../db/schema";
import { getBearerToken, validateJWT } from "../auth/auth";
import { env } from "../schema/env.schema";
import { ServerTypeAndMappings } from "../schema/common.schema";
import { eq} from "drizzle-orm";

export const handlerCreateServer = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      throw new BadRequestError("Error, not a valid request");
    }

    let { serverTypeID, serverTypeTag } = req.body;

    if (!serverTypeID) {
      throw new BadRequestError("Error, not a valid request");
    }

    //get server type and information (ports/vols); NOT COMPLETED YET - WARNING
    const serverTypeAndMappings =
      await getServerTypeAndMappingsById(serverTypeID);

    if (!serverTypeAndMappings) {
      throw new BadRequestError(
        "Issue getting server template and port/volume mappings",
      );
    }

    //verify the tag exists inside our tags list, if not set the tag to latest
    const tag = serverTypeAndMappings.tags.includes(serverTypeTag)
      ? serverTypeTag
      : "latest";

    const token = getBearerToken(req);
    const userId = await validateJWT(token, env.JWT_SECRET);
    if (!userId || typeof userId != "number") {
      throw new UnauthorizedError("Issue verifying user");
    }

    //create server before this, get return id, if successful insert into db via this object
    //otherwise exit early

    const pullResult = await pullDockerImage(
      serverTypeAndMappings.namespace,
      serverTypeAndMappings.repository,
      tag,
    );

    if (!pullResult) {
      throw new InternalServerError(
        "Issue pulling server from dockerhub. In pullDockerImage",
      );
    }

    const parsedTypeAndMappings = ServerTypeAndMappings.parse(
      serverTypeAndMappings,
    );
    const { container, ports, volumes, containerId } = await createContainer(
      parsedTypeAndMappings,
      userId,
      serverTypeTag,
    );

    if (!containerId) {
      throw new InternalServerError("Issue creating the container");
    }

    await db.transaction((tx) => {
      await tx.insert(serverPorts).values(ports);
      await tx.insert(serverVolumes).values(volumes);
      await tx.update(servers)
        .set({ containerId: containerId, status: "Launching..." })
        .where(eq(servers.id, container.id));
    });

    res.status(200).json({});
  } catch (error) {
    console.error("Issue getting server type in handlerCreateServer");
    throw error;
  }

