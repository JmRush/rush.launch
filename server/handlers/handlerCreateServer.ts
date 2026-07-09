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
      throw new InternalServerError(
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
      throw new UnauthorizedError("Issue verifying user.");
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

    //container creations requires the template server,
    //generated AVAIL ports,
    //generated volume locations unique per container,
    //even servername can be generated

    const containerId = await createContainer(serverTypeAndMappings);
    if (!containerId) {
      throw new InternalServerError("Issue creating the container");
    }

    let serverObj = {
      containerId: contianerId,
      ip: env.MAIN_HOST,
      name: "bleh",
      status: "pending",
      createdBy: userId,
      updatedBy: userId,
      serverTypeId: serverTypeAndMappings.id,
    };

    db.transaction((tx) => {
      //insert server information, return serverId
      const server = tx.insert(servers).values(serverObj);

      //insert port/volume information with serverId information
      return server;
    });
  } catch (error) {
    console.error("Issue getting server type in handlerCreateServer");
    throw new Error((error as Error).message);
  }

  //which will be from our db request to ensure no issues could be had;

  //Logistical Issues:
  //  Create container
  //    User drop down for container versions (which means versions will be important)
  //
  //
  //  Deploy container:
  //    We need to check which ports are open/in use
  //    We need to verify the user doesn't already have an active_server of this type
  //

  //otherwise we verify server data by finding a match and using that data from the DB;

  //pass server creation data to worker
  //worker handles connection to Docker engine API, creation of server, and finally a response or retries for server creation
};
