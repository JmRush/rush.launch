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
  MAIN_HOST: z.ipv4(),
  MAX_HOST_PORT: z.int(),
  MIN_HOST_PORT: z.int(),
});

let { MAX_HOST_PORT, MIN_HOST_PORT, ...reEnv } = process.env;

export const env = EnvSchema.parse({
  MAX_HOST_PORT: parseInt(MAX_HOST_PORT),
  MIN_HOST_PORT: parseInt(MIN_HOST_PORT),
  ...reEnv,
});
