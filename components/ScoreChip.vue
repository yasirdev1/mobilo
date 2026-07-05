<script setup lang="ts">
/** P/C/B/V score chip. Green ≥8, amber ≥7, orange below. */
const props = defineProps<{ label: string; value: number }>()
const color = computed(() => (props.value >= 8 ? '#0a7a45' : props.value >= 7 ? '#9a6b1f' : '#b45309'))
</script>

<template>
  <div class="inline-flex items-center gap-2 rounded-btn border border-line bg-white px-3 py-2">
    <span class="font-display text-[15px] font-bold tabular-nums" :style="{ color }">{{ value.toFixed(1) }}</span>
    <span class="text-xs font-medium text-slate">{{ label }}</span>
  </div>
</template>
