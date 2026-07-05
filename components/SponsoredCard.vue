<script setup lang="ts">
/** Native in-feed sponsored card — always amber-labeled, never organic-looking. */
defineProps<{ title: string; href?: string }>()
</script>

<template>
  <a
    :href="href ?? '#'"
    rel="sponsored"
    class="flex max-w-[560px] items-center gap-3.5 rounded-card border border-sponsor-border bg-[#fffdf7] p-4 text-ink no-underline"
  >
    <div class="grid h-16 w-16 flex-none place-items-center rounded-xl bg-sponsor-tint">
      <slot name="image"><span class="font-mono text-[9px] text-[#b09355]">img</span></slot>
    </div>
    <div class="min-w-0 flex-1">
      <span class="rounded-full bg-sponsor-tint px-2 py-1 text-[10.5px] font-semibold text-sponsor">Sponsored</span>
      <div class="mt-1.5 text-sm font-semibold leading-snug">{{ title }}</div>
    </div>
    <div class="flex-none px-1 py-2.5 text-[12.5px] font-semibold text-brand">View →</div>
  </a>
</template>
