import { getAllServerTypes } from "../db/queries/serverTypes";
import { Request, Response } from "express";
import { NotFoundError, InternalServerError } from "../types/types_error";


export const handlerGetServerTypes = async (req: Request, res: Response) => {
    try {
        const serverTypes = await getAllServerTypes();
        if(!serverTypes) {
            throw new NotFoundError("No server types found");
        }
        res.status(200).json({ success: true, serverTypes: serverTypes });
    } catch (error) {
        throw new InternalServerError((error as Error).message);
    }   
}