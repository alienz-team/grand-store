import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

config({ path: ".env.local" });
config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  // Direct (non-pooled) connection for schema changes, per Neon guidance.
  datasource: { url: env("DATABASE_URL_UNPOOLED") },
});
