import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { middlewareErrors } from "./middleware/middleware_errors";
import { handlerLogin } from "./handlers/handlerLogin";
import { middlewareIsAuthenticated } from "./auth/auth";
const app = express();
const port = parseInt(process.env.API_PORT ?? "3001");

app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:3000", credentials: true }));
app.use(express.json());

app.get("/health", (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ status: "ok", runtime: "bun", timestamp: new Date().toISOString() });
  } catch(err) {
    console.error("Health check error:", err);
    res.status(500).json({ success: false, error: "Health check error" });
    next(err);
  }
});

app.post("/api/admin/login", async (req: Request, res: Response, next: NextFunction)=> {
  try {
    await handlerLogin(req, res);
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ success: false, error: "Admin login error" });
    next(error);
  }
});

app.post("/api/login", async (req: Request, res: Response, next: NextFunction)=> {
  try {
    await handlerLogin(req, res);
  } catch (error) {
    console.error("User login error:", error);
    next(error);
  }
});

app.post("/api/refresh", async (req: Request, res: Response, next: NextFunction)=> {

})

app.use(middlewareIsAuthenticated);
app.use(middlewareErrors);

//app.get("/users", (_req: Request, res: Response, next: NextFunction) => {
  //try {
    //const allUsers = db.select().from(users).all();
    //res.json({ success: true, count: allUsers.length, users: allUsers });
  //} catch (error) {
    //console.error("DB error:", error);
    //res.status(500).json({ success: false, error: "Database error. Run: bun run db:migrate" });
    //next(error);
  //}
//});

//app.post("/db", (_req: Request, res: Response, next: NextFunction) => {
  //try {
    //const [user] = db
      //.insert(users)
      //.values({ name: "Test User", email: `test-${Date.now()}@example.com` })
      //.returning()
      //.all();
    //res.json({ success: true, user });
  //} catch (error) {
    //console.error("DB error:", error);
    //res.status(500).json({ success: false, error: "Database error. Run: bun run db:migrate" });
    //next(error);
  //}
//});


//check if jwt secret is set
if(!process.env.JWT_SECRET) {
  console.error("JWT secret is not set");
  process.exit(1);
}

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});

