<script setup lang="ts">
/**
 * Labeled, fixed-size ad container — reserved space, no CLS,
 * no accidental clicks. Drop the ad network tag into the slot.
 */
withDefaults(defineProps<{ height?: string; note?: string }>(), {
  height: '90px',
  note: 'ad slot · responsive',
})
</script>

<template>
  <div class="flex flex-col gap-[5px]">
    <div class="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">Advertisement</div>
    <div
      class="grid place-items-center rounded-xl border border-dashed border-[#d3dbd6] bg-mist"
      :style="{ height }"
    >
      <slot>
        <span class="font-mono text-[11px] text-muted">{{ note }}</span>
      </slot>
    </div>
  </div>
</template>
