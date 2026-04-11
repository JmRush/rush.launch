import { Request, Response } from "express";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../types/types_error";
import { getRefreshToken} from "../db/queries/auth";
import { makeRefreshToken } from "../auth/auth";

export const handlerRefresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) {
        throw new UnauthorizedError("No refresh token");
    }
    const userToken = await getRefreshToken(refreshToken);
    if(!userToken) {
        throw new UnauthorizedError("Invalid refresh token");
    }
    if(userToken.revokedAt) {
        throw new UnauthorizedError("Refresh token revoked");
    }
}

