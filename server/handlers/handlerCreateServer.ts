import { BadRequestError } from "../types/types_error";
import { Request, Response } from "express";
import { getServerTypeById } from "../db/queries/serverTypes";
import { pullDockerImage } from "../integrations/dockerengine/client";

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
    const serverType = (await getServerTypeById(serverTypeID))[0];

    const tag = serverType.tags.includes(serverTypeTag)
      ? serverTypeTag
      : "latest";

    await pullDockerImage(serverType.namespace, serverType.repository, tag);

    //to run we need to know (1 the run command, 2 resource limitations, 3 port assignment, 4 volume allocation (if required));
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
