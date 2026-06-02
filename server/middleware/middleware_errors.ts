import { redirect } from "next/navigation";
import { getBearerToken } from "../auth/auth";
import { NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError, InternalServerError, InvalidTokenError } from "../types/types_error";
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
    if(err instanceof BadRequestError) {
        return res.status(400).json({ success: false, error: err.message });
    }
    if(err instanceof InvalidTokenError) {
        res.clearCookie("token");
        res.clearCookie("refreshToken");
        redirect("http://localhost:3000/login");
    }
    if(err instanceof InternalServerError) {
        return res.status(500).json({ success: false, error: err.message });
    }
}