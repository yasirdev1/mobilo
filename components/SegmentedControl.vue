<script setup lang="ts">
defineProps<{ options: string[]; modelValue: string }>()
defineEmits<{ (e: 'update:modelValue', v: string): void }>()
</script>

<template>
  <div class="flex w-max gap-1 rounded-btn bg-mist p-1">
    <button
      v-for="opt in options"
      :key="opt"
      class="h-9 rounded-[7px] px-3.5 text-[12.5px] font-semibold"
      :class="modelValue === opt ? 'bg-white text-ink shadow-resting' : 'bg-transparent text-slate'"
      @click="$emit('update:modelValue', opt)"
    >
      {{ opt }}
    </button>
  </div>
</template>
