# Mobilo — Frontend (CLAUDE.md)

Project context for Claude and developers. This is the **frontend** repo; the
Laravel API lives in a sibling repo (`mobilo-backend`). Read
`DEVELOPER_ONBOARDING.md` first for the full-system setup.

## What this is

Nuxt 3 + Vue 3 (`<script setup>`) + Tailwind. A mobile-phone platform for
Pakistan: specs & reviews, side-by-side comparison, AI recommendations, retailer
price listings, a used-phone marketplace, favorites, buying guides, and a custom
admin section. UI was built first, then wired to the Laravel API.

## Stack & how it talks to the backend

- **Nuxt 3 / Vue 3 / Tailwind.** SSR enabled.
- **`plugins/api.ts`** provides `$api` — a `$fetch` instance with `baseURL =
  runtimeConfig.public.apiBase` that attaches the bearer token from a cookie.
- **`repositories/`** (`phoneRepository`, `usedListingRepository`) are the ONLY
  place that knows about HTTP. Pages/components call repository methods; swapping
  data sources never touches components. They call `$api` and return data shaped
  to match `data/types.ts` (the API returns those shapes unwrapped).
- **`composables/useAuth.ts`** — token auth (Sanctum). Login is by **phone**.
  Exposes `user` (with `roles`/`permissions`), `can(permission)`, `isAdmin`,
  `login/register/logout/fetchUser`. `plugins/auth.client.ts` restores the
  session on load.
- API base URL: `runtimeConfig.public.apiBase` in `nuxt.config.ts`
  (default `http://mobilo-backend.test/api`; override with `NUXT_PUBLIC_API_BASE`).

## Directory map

- `pages/` — file-based routes (home, mobiles list/detail, compare, used
  list/detail, sell, login, signup, favorites, my-listings, and `admin/*`).
- `components/` — auto-imported, dumb/presentational (props in, events out).
- `composables/` — `useAuth`, `useCompare`, `useFavorites`, `usePrice`, `useSeasonalTheme`.
- `repositories/` — API data-access layer (registered for auto-import in `nuxt.config.ts`).
- `layouts/` — `default.vue` (public) and `admin.vue` (admin shell).
- `middleware/admin.ts` — gates `/admin/*` (requires `dashboard.access`).
- `data/types.ts` — domain types shared across the app; keep in sync with API resources.
- `plugins/` — `api.ts` ($api), `auth.client.ts` (session restore).

## Admin

`/admin/*` is a custom Nuxt section (not Filament), gated by `middleware/admin.ts`
+ the backend's spatie permissions. Log in as an admin, then visit `/admin`
(dashboard, phones list/delete, listings moderation). Uses `layout: 'admin'`.

## Running locally

The backend must be running first (see `mobilo-backend`). Then:
```bash
npm install
npm run dev            # http://localhost:3000
```
**Restart `npm run dev` after changing `nuxt.config.ts`** (e.g. `apiBase`) — it's
read at startup.

Seeded admin login: phone `03000000000`, password `password` (change in prod).

## Conventions

- Design tokens live in `tailwind.config.ts` (single source of truth). Use
  `bg-brand` for primary CTAs; `useSeasonalTheme` swaps `--brand*` CSS vars.
- Prices via `usePrice().format(n)` → `Rs. 1,234` (en-PK, no decimals).
- Every phone/listing shows `PtaBadge`; ads always inside `AdSlot`.
- Mobile-first; touch targets ≥ 44px; `BottomTabBar` is the mobile nav.
- Accessibility + SEO passes are done — see `IMPROVEMENTS.md`.

## Gotchas (learned the hard way)

- **Herd + HTTPS + Chrome:** running `herd secure` then `herd unsecure` leaves a
  stale **HSTS** entry in normal Chrome that keeps forcing the dead HTTPS →
  cached 503/cert errors. Fixes: use `http://` (unsecured) and clear HSTS at
  `chrome://net-internals/#hsts` (delete `mobilo-backend.test`) + clear site
  data, or use incognito/Safari. Herd itself was fine throughout.
- The API returns **unwrapped** JSON (no `data` wrapper) for public endpoints;
  admin list endpoints are paginated (`{ data, meta }`).

See also: `DEVELOPER_ONBOARDING.md`, `IMPROVEMENTS.md`.
