<script setup lang="ts">
/**
 * Reusable "← Back" control for dead-end pages (forms, detail views).
 * Uses real browser history when available; otherwise falls back to a
 * sensible in-app route so a directly-landed user is never stranded.
 */
const props = withDefaults(defineProps<{ label?: string; fallback?: string }>(), {
  label: 'Back',
  fallback: '/',
})
const router = useRouter()

function goBack() {
  if (import.meta.client && window.history.length > 1) router.back()
  else router.push(props.fallback)
}
</script>

<template>
  <button
    type="button"
    class="inline-flex h-9 items-center gap-1.5 rounded-btn px-1 text-[13px] font-semibold text-slate hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    @click="goBack"
  >
    <span aria-hidden="true" class="text-[15px] leading-none">←</span>{{ label }}
  </button>
</template>
