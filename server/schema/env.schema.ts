import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  API_PORT: z.coerce.string(),
  CORS_ORIGIN: z.url(),
  DOCKERHUB_PAT: z.string(),
  DOCKERHUB_USERNAME: z.string(),
  SOCKET_PATH: z.string(),
  NODE_ENV: z.enum(["development", "production", "test"]),
});

export const env = EnvSchema.parse(process.env);
