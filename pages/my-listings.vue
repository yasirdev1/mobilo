<script setup lang="ts">
/**
 * My Listings — the signed-in user manages their own used-mobile ads:
 * view all, edit details, mark as sold, or post a new one.
 * Data flows through useUsedListingRepository() (mine/update/markSold).
 */
import type { UsedListing } from '~/data/types'

const repo = useUsedListingRepository()
const { format } = usePrice()

const { data, pending, error, refresh } = await useAsyncData('my-listings', () => repo.mine())

// Local working copy so edits / mark-sold reflect immediately in the UI.
const listings = ref<UsedListing[]>([])
watch(data, (v) => (listings.value = v ?? []), { immediate: true })

const activeCount = computed(() => listings.value.filter((l) => l.status !== 'sold').length)
const soldCount = computed(() => listings.value.filter((l) => l.status === 'sold').length)

// ─── Mark as sold ──────────────────────────────────────────────────
const markingId = ref<string | null>(null)
async function markSold(l: UsedListing) {
  if (l.status === 'sold') return
  markingId.value = l.id
  try {
    await repo.markSold(l.id)
    const item = listings.value.find((x) => x.id === l.id)
    if (item) item.status = 'sold'
    listings.value = [...listings.value]
  } finally {
    markingId.value = null
  }
}

// ─── Edit dialog ───────────────────────────────────────────────────
const conditions = ['Like New', 'Excellent', 'Good', 'Fair'] as const
const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad']
const editing = ref<UsedListing | null>(null)
const saving = ref(false)
const draft = reactive({ price: '', condition: '' as string, city: '', pta: true })

function openEdit(l: UsedListing) {
  editing.value = l
  draft.price = String(l.price)
  draft.condition = l.condition
  draft.city = l.city
  draft.pta = l.ptaApproved
}
function closeEdit() {
  editing.value = null
}
async function saveEdit() {
  if (!editing.value) return
  const price = Number(draft.price)
  if (!Number.isFinite(price) || price <= 0 || !draft.condition) return
  saving.value = true
  try {
    const patch = {
      price,
      condition: draft.condition as UsedListing['condition'],
      city: draft.city,
      ptaApproved: draft.pta,
    }
    await repo.update(editing.value.id, patch)
    const item = listings.value.find((x) => x.id === editing.value!.id)
    if (item) Object.assign(item, patch)
    listings.value = [...listings.value]
    closeEdit()
  } finally {
    saving.value = false
  }
}

// Close the dialog on Escape.
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') closeEdit()
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))

useSeoMeta({
  title: 'My Listings — Mobilo.pk',
  description: 'Manage your posted mobile listings: view all, edit details, mark as sold, or post a new one.',
  robots: 'noindex, nofollow', // private account page
})
</script>

<template>
  <div class="mx-auto w-full max-w-[900px] px-4 py-6">
    <!-- Header -->
    <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="m-0 font-display text-[clamp(22px,3.5vw,30px)] font-bold tracking-tight">My Listings</h1>
        <p v-if="!pending && !error" class="m-0 mt-1 text-[13px] text-slate">
          {{ activeCount }} active · {{ soldCount }} sold
        </p>
      </div>
      <NuxtLink
        to="/sell"
        class="inline-flex h-11 items-center rounded-btn bg-ink px-[18px] text-[13.5px] font-semibold text-white no-underline hover:bg-[#223129]"
      >
        + Sell Mobile
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="flex flex-col gap-3">
      <SkeletonCard v-for="n in 3" :key="n" />
    </div>

    <!-- Error -->
    <EmptyState
      v-else-if="error"
      title="Couldn't load your listings"
      message="Something went wrong. Please try again."
      action-label="Retry"
      @action="refresh()"
    />

    <!-- Empty -->
    <EmptyState
      v-else-if="!listings.length"
      title="You haven't listed anything yet"
      message="Post your first mobile and reach buyers browsing that exact model."
      action-label="Sell a mobile"
      @action="$router.push('/sell')"
    />

    <!-- Listings -->
    <div v-else class="flex flex-col gap-3">
      <div
        v-for="l in listings"
        :key="l.id"
        class="flex flex-col gap-3 rounded-card border border-line bg-white p-3.5 sm:flex-row sm:items-center"
        :class="l.status === 'sold' ? 'opacity-75' : ''"
      >
        <!-- Thumb -->
        <NuxtLink :to="`/used/${l.id}`" class="grid h-[84px] w-full flex-none place-items-center overflow-hidden rounded-xl bg-mist sm:w-[96px]">
          <img v-if="l.image" :src="l.image" :alt="l.title" class="h-full w-full object-cover" loading="lazy" />
        </NuxtLink>

        <!-- Details -->
        <div class="flex min-w-0 flex-1 flex-col gap-1.5">
          <div class="flex items-center gap-2">
            <NuxtLink :to="`/used/${l.id}`" class="font-display text-sm font-semibold leading-snug text-ink no-underline">{{ l.title }}</NuxtLink>
            <span
              v-if="l.status === 'sold'"
              class="rounded-full bg-ink px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-white"
            >
              Sold
            </span>
          </div>
          <div class="font-display text-base font-bold tabular-nums">{{ format(l.price) }}</div>
          <div class="flex flex-wrap items-center gap-1">
            <PtaBadge :approved="l.ptaApproved" />
            <span class="rounded-full bg-mist px-2 py-1 text-[10.5px] font-semibold text-ink">{{ l.condition }}</span>
            <span class="text-xs text-slate">{{ l.city }} · {{ l.posted }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-none flex-wrap gap-2 sm:flex-col sm:items-stretch">
          <button
            type="button"
            class="inline-flex h-9 items-center justify-center rounded-btn border border-line bg-white px-3.5 text-[12.5px] font-semibold text-ink hover:bg-mist"
            @click="openEdit(l)"
          >
            Edit
          </button>
          <button
            type="button"
            :disabled="l.status === 'sold' || markingId === l.id"
            class="inline-flex h-9 items-center justify-center rounded-btn bg-brand px-3.5 text-[12.5px] font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-mist disabled:text-muted"
            @click="markSold(l)"
          >
            {{ l.status === 'sold' ? 'Sold' : markingId === l.id ? 'Saving…' : 'Mark as Sold' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Edit dialog -->
    <Teleport to="body">
      <div
        v-if="editing"
        class="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
        @click.self="closeEdit"
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-title"
          class="flex w-full max-w-[440px] flex-col gap-4 rounded-t-card bg-white p-5 shadow-overlay sm:rounded-card"
        >
          <div class="flex items-center justify-between gap-3">
            <h2 id="edit-title" class="m-0 font-display text-[17px] font-bold tracking-tight">Edit listing</h2>
            <button
              type="button"
              class="grid h-8 w-8 place-items-center rounded-full bg-mist text-slate"
              aria-label="Close"
              @click="closeEdit"
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>
          <div class="text-[13px] font-semibold text-slate">{{ editing.title }}</div>

          <div class="flex flex-col gap-[7px]">
            <label for="edit-price" class="text-[12.5px] font-semibold">Asking price (Rs.)</label>
            <input
              id="edit-price"
              v-model="draft.price"
              type="number"
              min="1"
              step="1"
              inputmode="numeric"
              class="h-12 rounded-btn border-[1.5px] border-line px-3.5 text-sm font-medium outline-none focus:border-brand"
            />
          </div>

          <div class="flex flex-col gap-2" role="group" aria-labelledby="edit-condition-label">
            <span id="edit-condition-label" class="text-[12.5px] font-semibold">Condition</span>
            <div class="flex flex-wrap gap-1.5">
              <FilterChip
                v-for="c in conditions"
                :key="c"
                :label="c"
                :active="draft.condition === c"
                @toggle="draft.condition = c"
              />
            </div>
          </div>

          <div class="flex flex-col gap-[7px]">
            <label for="edit-city" class="text-[12.5px] font-semibold">City</label>
            <select
              id="edit-city"
              v-model="draft.city"
              class="h-12 rounded-btn border-[1.5px] border-line bg-white px-3 text-sm font-medium outline-none focus:border-brand"
            >
              <option v-for="c in cities" :key="c">{{ c }}</option>
            </select>
          </div>

          <ToggleSwitch v-model="draft.pta" label="PTA Approved" />

          <div class="mt-1 flex gap-2.5">
            <button
              type="button"
              class="h-11 flex-1 rounded-btn border border-line bg-white text-[13.5px] font-semibold text-ink hover:bg-mist"
              @click="closeEdit"
            >
              Cancel
            </button>
            <button
              type="button"
              :disabled="saving"
              class="h-11 flex-1 rounded-btn bg-brand text-[13.5px] font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
              @click="saveEdit"
            >
              {{ saving ? 'Saving…' : 'Save changes' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
