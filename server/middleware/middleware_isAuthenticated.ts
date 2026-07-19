import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../types/types_error";
import { getBearerToken, validateJWT } from "../auth/auth";
import { getUserAndRolesById } from "../db/queries/roles";

export async function middlewareIsAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = getBearerToken(req);
    //validate the token, but how do we know to call refresh?
    const userId: number = (await validateJWT(
      token,
      process.env.JWT_SECRET as string,
    )) as number;

    if (!userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    //get user's role from the db, and check if they are allowed to access the path
    const userAndRole = (await getUserAndRolesById(userId))[0];
    if (!userAndRole) {
      throw new UnauthorizedError("Issue getting user's role");
    }

    //do we care if admin can access the normal dashboard? probably not
    if (userAndRole.role === "user" && req.path.includes("/admin/")) {
      throw new ForbiddenError("User does not have access to this path");
    }
    //nothing has gone wrong, continue on the lifecycle of the request next();

    next();
  } catch (error) {
    console.error("Error in middlewareIsAuthenticated:", error);
    next(error);
  }
}
