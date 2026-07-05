<script setup lang="ts">
import type { SeasonalTheme } from '~/config/seasonal-themes'
defineProps<{ banner: NonNullable<SeasonalTheme['banner']> }>()
</script>

<template>
  <component
    :is="banner.href ? 'a' : 'div'"
    :href="banner.href"
    class="block px-4 py-2.5 text-center text-[12.5px] font-semibold no-underline"
    :style="{ background: banner.bg, color: banner.fg }"
  >
    {{ banner.text }}
  </component>
</template>
