import * as jose from "jose";
import { UnauthorizedError } from "../types/types_error";
import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import { insertRefreshToken } from "../db/queries/auth";
import { InvalidTokenError } from "../types/types_error";


export async function makeJWT(userId: number, secret: string) {
    const token = await new jose.SignJWT({ userId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime('30m')
        .sign(new TextEncoder().encode(secret));
    return token;
}

export async function validateJWT(token: string, secret: string) {
    try {
        const { payload, protectedHeader } = await jose.jwtVerify(token, new TextEncoder().encode(secret));
        return payload.userId;
    } catch(error) {
        console.error("Error in validateJWT:", error);
        throw new InvalidTokenError("Invalid token, or token expired");
    }
}

//this needs to change as we are using cookies now
export function getBearerToken(req: Request): string {
    try {
        const authorization = req.cookies.token;
        if(!authorization) {
            throw new InvalidTokenError("No authorization header");
        }
        if(typeof authorization !== "string") {
            throw new InvalidTokenError("Invalid token type");
        }
        return authorization;
    }catch(error) {
        console.error("Error in getBearerToken:", error);
        throw new InvalidTokenError("Unauthorized");
    }
}

export const makeRefreshToken = async (userId: number) => {
    const refreshToken = crypto.randomBytes(32).toString("hex");
    await insertRefreshToken(refreshToken, userId);
    return refreshToken;
}


export async function middlewareIsAuthenticated(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const token = getBearerToken(req);
        //validate the token, but how do we know to call refresh?
        const userId = await validateJWT(token, process.env.JWT_SECRET as string);
        if(!userId) {
            throw new UnauthorizedError("Unauthorized");
        }
        //eventually we're going to have to check the path for 
        // the user role and if they are allowed to access the path
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