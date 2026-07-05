<script setup lang="ts">
defineProps<{ title: string; viewAllTo?: string; viewAllLabel?: string }>()
</script>

<template>
  <div class="mb-4 flex items-baseline justify-between gap-3">
    <h2 class="m-0 font-display text-[clamp(19px,3vw,24px)] font-bold tracking-tight">{{ title }}</h2>
    <NuxtLink
      v-if="viewAllTo"
      :to="viewAllTo"
      class="flex-none text-[13px] font-semibold text-brand no-underline"
    >
      {{ viewAllLabel ?? 'View all →' }}
    </NuxtLink>
  </div>
</template>
