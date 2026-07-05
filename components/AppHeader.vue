<script setup lang="ts">
const { count: favCount } = useFavorites()
const nav = [
  { label: 'Mobiles', to: '/mobiles' },
  { label: 'Compare', to: '/compare' },
  { label: 'Used Mobiles', to: '/used' },
  { label: 'Favorites', to: '/favorites' },
  { label: 'My Listings', to: '/my-listings' },
]
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-line bg-white">
    <div class="mx-auto flex h-[60px] max-w-[1200px] items-center gap-3.5 px-4">
      <NuxtLink to="/" class="flex flex-none items-center gap-2 text-ink no-underline">
        <span class="grid h-[30px] w-[30px] place-items-center rounded-[9px] bg-brand font-display text-[15px] font-extrabold text-white">M</span>
        <span class="font-display text-lg font-bold tracking-tight">Mobilo<span class="text-brand">.pk</span></span>
      </NuxtLink>

      <!-- Desktop nav -->
      <nav class="ml-2 hidden items-center gap-0.5 md:flex">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="rounded-lg px-3 py-3 text-[13.5px] font-semibold text-ink no-underline hover:bg-mist"
          active-class="text-brand"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="flex-1" />

      <NuxtLink to="/login" class="hidden px-2.5 py-3 text-[13.5px] font-semibold text-ink no-underline md:block">Login</NuxtLink>

      <!-- Mobile: favorites (heart) + My Listings live here (Sell is in the bottom tab bar) -->
      <NuxtLink
        to="/favorites"
        class="relative grid h-10 w-10 place-items-center text-[19px] text-ink no-underline md:hidden"
        aria-label="Favorites"
        active-class="text-brand"
      >
        <span aria-hidden="true">♡</span>
        <span
          v-if="favCount"
          class="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold leading-none text-white"
        >
          {{ favCount }}
        </span>
      </NuxtLink>
      <NuxtLink
        to="/my-listings"
        class="px-2.5 py-3 text-[13.5px] font-semibold text-ink no-underline md:hidden"
        active-class="text-brand"
      >
        My Listings
      </NuxtLink>

      <!-- Desktop only: mobile already has "Sell" in the bottom tab bar -->
      <NuxtLink
        to="/sell"
        class="hidden h-[42px] items-center rounded-btn bg-ink px-[18px] text-[13.5px] font-semibold text-white no-underline hover:bg-[#223129] md:inline-flex"
      >
        Sell Mobile
      </NuxtLink>
    </div>
  </header>
</template>
