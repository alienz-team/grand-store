# Grand Store

متجر Grand Store — طرابلس، ليبيا. Arabic (RTL) storefront with cart, cash-on-delivery checkout, WhatsApp confirmation and an admin dashboard.

**Stack:** Next.js 16 (App Router) · Tailwind CSS 4 · Prisma 7 + `@prisma/adapter-neon` · Neon (Lakebase Postgres) · Cloudflare Workers via `@opennextjs/cloudflare`.

## Local development

```bash
npm install                 # also runs `prisma generate`
neon env pull               # writes DATABASE_URL / DATABASE_URL_UNPOOLED to .env.local
npm run db:push             # sync prisma/schema.prisma to Neon (direct connection)
npm run db:seed             # 4 categories + 8 products
npm run dev                 # http://localhost:3000
```

Add `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` (32+ chars) to `.env.local`. The admin panel lives at `/admin`.

## Deploy to Cloudflare Workers

```bash
npx wrangler secret put DATABASE_URL
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put ADMIN_SESSION_SECRET
npm run deploy              # opennextjs-cloudflare build && deploy
```

`npm run preview` builds and runs the Worker locally in workerd (reads `.dev.vars`).

## How it fits together

- `src/lib/db.ts` — one Prisma client **per request** (Workers can't share sockets between requests), connected through Neon's serverless driver over WebSockets using the pooled `DATABASE_URL`.
- `prisma.config.ts` — schema commands use the direct `DATABASE_URL_UNPOOLED`.
- `src/app/actions.ts` — checkout: validates input, re-prices items from the database, decrements stock in a transaction, saves the order and redirects to `/order/[id]` with a pre-filled WhatsApp message.
- `src/lib/auth.ts` — admin session: HMAC-SHA256-signed, httpOnly cookie (Web Crypto, 12 h). Every admin page and server action calls `requireAdmin()`.
- Products have `price` (original) and optional `salePrice`. A product with a future `dealEndsAt` appears as «عرض الأسبوع» with a live countdown.
