# Mobilo.pk — Hardening pass (handoff review)

A review + fix pass over the UI-only handoff to get the base architecture
production-ready before feature work begins. The original architecture
(repository seam, seasonal theming, design tokens, component decomposition)
was kept as-is — it's sound. The changes below fix correctness bugs and fill
the gaps a technical due-diligence review would flag.

## Tier 1 — Correctness bugs

- **Compare persistence** (`composables/useCompare.ts`): localStorage was read
  in the `useState` initializer, which never runs on the client (it hydrates
  from the empty SSR payload). Selections were lost on reload. Now hydrated in
  `onMounted` behind a shared `hydrated` guard, clamped to `MAX`, tolerant of
  corrupt storage.
- **CompareBar names** (`components/CompareBar.vue`): chips showed raw slugs
  (`galaxy-a55`). Now resolves slug → phone name via the repository, with a
  slug fallback; `aria-label` uses the name too.
- **Sell validation** (`pages/sell.vue`): the `*`-marked Condition field wasn't
  enforced and price accepted non-positive values. Added a `validate()` step
  with inline errors; price gets `min`, `step`, `inputmode`.

## Tier 2 — App essentials

- **`error.vue`**: custom 404/500 boundary wrapped in the default layout.
- **Loading states**: wired the (previously unused) `SkeletonCard` into the
  home, mobiles and used pages via `useAsyncData`'s `pending`.
- **Fetch errors**: retry-able error states on list pages; detail pages now
  distinguish 500 (fetch failure) from 404 (not found).
- **Form states**: login / signup / sell now have loading + error + disabled
  states, structured for the real API (`$fetch` calls stubbed with TODOs).

## Tier 3 — Navigation & UX

- **`components/BackLink.vue`**: reusable back control (real history →
  fallback route) added to sell, login, signup. Sell also gets a Cancel button
  and a "List another phone" reset on success.
- **Reactive filters** (`pages/mobiles/index.vue`): brand / q / budget now
  react to query-string changes (the page is reused across in-app navigations,
  so setup doesn't re-run).
- **HeroSearch AI mode**: budget select + priority chips now flow into the
  `/mobiles` query (`?ai=1&budget=…&priorities=…`) and the budget applies as a
  price filter. Suggestion lookup is debounced.

## Tier 4 — Accessibility

- Global `:focus-visible` outline for keyboard users + `prefers-reduced-motion`
  support (`assets/css/main.css`).
- `muted` token darkened `#8a968f → #6a7770` to meet WCAG AA (4.5:1).
- All form labels associated to inputs (`for`/`id`) with `autocomplete`;
  Condition chips wrapped in a labelled `role="group"`.
- Decorative emoji `aria-hidden`; missing `aria-label`s added (bottom nav,
  compare remove buttons, search inputs).

## Tier 5 — SEO

- Site-wide head defaults: `lang`, robots, theme-color, Open Graph + Twitter
  (`nuxt.config.ts`).
- Global self-referencing canonical (`layouts/default.vue`), which also adds
  bottom padding so the fixed mobile tab bar never covers the footer.
- Per-page `useSeoMeta` (title + description + OG) on every page.
- **JSON-LD `Product`/`AggregateOffer`** on phone detail pages — the key win
  for price-comparison search results.
- `public/robots.txt` (sitemap line ready to uncomment on go-live).

## Feature additions (post-review)

- **My Listings** (`pages/my-listings.vue`): view / edit (dialog) / mark-sold /
  create. Repository gained `mine()`, `update()`, `markSold()` + a `status`
  field on `UsedListing`. Header "Sell Mobile" is now desktop-only (mobile uses
  the bottom tab); "My Listings" added to nav.
- **Favorites / wishlist** (`composables/useFavorites.ts`, `pages/favorites.vue`):
  heart toggle on `MobileCard`, localStorage-backed, header count badge.
- **Sorting + Load-more** on `/mobiles` and `/used`: client-side sort (price /
  newest / rating) and paged "Load more" (real API should page server-side).
- **Detail pages**: "You might also like" related rail (lazy + skeleton),
  `ShareButton` (Web Share API → clipboard fallback), similar-listings rail on
  used detail.
- **Polish/SEO**: `NuxtLoadingIndicator` route bar; `BreadcrumbList` JSON-LD on
  both detail page types.

## Follow-ups (not done)

- **Sitemap**: install `@nuxtjs/sitemap` (module install left to you).
- **Forgot-password** flow: needs a page + endpoint.
- **AI recommendations**: `?ai=1` currently maps to a filtered list; wire to the
  real AI endpoint when ready.
- Runtime smoke test: I couldn't boot the dev server here (Linux sandbox vs
  macOS `node_modules` native bindings). Please run `npm run dev` to confirm.
