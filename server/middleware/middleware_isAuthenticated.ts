import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../types/types_error";
import { getBearerToken, validateJWT } from "../auth/auth";

export async function middlewareIsAuthenticated(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const token = getBearerToken(req);
        //validate the token, but how do we know to call refresh?
        const userId = await validateJWT(token, process.env.JWT_SECRET as string);
        if(!userId) {
            throw new UnauthorizedError("Unauthorized");
        }

        //get user's role from the db, and check if they are allowed to access the path


        //if they are not allowed, throw an unauthorized error and redirect to opposite dashboard page, if they are allowed, continue, otherwise our auth handles this


        next();
    }catch(error) {
        console.error("Error in middlewareIsAuthenticated:", error);
        if(error instanceof UnauthorizedError) {
            res.status(401).json({ success: false, error: error.message });
        } else {
            next(error);
        }
    }
}