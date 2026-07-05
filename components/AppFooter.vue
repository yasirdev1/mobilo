<template>
  <footer class="mt-auto border-t border-line bg-white pb-[100px] md:pb-10">
    <div class="mx-auto grid max-w-[1200px] gap-8 px-4 py-10 md:grid-cols-4">
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <span class="grid h-[26px] w-[26px] place-items-center rounded-lg bg-brand font-display text-[13px] font-extrabold text-white">M</span>
          <span class="font-display text-base font-bold tracking-tight">Mobilo<span class="text-brand">.pk</span></span>
        </div>
        <p class="m-0 max-w-[260px] text-[12.5px] leading-relaxed text-slate">
          Pakistan's smartest way to find, compare, buy and sell mobiles.
        </p>
      </div>
      <div v-for="col in cols" :key="col.title" class="flex flex-col gap-2.5">
        <div class="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{{ col.title }}</div>
        <NuxtLink
          v-for="l in col.links"
          :key="l.label"
          :to="l.to"
          class="text-[13px] font-medium text-slate no-underline hover:text-ink"
        >
          {{ l.label }}
        </NuxtLink>
      </div>
    </div>
    <div class="border-t border-hairline">
      <div class="mx-auto max-w-[1200px] px-4 py-4 text-[11.5px] text-muted">© 2026 Mobilo.pk — All rights reserved</div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const cols = [
  {
    title: 'Explore',
    links: [
      { label: 'All Mobiles', to: '/mobiles' },
      { label: 'Compare Phones', to: '/compare' },
      { label: 'Used Mobiles', to: '/used' },
    ],
  },
  {
    title: 'Sell',
    links: [
      { label: 'Sell Your Mobile', to: '/sell' },
      { label: 'Seller Guidelines', to: '/sell' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Login', to: '/login' },
      { label: 'Create Account', to: '/signup' },
    ],
  },
]
</script>
