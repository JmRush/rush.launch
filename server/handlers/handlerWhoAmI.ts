import { Request, Response } from "express";
import { UnauthorizedError } from "../types/types_error";
import { getUserAndRolesById } from "../db/queries/roles";
import { getBearerToken, validateJWT } from "../auth/auth";

export const handlerWhoAmI = async (req: Request, res: Response) => {
  try {
    //get the user and their role from the database based off of the refresh token?
    const token = getBearerToken(req);
    const userId = await validateJWT(token, process.env.JWT_SECRET as string);
    if (!userId) {
      throw new UnauthorizedError("Invalid access token, or token expired");
    }

    const userAndRoles = await getUserAndRolesById(userId as number);
    if (!userAndRoles || userAndRoles.length === 0) {
      throw new UnauthorizedError("User not found");
    }

    res.status(200).json({
      name: userAndRoles[0].name,
      email: userAndRoles[0].email,
      roles: [userAndRoles[0].role],
    });
  } catch (error) {
    console.error("Error in handlerWhoAmI:", error);
    throw error;
};
