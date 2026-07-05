# Mobilo.pk — Nuxt 3 Developer Handoff

Static handoff package for the Mobilo.pk phone comparison + marketplace platform.
Derived 1:1 from the approved HTML design mockups (see project root `*.dc.html` files).

**Stack:** Nuxt 3 · Vue 3 (Composition API, `<script setup>`) · Tailwind CSS

## Getting started

```bash
npx nuxi init mobilo && cd mobilo
npm i -D @nuxtjs/tailwindcss
# then copy the contents of this folder over the scaffold
npm run dev
```

`nuxt.config.ts`, `tailwind.config.ts`, `assets/css/main.css`, `app.vue`, `layouts/`, `components/`, `composables/`, `config/`, `data/`, and `pages/` are all included here.

## Folder structure

```
nuxt-handoff/
├─ nuxt.config.ts          # modules, fonts, app meta
├─ tailwind.config.ts      # ALL design tokens (colors, fonts, radii, shadows)
├─ app.vue                 # NuxtLayout + NuxtPage
├─ assets/css/main.css     # font imports, CSS theme variables, base resets
├─ layouts/default.vue     # SeasonalBanner + AppHeader + page + AppFooter + BottomTabBar
├─ components/             # auto-imported by Nuxt (no manual imports needed)
├─ composables/            # useSeasonalTheme, useCompare, usePrice
├─ config/seasonal-themes.ts  # OWNER-EDITABLE seasonal theme config
├─ data/                   # dummy JSON — replace with API calls
└─ pages/                  # file-based routing (see routing map)
```

## Routing map (mockup → route)

| Design mockup                | Route                  | Page file                  |
|------------------------------|------------------------|----------------------------|
| Home.dc.html                 | `/`                    | `pages/index.vue`          |
| Mobiles Listing.dc.html      | `/mobiles`             | `pages/mobiles/index.vue`  |
| Mobile Detail.dc.html        | `/mobiles/:slug`       | `pages/mobiles/[slug].vue` |
| Compare.dc.html              | `/compare`             | `pages/compare.vue`        |
| Used Mobiles.dc.html         | `/used`                | `pages/used/index.vue`     |
| Used Mobile Detail.dc.html   | `/used/:id`            | `pages/used/[id].vue`      |
| Sell Sheet.dc.html           | `/sell?preset=…`       | `pages/sell.vue`           |
| Login.dc.html                | `/login`               | `pages/login.vue`          |
| Signup.dc.html               | `/signup`              | `pages/signup.vue`         |

Compare deep-link: `/compare?phones=galaxy-a55,poco-x6-pro` (comma-separated slugs).
Sell preset: `/sell?preset=Samsung%20Galaxy%20A55` preselects the phone.

## Design tokens (single source of truth: `tailwind.config.ts`)

- **Fonts:** Sora (headings, `font-display`) · Instrument Sans (body, `font-sans`)
- **Colors:** ink `#14201b`, slate `#5b6b64`, canvas `#f6f8f7`, mist `#eef1ef`,
  line `#e3e8e5`, muted `#8a968f`, emerald `#0b8a5c` (+tint `#e7f5ee`, dark `#087a51`),
  winner `#0a7a45` (+tint `#e8f7ed`), sponsor amber `#9a6b1f` (+tint `#fdf3e2`),
  alert `#b42318` (+tint `#fdecea`), whatsapp `#1da851`, deep `#0e2b1f`
- **Brand-var colors:** `brand`, `brand-tint`, `brand-dark` resolve to CSS variables —
  these are what the seasonal theming system swaps. Use `bg-brand` for primary CTAs;
  use literal `emerald` only where color must NOT change with the season (e.g. PTA badges use `winner`).
- **Radii:** `rounded-input` 8px · `rounded-btn` 10px · `rounded-card` 16px · `rounded-full` pills
- **Shadows:** `shadow-resting` · `shadow-raised`
- **Spacing:** default Tailwind 4px scale

## Conventions (must-keep)

1. **Mobile-first.** Touch targets ≥ 44px. Mobile nav = `BottomTabBar` (never a hamburger-only nav).
2. **Prices:** `usePrice().format(144999)` → `Rs. 144,999` (en-PK, no decimals).
3. **Ads:** always inside `AdSlot` — fixed-height reserved container + "Advertisement" label. No CLS.
4. **Sponsored content:** amber label pill, `SponsoredCard`. Never styled like organic results.
5. **PTA status:** `PtaBadge` everywhere a phone/listing appears.
6. **Compare:** checkbox on cards → `useCompare` store → floating `CompareBar` → `/compare`.

## Seasonal theming

See `config/seasonal-themes.ts` (owner edits this file only) and
`composables/useSeasonalTheme.ts` (auto-activates a theme when today falls in its
`start`/`end` window; otherwise default brand). The composable:

1. Picks the active theme by date (`MM-DD`, year-agnostic, supports windows crossing new year).
2. Writes `--brand`, `--brand-tint`, `--brand-dark` CSS variables to `<html>`.
3. Exposes `banner` (text + colors) that `SeasonalBanner` renders above the header.

To add a theme, append an object to the array — no other code changes.
`useSeasonalTheme({ preview: 'independence' })` forces a theme for QA.

## Architecture (Laravel backend)

Kept deliberately light for a frontend consuming a Laravel API:

- **components/** — dumb, reusable, auto-imported. Props in, events out. No data fetching.
- **composables/** — shared client state & helpers (`useCompare`, `usePrice`, `useSeasonalTheme`).
- **repositories/** — ONE thin data-access layer. Currently JSON-backed; each method maps
  1:1 to a Laravel endpoint (`/api/phones`, `/api/phones/{slug}`, `/api/listings`, …).
  When the API is ready, swap the implementation inside the repository file only —
  pages and components don't change. (This is the frontend twin of your Laravel
  controllers/resources, not a full service-repository stack.)
- **pages/** — thin route views: fetch via repository (`useAsyncData`), compose components.

Suggested Laravel endpoints: `GET /api/phones`, `GET /api/phones/{slug}`,
`GET /api/phones/{slug}/prices`, `GET /api/brands`, `GET /api/listings`,
`GET /api/listings/{id}`, `POST /api/listings`, `POST /api/auth/login|register` (Sanctum).

## Dummy data

`data/*.json` mirrors the shapes the UI expects (typed in `data/types.ts`).
Keep the same field names in the Laravel API resources.
