import { Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../types/types_error";
import { getUserAndRoles } from "../db/queries/roles";
import { makeJWT, makeRefreshToken } from "../auth/auth";
import { userRoles } from "../types/types_roles";

export const handlerLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if(!email || !password) {
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
 if(!isMatch) {
    throw new UnauthorizedError("Invalid email or password");
  }

  //check if user is admin or user and the path they are on is correct for their role
  if(userAndRoles[0].role !== userRoles.ADMIN && req.path === "/api/admin/login") {
    throw new UnauthorizedError("Invalid email or password");
  }
  if(userAndRoles[0].role === userRoles.USER && req.path !== "/api/login") {
    throw new UnauthorizedError("Invalid email or password");
  }

  //make jwt and refresh token
  const jwt = await makeJWT(userAndRoles[0].id, process.env.JWT_SECRET as string);
  const refreshToken = await makeRefreshToken(userAndRoles[0].id);
  res.cookie("refreshToken", refreshToken, {sameSite: "strict", httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 30 });
  res.status(200).json({id: userAndRoles[0].id, email: userAndRoles[0].email, token: jwt, roles: userAndRoles[0].role});
}
