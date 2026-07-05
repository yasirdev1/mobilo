<script setup lang="ts">
import type { NuxtError } from '#app'

/**
 * Root error boundary — renders for any unhandled error or thrown
 * createError() (e.g. 404 on an unknown phone/listing slug).
 * Wrapped in the default layout so header/footer/nav stay consistent.
 */
const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error?.statusCode === 404)
const heading = computed(() => (is404.value ? 'Page not found' : 'Something went wrong'))
const message = computed(() =>
  is404.value
    ? "The page or phone you're looking for doesn't exist or may have been removed."
    : "An unexpected error occurred. Please try again in a moment.",
)

// clearError resets Nuxt's error state and navigates.
function goHome() {
  clearError({ redirect: '/' })
}
function goMobiles() {
  clearError({ redirect: '/mobiles' })
}

useHead({ title: () => `${heading.value} — Mobilo.pk` })
</script>

<template>
  <NuxtLayout>
    <div class="mx-auto flex w-full max-w-[560px] flex-col items-center gap-4 px-4 py-16 text-center">
      <div class="grid h-16 w-16 place-items-center rounded-full bg-brand-tint font-display text-2xl font-extrabold text-brand">
        {{ is404 ? '404' : '!' }}
      </div>
      <h1 class="m-0 font-display text-[clamp(22px,4vw,30px)] font-extrabold tracking-tight">{{ heading }}</h1>
      <p class="m-0 max-w-[420px] text-[14px] leading-relaxed text-slate">{{ message }}</p>
      <div class="mt-2 flex flex-wrap justify-center gap-2.5">
        <button
          class="inline-flex h-11 items-center rounded-btn bg-brand px-5 text-[13.5px] font-semibold text-white hover:bg-brand-dark"
          @click="goHome"
        >
          Back to home
        </button>
        <button
          class="inline-flex h-11 items-center rounded-btn border border-line bg-white px-5 text-[13.5px] font-semibold text-ink hover:bg-mist"
          @click="goMobiles"
        >
          Browse mobiles
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>
