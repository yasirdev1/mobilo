<script setup lang="ts">
import type { UsedListing } from '~/data/types'
defineProps<{ listing: UsedListing }>()
const { format } = usePrice()
</script>

<template>
  <NuxtLink
    :to="`/used/${listing.id}`"
    class="flex overflow-hidden rounded-card border border-line bg-white text-ink no-underline shadow-resting transition-shadow hover:shadow-raised"
  >
    <div class="grid w-24 flex-none place-items-center bg-mist">
      <img v-if="listing.image" :src="listing.image" :alt="listing.title" class="h-full w-full object-cover" loading="lazy" />
    </div>
    <div class="flex min-w-0 flex-col gap-[7px] px-3.5 py-3">
      <div class="font-display text-sm font-semibold leading-snug">{{ listing.title }}</div>
      <div class="font-display text-base font-bold tabular-nums">{{ format(listing.price) }}</div>
      <div class="flex flex-wrap gap-1">
        <PtaBadge :approved="listing.ptaApproved" />
        <span class="rounded-full bg-mist px-2 py-1 text-[10.5px] font-semibold text-ink">{{ listing.condition }}</span>
      </div>
      <div class="text-xs text-slate">{{ listing.city }} · {{ listing.posted }}</div>
    </div>
  </NuxtLink>
</template>
