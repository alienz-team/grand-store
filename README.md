# Grand Store

متجر Grand Store — طرابلس، ليبيا. Bilingual (Arabic RTL / English LTR) storefront with cart, cash-on-delivery checkout, WhatsApp confirmation, light/dark themes, an installable PWA and an admin dashboard.

**Stack:** Next.js 16 (App Router) · Tailwind CSS 4 · Prisma 7 + `@prisma/adapter-neon` · Neon (Lakebase Postgres) · Cloudflare Workers via `@opennextjs/cloudflare`.

## Local development

```bash
npm install                 # also runs `prisma generate`
neon env pull               # writes DATABASE_URL / DATABASE_URL_UNPOOLED to .env.local
npm run db:push             # sync prisma/schema.prisma to Neon (direct connection)
npm run db:seed             # 4 categories + 18 products
npm run dev                 # http://localhost:3000
```

Add `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` (32+ chars) to `.env.local` (and `.dev.vars` for `npm run preview`). The admin panel lives at `/admin`; sign in at `/admin/login` with that email and password.

## Deploy to Cloudflare Workers

```bash
npx wrangler secret put DATABASE_URL
npx wrangler secret put ADMIN_EMAIL
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put ADMIN_SESSION_SECRET
npm run deploy              # opennextjs-cloudflare build && deploy
```

`npm run preview` builds and runs the Worker locally in workerd (reads `.dev.vars`).

### GitHub builds (Workers Builds CI)

`.env` / `.env.local` are gitignored, so Cloudflare's build container never sees them. `wrangler secret put` only sets **runtime** secrets on the deployed Worker; the build step needs its own copy. In the Cloudflare dashboard go to **Workers & Pages → grand-store → Settings → Variables and secrets** (build variables section) and add `DATABASE_URL` as a secret (optionally also `DATABASE_URL_UNPOOLED`).

`prisma generate` (run by `postinstall` during `npm ci`) does not connect to the database, so `prisma.config.ts` falls back to a placeholder URL for that command only. Every other Prisma command (`db push`, `migrate`, `db seed`) throws a clear error if the URL is missing, and `src/lib/db.ts` throws `DATABASE_URL is not set` on the first query at runtime.

### Custom domain

In the Cloudflare dashboard: **Workers & Pages → grand-store → Settings → Domains & Routes → Add → Custom domain**, and enter a hostname on a zone in the same account (e.g. `shop.example.com`). Cloudflare creates the DNS record and certificate. Nothing in the code depends on the hostname, and the session cookie is host-only, so no config change is needed.

## How it fits together

- `src/lib/db.ts` — one Prisma client **per request** (Workers can't share sockets between requests), connected through Neon's serverless driver over WebSockets using the pooled `DATABASE_URL`.
- `prisma.config.ts` — schema commands use the direct `DATABASE_URL_UNPOOLED` (falling back to `DATABASE_URL`); `prisma generate` works with neither set.
- `src/app/actions.ts` — checkout: validates input, re-prices items from the database, decrements stock in a transaction, saves the order and redirects to `/order/[id]` with a pre-filled WhatsApp message.
- `src/lib/auth.ts` — admin sign-in checks `ADMIN_EMAIL` (case-insensitive) and `ADMIN_PASSWORD` in constant time; the session is an HMAC-SHA256-signed, httpOnly, `SameSite=Lax`, `Secure` (in production) cookie that lasts 12 h. Every admin page and server action calls `requireAdmin()`.
- `src/lib/i18n.ts` — UI copy is written inline as `L("عربي", "English")`. The language lives in the `gs_lang` cookie, so the server renders `<html lang dir>` correctly on the first byte; the toggle sets the cookie and refreshes.
- Theme — `src/lib/theme.ts` runs before paint (saved choice, else OS setting) and sets `data-theme`; `globals.css` swaps the colour tokens for light mode.
- PWA — `src/app/manifest.ts`, icons in `public/icons`, and `public/sw.js` (offline page only; nothing else is cached). The install button uses `beforeinstallprompt` where available and shows Add to Home Screen steps on iOS/other browsers.
- Products have `price` (original) and optional `salePrice`. A product with a future `dealEndsAt` appears as «عرض الأسبوع» with a live countdown.
