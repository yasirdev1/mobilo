<script setup lang="ts">
import type { Phone } from '~/data/types'

const route = useRoute()
const repo = usePhoneRepository()

const { data: phones, pending, error, refresh } = await useAsyncData<Phone[]>('phones-all', () => repo.all())
const { data: brands } = await useAsyncData('brands-all', () => repo.brands())

const selectedBrands = ref<string[]>(route.query.brand ? [String(route.query.brand)] : [])
const priceRange = ref<{ min?: number; max?: number } | null>(null)
const showAllBrands = ref(false)
const query = ref(String(route.query.q ?? ''))

// Map a ?budget= value (a max price, or 150001 = "above 150k") to a range.
function applyBudget(b?: unknown) {
  if (!b) return
  const n = Number(b)
  if (!Number.isFinite(n)) return
  priceRange.value = n > 150000 ? { min: 150000 } : { max: n }
}
applyBudget(route.query.budget)

// The page is reused across in-app navigations (e.g. clicking a brand link
// from the homepage while already on /mobiles), so setup does NOT re-run.
// Sync the filters when the query string changes.
watch(
  () => route.query.brand,
  (brand) => {
    if (brand) selectedBrands.value = [String(brand)]
  },
)
watch(
  () => route.query.q,
  (q) => {
    query.value = String(q ?? '')
  },
)
watch(() => route.query.budget, applyBudget)

const pricePresets = [
  { label: 'Under 50k', max: 50000 },
  { label: '50k – 100k', min: 50000, max: 100000 },
  { label: '100k – 200k', min: 100000, max: 200000 },
  { label: '200k+', min: 200000 },
]

const visibleBrands = computed(() => (showAllBrands.value ? brands.value ?? [] : (brands.value ?? []).slice(0, 6)))

function toggleBrand(name: string) {
  const i = selectedBrands.value.indexOf(name)
  i >= 0 ? selectedBrands.value.splice(i, 1) : selectedBrands.value.push(name)
}
function clearAll() {
  selectedBrands.value = []
  priceRange.value = null
  query.value = ''
}

useSeoMeta({
  title: 'Mobile Phones in Pakistan — Prices & Specs | Mobilo.pk',
  description:
    'Browse and filter mobile phones in Pakistan by brand and budget. Compare specs, check the latest prices, and find the best value picks.',
  ogTitle: 'Mobile Phones in Pakistan — Prices & Specs',
  ogDescription: 'Filter phones by brand and budget, compare specs, and check the latest prices in Pakistan.',
})

const filtered = computed(() =>
  (phones.value ?? []).filter((p) => {
    if (selectedBrands.value.length && !selectedBrands.value.includes(p.brand)) return false
    if (priceRange.value?.min && p.price < priceRange.value.min) return false
    if (priceRange.value?.max && p.price > priceRange.value.max) return false
    if (query.value && !p.name.toLowerCase().includes(query.value.toLowerCase())) return false
    return true
  }),
)

// ─── Sorting ───────────────────────────────────────────────────────
const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Top rated'] as const
const sort = ref<(typeof sortOptions)[number]>('Featured')

const sorted = computed(() => {
  const list = [...filtered.value]
  switch (sort.value) {
    case 'Price: Low to High':
      return list.sort((a, b) => a.price - b.price)
    case 'Price: High to Low':
      return list.sort((a, b) => b.price - a.price)
    case 'Newest':
      return list.sort((a, b) => Date.parse(b.launched ?? '') - Date.parse(a.launched ?? ''))
    case 'Top rated':
      return list.sort((a, b) => (b.scores?.value ?? 0) - (a.scores?.value ?? 0))
    default:
      return list // Featured = source order
  }
})

// ─── Load-more pagination (client-side; real API should page server-side) ──
const PAGE = 6
const visibleCount = ref(PAGE)
const visible = computed(() => sorted.value.slice(0, visibleCount.value))
const canLoadMore = computed(() => visibleCount.value < sorted.value.length)
// Reset paging whenever the result set or sort changes.
watch([filtered, sort], () => (visibleCount.value = PAGE))
</script>

<template>
  <div class="mx-auto w-full max-w-[1200px] px-4 py-6">
    <h1 class="m-0 mb-5 font-display text-[clamp(22px,3.5vw,30px)] font-bold tracking-tight">Mobile Phones in Pakistan</h1>

    <div class="grid gap-6 md:grid-cols-[260px_1fr]">
      <!-- Filters -->
      <aside class="flex h-max flex-col gap-5 rounded-card border border-line bg-white p-4 md:sticky md:top-[76px]">
        <div class="flex flex-col gap-2">
          <div class="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate">Brand</div>
          <div class="flex flex-wrap gap-1.5">
            <FilterChip
              v-for="b in visibleBrands"
              :key="b.name"
              :label="b.name"
              :active="selectedBrands.includes(b.name)"
              @toggle="toggleBrand(b.name)"
            />
            <button v-if="!showAllBrands && (brands?.length ?? 0) > 6" class="px-1 py-2 text-xs font-semibold text-brand" @click="showAllBrands = true">
              + {{ (brands?.length ?? 0) - 6 }} more
            </button>
          </div>
        </div>
        <PriceRangeFilter v-model="priceRange" :presets="pricePresets" />
        <button class="text-left text-[13px] font-semibold text-brand" @click="clearAll">Clear all filters</button>
      </aside>

      <!-- Results -->
      <div>
        <div class="mb-3 flex items-center justify-between gap-3">
          <div class="text-[13px] text-slate">
            <span v-if="!pending && !error">{{ filtered.length }} phones found</span>
            <span v-else-if="pending">Loading phones…</span>
          </div>
          <label v-if="!pending && !error && filtered.length" class="flex items-center gap-2 text-[13px] text-slate">
            <span class="hidden sm:inline">Sort</span>
            <select v-model="sort" aria-label="Sort phones" class="h-9 rounded-btn border border-line bg-white px-2.5 text-[12.5px] font-semibold text-ink outline-none focus:border-brand">
              <option v-for="o in sortOptions" :key="o" :value="o">{{ o }}</option>
            </select>
          </label>
        </div>

        <!-- Loading -->
        <div v-if="pending" class="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <SkeletonCard v-for="n in 6" :key="n" />
        </div>

        <!-- Error -->
        <EmptyState
          v-else-if="error"
          title="Couldn't load phones"
          message="Something went wrong fetching the catalogue. Please try again."
          action-label="Retry"
          @action="refresh()"
        />

        <!-- Results -->
        <template v-else-if="filtered.length">
          <div class="grid grid-cols-2 gap-3 lg:grid-cols-3">
            <MobileCard v-for="p in visible" :key="p.slug" :phone="p" />
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

        <!-- Empty -->
        <EmptyState v-else @action="clearAll" />
      </div>
    </div>

    <CompareBar />
  </div>
</template>
