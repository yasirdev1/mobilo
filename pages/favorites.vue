<script setup lang="ts">
/**
 * Favorites / wishlist — phones the user hearted (useFavorites, localStorage).
 * Resolves saved slugs against the phone catalogue.
 */
import type { Phone } from '~/data/types'

const repo = usePhoneRepository()
const { favorites } = useFavorites()

const { data: allPhones, pending, error, refresh } = await useAsyncData<Phone[]>('favorites-phones', () => repo.all())

const saved = computed(() =>
  favorites.value
    .map((slug) => (allPhones.value ?? []).find((p) => p.slug === slug))
    .filter((p): p is Phone => Boolean(p)),
)

useSeoMeta({
  title: 'My Favorites — Mobilo.pk',
  description: 'Phones you saved to your wishlist on Mobilo.pk.',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="mx-auto w-full max-w-[1200px] px-4 py-6">
    <h1 class="m-0 mb-5 font-display text-[clamp(22px,3.5vw,30px)] font-bold tracking-tight">
      My Favorites
      <span v-if="saved.length" class="align-middle text-[15px] font-semibold text-slate">({{ saved.length }})</span>
    </h1>

    <!-- Loading -->
    <div v-if="pending" class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      <SkeletonCard v-for="n in 4" :key="n" />
    </div>

    <!-- Error -->
    <EmptyState
      v-else-if="error"
      title="Couldn't load your favorites"
      message="Something went wrong. Please try again."
      action-label="Retry"
      @action="refresh()"
    />

    <!-- Empty -->
    <EmptyState
      v-else-if="!saved.length"
      title="No favorites yet"
      message="Tap the heart on any phone to save it here for later."
      action-label="Browse mobiles"
      @action="$router.push('/mobiles')"
    />

    <!-- Grid -->
    <div v-else class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      <MobileCard v-for="p in saved" :key="p.slug" :phone="p" />
    </div>

    <CompareBar />
  </div>
</template>
