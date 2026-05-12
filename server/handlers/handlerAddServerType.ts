import { addServerType } from "../db/queries/serverTypes";
import { fetchImagedata } from "../integrations/dockerhub/client";
import { Request, Response } from "express";
import { BadRequestError, InternalServerError } from "../types/types_error";


export const handlerAddServerType = async (req: Request, res: Response) => {
    try {
        const imageData = await fetchImagedata(req);
        console.log("imageData", imageData);
        if(!imageData) {
            throw new BadRequestError("Failed to fetch image data");
        }
        const serverTypeId = await addServerType(imageData);
        console.log("serverTypeId", serverTypeId);
        if(!serverTypeId) {
            throw new InternalServerError("Failed to add server type");
        }
        res.status(200).json({ success: true, id: serverTypeId });
    } catch (error) {
        throw new InternalServerError((error as Error).message);
    }   
}