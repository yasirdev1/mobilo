<script setup lang="ts">
defineProps<{ label: string; active?: boolean }>()
defineEmits<{ (e: 'toggle'): void }>()
</script>

<template>
  <button
    class="min-h-[36px] rounded-full border px-3 py-2 text-xs font-semibold"
    :class="active ? 'border-brand bg-brand-tint text-brand' : 'border-line bg-white text-ink'"
    @click="$emit('toggle')"
  >
    {{ label }}
  </button>
</template>
