<script setup lang="ts">
withDefaults(
  defineProps<{ title?: string; message?: string; actionLabel?: string }>(),
  {
    title: 'No phones match your filters',
    message: 'Try widening the price range or removing a filter.',
    actionLabel: 'Clear all filters',
  },
)
defineEmits<{ (e: 'action'): void }>()
</script>

<template>
  <div class="flex flex-col items-center gap-2 rounded-card border border-line bg-white px-5 py-7 text-center">
    <div class="grid h-12 w-12 place-items-center rounded-full bg-brand-tint font-display text-xl font-bold text-brand">?</div>
    <div class="font-display text-[15px] font-semibold">{{ title }}</div>
    <div class="text-[13px] leading-normal text-slate">{{ message }}</div>
    <button
      class="mt-1 h-[42px] rounded-btn bg-brand-tint px-[18px] text-[13px] font-semibold text-brand"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>
