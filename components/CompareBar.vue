<script setup lang="ts">
/**
 * Floating dark compare bar — appears when ≥1 phone is selected.
 * Reads the useCompare() store; renders removable chips + CTA.
 */
const { selected, max, remove, compareUrl } = useCompare()

// Resolve slugs → human-readable phone names for the chips.
// Shared cache key so this dedupes with the phone lists other pages fetch.
const repo = usePhoneRepository()
const { data: phones } = await useAsyncData('compare-bar-phones', () => repo.all())
const nameFor = (slug: string) =>
  phones.value?.find((p) => p.slug === slug)?.name ?? slug
</script>

<template>
  <Transition
    enter-active-class="transition duration-200"
    enter-from-class="translate-y-4 opacity-0"
    leave-active-class="transition duration-150"
    leave-to-class="translate-y-4 opacity-0"
  >
    <div
      v-if="selected.length"
      class="fixed inset-x-4 bottom-20 z-40 mx-auto flex max-w-[720px] flex-wrap items-center gap-3 rounded-xl bg-ink px-3.5 py-2.5 shadow-overlay md:bottom-6"
    >
      <div
        v-for="slug in selected"
        :key="slug"
        class="flex items-center gap-1.5 rounded-full bg-white/10 py-1.5 pl-3 pr-1.5"
      >
        <span class="text-xs font-semibold text-white">{{ nameFor(slug) }}</span>
        <button
          class="grid h-5 w-5 place-items-center rounded-full bg-white/15 text-[11px] font-semibold text-white"
          :aria-label="`Remove ${nameFor(slug)}`"
          @click="remove(slug)"
        >
          ✕
        </button>
      </div>
      <span class="text-[12.5px] font-medium text-[#b6cfc2]">{{ selected.length }} / {{ max }} selected</span>
      <div class="flex-1" />
      <NuxtLink
        :to="compareUrl"
        class="inline-flex h-[42px] items-center rounded-[9px] bg-white px-[18px] text-[13.5px] font-bold text-ink no-underline"
      >
        Compare Now →
      </NuxtLink>
    </div>
  </Transition>
</template>
