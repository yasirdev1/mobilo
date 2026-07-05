<script setup lang="ts">
/**
 * Share control — uses the native Web Share API on supported (mostly mobile)
 * browsers, and falls back to copying the URL to the clipboard elsewhere.
 */
const props = withDefaults(defineProps<{ title?: string; text?: string; label?: string }>(), {
  label: 'Share',
})

const copied = ref(false)

async function share() {
  if (!import.meta.client) return
  const url = window.location.href
  const data = { title: props.title || document.title, text: props.text || '', url }
  try {
    if (navigator.share) {
      await navigator.share(data)
      return
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url)
      copied.value = true
      setTimeout(() => (copied.value = false), 1800)
    }
  } catch {
    /* user dismissed the share sheet — no-op */
  }
}
</script>

<template>
  <button
    type="button"
    class="inline-flex h-[52px] items-center justify-center gap-2 rounded-xl border border-line bg-white text-[15px] font-semibold text-ink hover:bg-mist"
    @click="share"
  >
    <span aria-hidden="true">{{ copied ? '✓' : '↗' }}</span>
    {{ copied ? 'Link copied!' : label }}
  </button>
</template>
