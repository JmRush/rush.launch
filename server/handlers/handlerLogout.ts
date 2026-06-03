import { Request, Response } from "express";
import { UnauthorizedError, InternalServerError } from "../types/types_error";
import { getRefreshToken, revokeRefreshToken } from "../db/queries/auth";

export const handlerLogout = async (req: Request, res: Response) => {
    try {
        //get the refresh token from the cookies
        const refreshToken = req.cookies.refreshToken;
        if(refreshToken) {
            await revokeRefreshToken(refreshToken);
        }
        //clear the cookies
        res.cookie("refreshToken", "", {sameSite: "strict", httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 0 });
        res.cookie("token", "", {sameSite: "strict", httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 0 });
        res.status(200).json({success: true, message: "Logged out successfully"});
    } catch(error) {
        console.error("Error in handlerRevoke:", error);
        if(error instanceof UnauthorizedError) {
            res.status(401).json({ success: false, error: error.message });
        } else {
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }
}
