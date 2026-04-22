import { NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError } from "../types/types_error";
import { Request, Response, NextFunction } from "express";

export const middlewareErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof NotFoundError) {
        return res.status(404).json({ success: false, error: err.message });
    }
    if(err instanceof UnauthorizedError) {
        return res.status(401).json({ success: false, error: err.message });
    }
    if(err instanceof BadRequestError) {
        return res.status(400).json({ success: false, error: err.message });
    }
    if(err instanceof ForbiddenError) {
        return res.status(403).json({ success: false, error: err.message });
    }
    return res.status(500).json({ success: false, error: "Internal server error" });
}