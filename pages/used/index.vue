<script setup lang="ts">
const repo = useUsedListingRepository()

const city = ref<string | null>(null)
const ptaOnly = ref(false)
const view = ref<'☰ List' | '▦ Grid'>('☰ List')
const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad']

const { data: listings, pending, error, refresh } = await useAsyncData('used-all', () => repo.all())

useSeoMeta({
  title: 'Used Mobiles for Sale in Pakistan | Mobilo.pk',
  description:
    'Buy and sell used mobile phones across Pakistan. Filter by city and PTA status, and browse verified listings from local sellers.',
  ogTitle: 'Used Mobiles for Sale in Pakistan',
  ogDescription: 'Browse verified used mobile listings by city and PTA status across Pakistan.',
})

const filtered = computed(() =>
  (listings.value ?? []).filter((l) => {
    if (city.value && l.city !== city.value) return false
    if (ptaOnly.value && !l.ptaApproved) return false
    return true
  }),
)
function clearAll() {
  city.value = null
  ptaOnly.value = false
}

// ─── Sorting ───────────────────────────────────────────────────────
// "posted" is a relative string in the dummy data, so Newest keeps the
// source order (the API is expected to return newest-first).
const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low'] as const
const sort = ref<(typeof sortOptions)[number]>('Newest')
const sorted = computed(() => {
  const list = [...filtered.value]
  if (sort.value === 'Price: Low to High') return list.sort((a, b) => a.price - b.price)
  if (sort.value === 'Price: High to Low') return list.sort((a, b) => b.price - a.price)
  return list
})

// ─── Load-more pagination (client-side) ────────────────────────────
const PAGE = 4
const visibleCount = ref(PAGE)
const visible = computed(() => sorted.value.slice(0, visibleCount.value))
const canLoadMore = computed(() => visibleCount.value < sorted.value.length)
watch([filtered, sort], () => (visibleCount.value = PAGE))
</script>

<template>
  <div class="mx-auto w-full max-w-[1200px] px-4 py-6">
    <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
      <h1 class="m-0 font-display text-[clamp(22px,3.5vw,30px)] font-bold tracking-tight">Used Mobiles in Pakistan</h1>
      <NuxtLink to="/sell" class="inline-flex h-11 items-center rounded-btn bg-ink px-[18px] text-[13.5px] font-semibold text-white no-underline">
        + Post your ad
      </NuxtLink>
    </div>

    <div class="grid gap-6 md:grid-cols-[260px_1fr]">
      <aside class="flex h-max flex-col gap-5 rounded-card border border-line bg-white p-4 md:sticky md:top-[76px]">
        <div class="flex flex-col gap-2">
          <div class="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate">City</div>
          <div class="flex flex-wrap gap-1.5">
            <FilterChip v-for="c in cities" :key="c" :label="c" :active="city === c" @toggle="city = city === c ? null : c" />
          </div>
        </div>
        <ToggleSwitch v-model="ptaOnly" label="PTA Approved only" />
        <button class="text-left text-[13px] font-semibold text-brand" @click="clearAll">Clear all filters</button>
      </aside>

      <div>
        <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div class="text-[13px] text-slate">
            <span v-if="!pending && !error">{{ filtered.length }} listings</span>
            <span v-else-if="pending">Loading listings…</span>
          </div>
          <div class="flex items-center gap-2.5">
            <select
              v-if="!pending && !error && filtered.length"
              v-model="sort"
              aria-label="Sort listings"
              class="h-9 rounded-btn border border-line bg-white px-2.5 text-[12.5px] font-semibold text-ink outline-none focus:border-brand"
            >
              <option v-for="o in sortOptions" :key="o" :value="o">{{ o }}</option>
            </select>
            <SegmentedControl v-model="view" :options="['☰ List', '▦ Grid']" />
          </div>
        </div>

        <!-- Loading -->
        <div v-if="pending" :class="view === '▦ Grid' ? 'grid grid-cols-1 gap-3 sm:grid-cols-2' : 'flex flex-col gap-3'">
          <SkeletonCard v-for="n in 4" :key="n" />
        </div>

        <!-- Error -->
        <EmptyState
          v-else-if="error"
          title="Couldn't load listings"
          message="Something went wrong fetching listings. Please try again."
          action-label="Retry"
          @action="refresh()"
        />

        <template v-else-if="filtered.length">
          <div :class="view === '▦ Grid' ? 'grid grid-cols-1 gap-3 sm:grid-cols-2' : 'flex flex-col gap-3'">
            <UsedMobileCard v-for="l in visible" :key="l.id" :listing="l" />
          </div>
          <div v-if="canLoadMore" class="mt-5 flex justify-center">
            <button
              type="button"
              class="inline-flex h-11 items-center rounded-btn border border-line bg-white px-6 text-[13.5px] font-semibold text-ink hover:bg-mist"
              @click="visibleCount += PAGE"
            >
              Load more ({{ sorted.length - visible.length }} left)
            </button>
          </div>
        </template>
        <EmptyState v-else title="No listings match" message="Try another city or turn off PTA-only." @action="clearAll" />
      </div>
    </div>
  </div>
</template>
