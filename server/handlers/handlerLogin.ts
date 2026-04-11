import { Request, Response } from "express";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../types/types_error";
import { getUserAndRoles } from "../db/queries/roles";
import { User, Role } from "../db/schema";
import { makeJWT, makeRefreshToken } from "../auth/auth";

export const handlerLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if(!email || !password) {
    res.send(400).json({ success: false, error: "Bad Request" });
    throw new BadRequestError("Email and password are required");
  }
  //check endpoint is /api/admin/login or /api/login
  if(req.path !== "/api/admin/login" && req.path !== "/api/login") {
    throw new BadRequestError("Invalid endpoint");
  }

  //get user and their role from the database
  const userAndRoles: {id: number, email: string, password: string, role: string}[] = await getUserAndRoles(email);
  if(!userAndRoles || userAndRoles.length === 0) {
    throw new UnauthorizedError("Invalid email or password");
  }

  //check if hashed password is correct
  const isMatch = await Bun.password.verify(password, userAndRoles[0].password);
  //check if user is admin
  if(userAndRoles[0].role !== "admin" && req.path === "/api/admin/login") {
    throw new UnauthorizedError("Invalid email or password");
  }
  if(userAndRoles[0].role === "user" && req.path !== "/api/login") {
    throw new UnauthorizedError("Invalid email or password");
  }
  if(!isMatch) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const jwt = await makeJWT(userAndRoles[0].id, process.env.JWT_SECRET as string);
  const refreshToken = await makeRefreshToken(userAndRoles[0].id);
  res.cookie("refreshToken", refreshToken, {sameSite: "strict", httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 30 });
  res.status(200).json({id: userAndRoles[0].id, email: userAndRoles[0].email, token: jwt, roles: userAndRoles[0].role});
}
