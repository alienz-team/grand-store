import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: ".env.local", quiet: true });
config({ quiet: true });

// Direct (non-pooled) connection for schema changes, per Neon guidance.
const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

// `prisma generate` only emits the client and never connects, so it must not
// require a real URL. Cloudflare's CI runs it via `postinstall` before build
// vars are guaranteed, and .env files are gitignored. Every other command
// (db push, migrate, seed, studio) needs a real database and fails loudly.
const isGenerate = process.argv.includes("generate");
if (!url && !isGenerate) {
  throw new Error(
    "DATABASE_URL_UNPOOLED (or DATABASE_URL) is not set. Run `neon env pull` or add it to .env.local.",
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: url ?? "postgresql://placeholder:placeholder@localhost:5432/placeholder",
  },
});
