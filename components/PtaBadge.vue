<script setup lang="ts">
defineProps<{ approved: boolean }>()
</script>

<template>
  <span
    class="rounded-full px-2 py-1 text-[10.5px] font-semibold"
    :class="approved ? 'bg-winner-tint text-winner' : 'bg-alert-tint text-alert'"
  >
    {{ approved ? 'PTA Approved' : 'Non-PTA' }}
  </span>
</template>
