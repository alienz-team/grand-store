import "server-only";
import { cache } from "react";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * One Prisma client per request. Cloudflare Workers cannot share I/O
 * (WebSocket connections) across requests, so the client must not be a
 * module-level singleton. React `cache` scopes it to the current request.
 */
export const getDb = cache(() => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
});
