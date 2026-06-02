import { Request, Response } from "express";
import { UnauthorizedError } from "../types/types_error";
import { getRefreshToken } from "../db/queries/auth";
import { getUserAndRolesById } from "../db/queries/roles";

export const handlerWhoAmI = async (req: Request, res: Response) => {
    try {
        //get the user and their role from the database based off of the refresh token?
        const userRefreshToken = req.cookies.refreshToken;
        if(!userRefreshToken) {
            throw new UnauthorizedError("No refresh token provided");
        }
        const refreshTokenRow = await getRefreshToken(userRefreshToken);
        if(!refreshTokenRow) {
            throw new UnauthorizedError("Invalid refresh token");
        }
        if(refreshTokenRow.revokedAt !== null) {
            throw new UnauthorizedError("Refresh token revoked");
        }
        const userAndRoles = await getUserAndRolesById(refreshTokenRow.userId);
        if(!userAndRoles || userAndRoles.length === 0) {
            throw new UnauthorizedError("User not found");
        }
        res.status(200).json({name: userAndRoles[0].name, email: userAndRoles[0].email, roles: [userAndRoles[0].role]});
    } catch(error) {
        console.error("Error in handlerWhoAmI:", error);
        if(error instanceof UnauthorizedError) {
            res.status(401).json({ success: false, error: error.message });
        } else {
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }
}