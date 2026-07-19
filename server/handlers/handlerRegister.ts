import { Request, Response } from "express";
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
} from "../types/types_error";
import { makeJWT, makeRefreshToken } from "../auth/auth";
import { getRoleIdFromName } from "../db/queries/roles";
import { transactionCreateUserRole } from "../db/queries/userRoles";

export const handlerRegister = async (req: Request, res: Response) => {
  try {
    //check that requesting user is an admin
    if (!req.body) {
      throw new BadRequestError("Request body is required");
    }

    const { name, email, password } = req.body;
    //verify data is correct/not missing/etc
    if (!req.body.name || !req.body.email || !req.body.password) {
      throw new BadRequestError("Name, email, and password are required");
    }
    if (
      typeof req.body.name !== "string" ||
      typeof req.body.email !== "string" ||
      typeof req.body.password !== "string"
    ) {
      throw new BadRequestError("Name, email, and password must be strings");
    }

    //hash password
    const hashedPassword = await Bun.password.hash(password);
    if (!hashedPassword) {
      throw new InternalServerError("Failed to hash password");
    }

    //create user in db
    const roleId = await getRoleIdFromName("user");
    if (!roleId) {
      throw new InternalServerError("Failed to get role id");
    }

    const user = await transactionCreateUserRole(
      name,
      email,
      hashedPassword,
      roleId.id,
    );
    if (!user) {
      throw new InternalServerError("Failed to create user");
    }

    //create refresh token
    const refreshToken = await makeRefreshToken(user.id);
    const jwt = await makeJWT(user.id, process.env.JWT_SECRET as string);

    //set cookies
    res.cookie("refreshToken", refreshToken, {
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

    //return success
    res.status(200).json({
      success: true,
      id: user.id,
      name: user.name,
      email: user.email,
      roles: ["user"],
    });
  } catch (error) {
    console.error("Error in handlerRegister:", error);
    throw error;
};
