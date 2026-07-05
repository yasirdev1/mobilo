<script setup lang="ts">
defineProps<{ label: string; modelValue: boolean }>()
defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()
</script>

<template>
  <label class="flex min-h-[44px] cursor-pointer items-center justify-between gap-2.5 text-[13.5px] font-medium">
    {{ label }}
    <span class="relative h-5 w-[34px] flex-none">
      <input
        type="checkbox"
        :checked="modelValue"
        class="absolute inset-0 z-10 m-0 cursor-pointer opacity-0"
        @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      />
      <span
        class="absolute inset-0 rounded-full transition-colors"
        :class="modelValue ? 'bg-brand' : 'bg-[#d3dbd6]'"
      />
      <span
        class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all"
        :class="modelValue ? 'left-4' : 'left-0.5'"
      />
    </span>
  </label>
</template>
