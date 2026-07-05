<script setup lang="ts">
/**
 * New-phone card (Popular Mobiles grid, Latest rail, listing page).
 * Compare checkbox wires into useCompare().
 */
import type { Phone } from '~/data/types'
const props = defineProps<{ phone: Phone }>()
const { format } = usePrice()
const { toggle, isSelected } = useCompare()
const { toggle: toggleFavorite, isFavorite } = useFavorites()
</script>

<template>
  <div
    class="flex cursor-pointer flex-col overflow-hidden rounded-card border border-line bg-white shadow-resting transition-shadow hover:shadow-raised"
  >
    <!-- Link + overlays are siblings (no button nested inside the anchor) -->
    <div class="relative h-[160px] bg-mist">
      <NuxtLink :to="`/mobiles/${phone.slug}`" class="block h-full w-full no-underline">
        <img
          v-if="phone.image"
          :src="phone.image"
          :alt="phone.name"
          class="h-full w-full object-contain"
          loading="lazy"
        />
      </NuxtLink>
      <span
        v-if="phone.badge"
        class="pointer-events-none absolute left-2 top-2 rounded-full bg-winner-tint px-2 py-1 text-[10px] font-semibold text-winner"
      >
        {{ phone.badge }}
      </span>
      <button
        type="button"
        class="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-[15px] shadow-resting backdrop-blur transition-colors hover:bg-white"
        :class="isFavorite(phone.slug) ? 'text-alert' : 'text-slate'"
        :aria-label="isFavorite(phone.slug) ? `Remove ${phone.name} from favorites` : `Add ${phone.name} to favorites`"
        :aria-pressed="isFavorite(phone.slug)"
        @click="toggleFavorite(phone.slug)"
      >
        <span aria-hidden="true">{{ isFavorite(phone.slug) ? '♥' : '♡' }}</span>
      </button>
    </div>
    <div class="flex flex-1 flex-col gap-2 p-3 pb-3.5">
      <div class="flex flex-col gap-0.5">
        <NuxtLink :to="`/mobiles/${phone.slug}`" class="font-display text-[13.5px] font-semibold leading-snug text-ink no-underline">
          {{ phone.name }}
        </NuxtLink>
        <div class="font-display text-[15px] font-bold tabular-nums">{{ format(phone.price) }}</div>
      </div>
      <div class="text-[11.5px] leading-normal text-slate">{{ phone.specsLine }}</div>
      <div class="mt-auto flex items-center justify-between gap-2 pt-0.5">
        <NuxtLink :to="`/mobiles/${phone.slug}`" class="text-xs font-semibold text-brand no-underline">
          View Details &amp; Prices →
        </NuxtLink>
        <button
          class="min-h-[32px] rounded-full px-[11px] py-2 text-[11px] font-semibold"
          :class="isSelected(phone.slug) ? 'bg-brand-tint text-brand' : 'bg-mist text-slate'"
          @click.stop="toggle(phone.slug)"
        >
          {{ isSelected(phone.slug) ? '✓ Compare' : '+ Compare' }}
        </button>
      </div>
    </div>
  </div>
</template>
