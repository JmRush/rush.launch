import { addServerType } from "../db/queries/serverTypes";
import { fetchImagedata } from "../integrations/dockerhub/client";
import { Request, Response } from "express";


export const handlerAddServer = async (req: Request, res: Response) => {
    try {
        const imageData = await fetchImagedata(req, res);
        const serverTypeId = await addServerType(imageData);
        return res.status(200).json({ id: serverTypeId });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}