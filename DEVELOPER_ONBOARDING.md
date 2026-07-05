# Mobilo — Developer Onboarding

Welcome. Mobilo is a mobile-phone platform for Pakistan (specs, reviews,
comparisons, AI recommendations, retailer prices, used marketplace, buying
guides, admin). It's split into **two repositories**:

| Repo | What | Stack | GitHub |
|---|---|---|---|
| `mobilo` | Frontend (this app when you're in it) | Nuxt 3 / Vue 3 / Tailwind | `yasirdev1/mobilo` |
| `mobilo-backend` | JSON API | Laravel 13 / PostgreSQL + pgvector | `yasirdev1/mobilo-backend` |

The frontend consumes the backend over HTTP. Auth is Sanctum **bearer tokens**;
**login is by phone number**, not email.

## Prerequisites

- **Laravel Herd** (bundles PHP 8.4 + nginx) or PHP 8.3+.
- **PostgreSQL** with the **pgvector** extension (Postgres.app bundles it; on
  Homebrew: `brew install pgvector`).
- **Node 20+** and **Composer**.

## Setup — backend first

```bash
# in mobilo-backend
composer install
# create a Postgres database named `mobilo`, then in .env set:
#   DB_CONNECTION=pgsql  DB_DATABASE=mobilo  DB_USERNAME=postgres  DB_PASSWORD=
php artisan key:generate
php artisan migrate
php artisan db:seed        # loads dummy data + roles + a super-admin
php artisan serve          # http://127.0.0.1:8000   (or serve via Herd)
```
If pgvector isn't installed yet, comment out the `*_add_ai_embeddings` migration,
migrate the rest, add it later.

## Setup — frontend

```bash
# in mobilo
npm install
# nuxt.config.ts → runtimeConfig.public.apiBase must match how you serve the API
#   php artisan serve  → http://127.0.0.1:8000/api
#   Herd              → http://mobilo-backend.test/api
npm run dev                # http://localhost:3000
```
Restart `npm run dev` after editing `nuxt.config.ts`.

## Log in / see the admin

- Frontend `/login` → phone **`03000000000`**, password **`password`**.
- Then visit **`/admin`** (dashboard, phones, listings moderation). Admin access
  requires the `dashboard.access` permission (the seeded super-admin has all).

## Where the docs are

- **Backend:** `CLAUDE.md` (overview), `DATABASE_CONTEXT.md` (full schema +
  every column's purpose), `API_REFERENCE.md` (endpoints + setup).
- **Frontend:** `CLAUDE.md` (overview + architecture), `IMPROVEMENTS.md`
  (the hardening/feature history).
- Each repo's `CLAUDE.md` is auto-loaded by Claude, so a new dev can ask Claude
  to work in either repo with full context.

## Serving with Herd (optional) & a known gotcha

Park top-level folders so each becomes `<name>.test` (e.g. `mobilo-backend.test`).
Keep it on **plain HTTP** for local dev.

- **Do not `herd secure` casually:** it sets HSTS, and Chrome then force-upgrades
  the domain to HTTPS forever. After `herd unsecure`, normal Chrome still fails
  (cached HSTS → 503/cert error) while incognito/Safari work. Fix: clear it at
  `chrome://net-internals/#hsts` (delete the domain) + clear site data.
- If **every** `.test` site returns 503 but `php -v` is clean, it's Herd's
  PHP-FPM daemon — fully quit and relaunch the Herd app (a `herd restart` may not
  be enough). `php artisan serve` sidesteps Herd entirely.
- After **moving** the backend folder, run
  `rm -f bootstrap/cache/*.php && composer dump-autoload && php artisan optimize:clear`.

## Conventions

- Money is integer PKR (`price_pkr`); format on the frontend via `usePrice()`.
- Design tokens live in the frontend `tailwind.config.ts`.
- API responses are unwrapped (no `data` key) for public endpoints; admin lists
  are paginated.
- Frontend `data/types.ts` mirrors the backend API resources — keep them in sync.
