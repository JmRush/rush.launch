import { BadRequestError } from "../types/types_error";
import { Request, Response } from "express";
import { getServerTypeById } from "../db/queries/serverTypes";
import { pullDockerImage } from "../integrations/dockerengine/client";

//This create server will be done for the users role, and admins that dont want anything special. There will be an admin path that allows custom commands/builds, (this will probably require a worker);
export async function handlerCreateServer(req: Request, res: Response) {
  //process selected server, match it to a server type
  if (!req.body) {
    throw new BadRequestError("Error, not a valid request");
  }

  let { serverTypeID, serverTag } = req.body;
  if (!serverTypeID) {
    throw new BadRequestError("Error, not a valid request");
  }

  try {
    //verify servertype sent exists in our db, and the given tag also exists in our db
    const serverType = (await getServerTypeById(serverTypeID))[0];
    if (!serverType || !serverType.repository || !serverType.namespace) {
      throw new Error("Malformed data from db");
    }
    const tag = serverType.tags.includes(serverTag) ? serverTag : "latest";
    //if it does exist and our tag is included in the tag array in our db, we use the supplied tag, otherwise we go default "latest" so we don't pull every image from dockerhub of that repo
    await pullDockerImage(serverType.namespace, serverType.repository, tag);
  } catch (error) {
    console.error("Issue getting server type of id: " + serverTypeID);
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
}
