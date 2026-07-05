<script setup lang="ts">
/** Mobile bottom sheet shell (filters, sell flow). Teleports to <body>. */
defineProps<{ open: boolean; title: string }>()
const emit = defineEmits<{ (e: 'close'): void }>()
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150"
      leave-to-class="opacity-0"
    >
      <div v-if="open" class="fixed inset-0 z-[60] bg-ink/40" @click="emit('close')" />
    </Transition>
    <Transition
      enter-active-class="transition duration-250"
      enter-from-class="translate-y-full"
      leave-active-class="transition duration-200"
      leave-to-class="translate-y-full"
    >
      <div
        v-if="open"
        class="fixed inset-x-0 bottom-0 z-[61] max-h-[85vh] overflow-auto rounded-t-[20px] bg-white shadow-overlay"
        role="dialog"
        aria-modal="true"
      >
        <div class="grid place-items-center pt-2.5">
          <span class="h-1 w-10 rounded-full bg-[#d3dbd6]" />
        </div>
        <div class="flex items-center justify-between border-b border-mist px-5 pb-3.5 pt-3">
          <div class="font-display text-[17px] font-bold">{{ title }}</div>
          <slot name="header-action" />
        </div>
        <div class="px-5 py-4">
          <slot />
        </div>
        <div class="flex gap-2.5 border-t border-mist px-5 py-3.5">
          <slot name="footer">
            <button class="h-[50px] flex-1 rounded-xl bg-mist text-sm font-semibold text-ink" @click="emit('close')">Cancel</button>
          </slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
