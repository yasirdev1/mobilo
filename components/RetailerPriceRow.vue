<script setup lang="ts">
import type { RetailerPrice } from '~/data/types'
defineProps<{ offer: RetailerPrice }>()
const { format } = usePrice()
</script>

<template>
  <a
    :href="offer.url"
    target="_blank"
    rel="noopener sponsored"
    class="flex items-center gap-3 rounded-card border border-line bg-white p-4 text-ink no-underline transition-shadow hover:shadow-raised"
  >
    <div class="grid h-10 w-10 flex-none place-items-center rounded-btn bg-mist font-display text-[13px] font-bold text-slate">
      {{ offer.retailer.charAt(0) }}
    </div>
    <div class="min-w-0 flex-1">
      <div class="text-[13.5px] font-semibold leading-tight">{{ offer.retailer }}</div>
      <div class="text-[11.5px]" :class="offer.inStock ? 'text-winner' : 'text-muted'">
        {{ offer.inStock ? 'In stock' : 'Out of stock' }}<span v-if="offer.lowest"> · Lowest price</span>
      </div>
    </div>
    <div class="text-right">
      <div class="font-display text-[15px] font-bold tabular-nums">{{ format(offer.price) }}</div>
      <div class="mt-1 text-xs font-semibold text-brand">Visit →</div>
    </div>
  </a>
</template>
