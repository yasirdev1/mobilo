<script setup lang="ts">
const tabs = [
  { label: 'Home', to: '/', icon: '⌂' },
  { label: 'Mobiles', to: '/mobiles', icon: '▤' },
  { label: 'Compare', to: '/compare', icon: '⇄' },
  { label: 'Used', to: '/used', icon: '♻' },
  { label: 'Sell', to: '/sell', icon: '+' },
]
</script>

<template>
  <nav aria-label="Primary" class="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white pb-[env(safe-area-inset-bottom)]">
    <div class="grid h-16 grid-cols-5">
      <NuxtLink
        v-for="t in tabs"
        :key="t.to"
        :to="t.to"
        class="flex min-h-[44px] flex-col items-center justify-center gap-0.5 text-slate no-underline"
        active-class="text-brand"
        :exact="t.to === '/'"
      >
        <span class="text-[17px] leading-none" aria-hidden="true">{{ t.icon }}</span>
        <span class="text-[10.5px] font-semibold">{{ t.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>
