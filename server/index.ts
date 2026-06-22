import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { middlewareErrors } from "./middleware/middleware_errors";
import { handlerLogin } from "./handlers/handlerLogin";
import { middlewareIsAuthenticated } from "./middleware/middleware_isAuthenticated";
import { handlerAddServerType } from "./handlers/handlerAddServerType";
import { handlerGetServerTypes } from "./handlers/handlerGetServerTypes";
import { handlerRefresh } from "./handlers/handlerRefresh";
import { handlerLogout } from "./handlers/handlerLogout";
import { handlerWhoAmI } from "./handlers/handlerWhoAmI";
import { handlerRegister } from "./handlers/handlerRegister";
const cookieParser = require("cookie-parser");
const app = express();
const port = parseInt(process.env.API_PORT ?? "3001");

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      status: "ok",
      runtime: "bun",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Health check error:", err);
    res.status(501).json({ success: false, error: "Health check error" });
    next(err);
  }
});

app.post(
  "/api/admin/add-server-type",
  middlewareIsAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handlerAddServerType(req, res);
    } catch (error) {
      console.error("Add server type error:", error);
      next(error);
    }
  },
);

app.get(
  "/api/get-server-types",
  middlewareIsAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handlerGetServerTypes(req, res);
    } catch (error) {
      console.error("Get server types error:", error);
      next(error);
    }
  },
);

//AUTH ROUTES
app.post(
  "/api/auth/refresh",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handlerRefresh(req, res);
    } catch (error) {
      console.error("Refresh token error:", error);
      next(error);
    }
  },
);

app.post(
  "/api/auth/refresh/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handlerLogout(req, res);
    } catch (error) {
      console.error("Logout error:", error);
      next(error);
    }
  },
);

app.post(
  "/api/auth/admin/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handlerLogin(req, res);
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(501).json({ success: false, error: "Admin login error" });
      next(error);
    }
  },
);

app.post(
  "/api/auth/admin/register",
  middlewareIsAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handlerRegister(req, res);
    } catch (error) {
      console.error("Admin register error:", error);
      next(error);
    }
  },
);

app.post(
  "/api/auth/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handlerLogin(req, res);
    } catch (error) {
      console.error("User login error:", error);
      next(error);
    }
  },
);

app.get(
  "/api/auth/whoami",
  middlewareIsAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handlerWhoAmI(req, res);
    } catch (error) {
      console.error("Whoami error:", error);
      next(error);
    }
  },
);

//Catch all middleware
app.use(middlewareErrors);

//check if jwt secret is set
if (!process.env.JWT_SECRET) {
  console.error("JWT secret is not set");
  process.exit(1);
}

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
