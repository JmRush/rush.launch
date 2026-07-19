import { Request, Response } from "express";
import { UnauthorizedError, InternalServerError } from "../types/types_error";
import { getRefreshToken, revokeRefreshToken } from "../db/queries/auth";
import { makeJWT, makeRefreshToken } from "../auth/auth";

export const handlerRefresh = async (req: Request, res: Response) => {
  try {
    const userRefreshToken = req.cookies.refreshToken;
    if (!userRefreshToken) {
      throw new UnauthorizedError("No refresh token provided");
    }
    const dbRefreshToken = await getRefreshToken(userRefreshToken);
    if (!dbRefreshToken) {
      throw new UnauthorizedError("Invalid refresh token");
    }
    if (dbRefreshToken.revokedAt !== null) {
      throw new UnauthorizedError("Refresh token revoked");
    }

    const jwt = await makeJWT(
      dbRefreshToken.userId,
      process.env.JWT_SECRET as string,
    );
    //revoke the old refresh token
    await revokeRefreshToken(userRefreshToken);
    //make a new refresh token
    const newRefreshToken = await makeRefreshToken(dbRefreshToken.userId);
    //set the cookies
    res.cookie("refreshToken", newRefreshToken, {
      sameSite: "strict",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: "/api/auth/refresh",
    });
    res.cookie("token", jwt, {
      sameSite: "strict",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 30,
    });
    res.status(200).json({ success: true, message: "Token refreshed" });
  } catch (error) {
    console.error("Error in handlerRefresh:", error);
    throw error;
};
