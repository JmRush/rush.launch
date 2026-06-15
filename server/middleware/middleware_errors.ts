import { NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError, InternalServerError, InvalidTokenError } from "../types/types_error";
import { Request, Response, NextFunction } from "express";

export const middlewareErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof NotFoundError) {
        return res.status(404).json({ success: false, error: err.message });
    }
    if(err instanceof UnauthorizedError || err instanceof InvalidTokenError) {
        res.cookie("refreshToken", "", {sameSite: "strict", httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 0, path: "/api/auth/refresh"});
        res.cookie("token", "", {sameSite: "strict", httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 0});
        return res.status(401).json({ success: false, error: "Unauthorized, please login" });
    }
    if(err instanceof BadRequestError) {
        return res.status(400).json({ success: false, error: err.message });
    }
    if(err instanceof ForbiddenError) {
        return res.status(403).json({ success: false, error: err.message });
    }
    if(err instanceof InternalServerError) {
        return res.status(500).json({ success: false, error: err.message });
    }
}