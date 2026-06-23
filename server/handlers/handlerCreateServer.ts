import { BadRequestError } from "../types/types_error";
import { Request, Response } from "express";

export async function handlerCreateServer(req: Request, res: Response) {
  //process selected server, match it to a server type
  if (!req.body) {
    throw new BadRequestError("Error, not a valid request");
  }

  const { server } = req.body;
  if (!server) {
    throw new BadRequestError("Error, not a valid request");
  }

  //what server data are we sending? are we sending a whole object or just the id?
  //otherwise we verify server data by finding a match and using that data from the DB;

  //pass server creation data to worker
  //worker handles connection to Docker engine API, creation of server, and finally a response or retries for server creation
}
