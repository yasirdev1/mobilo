<script setup lang="ts">
/** Price presets + custom min/max range with Apply (from listing filters). */
const props = defineProps<{
  presets: { label: string; min?: number; max?: number }[]
  modelValue: { min?: number; max?: number } | null
}>()
const emit = defineEmits<{ (e: 'update:modelValue', v: { min?: number; max?: number } | null): void }>()

const customMin = ref<string>('')
const customMax = ref<string>('')

function isActive(p: { min?: number; max?: number }) {
  return props.modelValue?.min === p.min && props.modelValue?.max === p.max
}
function pick(p: { min?: number; max?: number }) {
  emit('update:modelValue', isActive(p) ? null : { min: p.min, max: p.max })
}
function applyCustom() {
  emit('update:modelValue', {
    min: customMin.value ? Number(customMin.value) : undefined,
    max: customMax.value ? Number(customMax.value) : undefined,
  })
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate">Price</div>
    <div class="flex flex-wrap gap-1.5">
      <FilterChip
        v-for="p in presets"
        :key="p.label"
        :label="p.label"
        :active="isActive(p)"
        @toggle="pick(p)"
      />
    </div>
    <div class="flex flex-col gap-1.5 rounded-btn border border-line bg-canvas p-2.5">
      <div class="text-[11px] font-semibold text-slate">Custom range (Rs.)</div>
      <div class="flex items-center gap-1.5">
        <input v-model="customMin" type="number" placeholder="Min" class="h-[34px] w-0 min-w-0 flex-1 rounded-[7px] border border-line px-2 text-[12.5px] font-medium outline-none focus:border-brand" />
        <span class="text-xs text-muted">–</span>
        <input v-model="customMax" type="number" placeholder="Max" class="h-[34px] w-0 min-w-0 flex-1 rounded-[7px] border border-line px-2 text-[12.5px] font-medium outline-none focus:border-brand" />
      </div>
      <button class="h-[34px] w-full rounded-[7px] bg-brand text-xs font-semibold text-white hover:bg-brand-dark" @click="applyCustom">Apply</button>
    </div>
  </div>
</template>
