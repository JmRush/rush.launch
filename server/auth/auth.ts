import * as jose from "jose";
import { UnauthorizedError } from "../types/types_error";
import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import { insertRefreshToken } from "../db/queries/auth";
import { userTokens } from "../db/schema";
import { db } from "../db";


export async function makeJWT(userId: number, secret: string) {
    const token = await new jose.SignJWT({ userId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime('30m')
        .sign(new TextEncoder().encode(secret));
    return token;
}

export async function validateJWT(token: string, secret: string) {
    const { payload, protectedHeader } = await jose.jwtVerify(token, new TextEncoder().encode(secret));
    if(!payload.exp || payload.exp < Date.now() / 1000) {
        throw new UnauthorizedError("Token expired");
    }
    return payload.userId;
}

export function getBearerToken(req: Request): string {
    const authorization = req.headers.authorization;
    if(!authorization || !authorization.startsWith("Bearer ")) {
        throw new UnauthorizedError("No authorization header");
    }
    const [type, token] = authorization.split(" ");
    if(type !== "Bearer") {
        throw new UnauthorizedError("Invalid token type");
    }
    return token;
}

export const makeRefreshToken = async (userId: number) => {
    const refreshToken = crypto.randomBytes(32).toString("hex");
    await insertRefreshToken(refreshToken, userId);
    return refreshToken;
}


export async function middlewareIsAuthenticated(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const token = getBearerToken(req);
        const userId = await validateJWT(token, process.env.JWT_SECRET as string);
        if(!userId) {
            throw new UnauthorizedError("Unauthorized");
        }
        //check if the jwt is expired or if it is not valid via refresh token


    }catch(error) {
        console.error("Error in middlewareIsAuthenticated:", error);
        if(error instanceof UnauthorizedError) {
            res.status(401).json({ success: false, error: error.message });
        }else {
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }
    next();
}