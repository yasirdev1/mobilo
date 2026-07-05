<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { $api } = useNuxtApp()
const { format } = usePrice()

const status = ref<'pending' | 'available' | 'sold' | ''>('pending')

const { data, pending, error, refresh } = await useAsyncData(
  'admin-listings',
  () => $api<{ data: any[] }>('/admin/listings', { query: { status: status.value || undefined } }),
  { watch: [status] },
)
const listings = computed(() => data.value?.data ?? [])

const busy = ref<number | null>(null)
async function act(listing: any, action: 'approve' | 'reject') {
  busy.value = listing.db_id
  try {
    await $api(`/admin/listings/${listing.db_id}/${action}`, { method: 'POST' })
    await refresh()
  } finally {
    busy.value = null
  }
}

useHead({ title: 'Listings — Mobilo Admin' })
</script>

<template>
  <div>
    <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
      <h1 class="m-0 font-display text-2xl font-bold tracking-tight">Listings</h1>
      <select v-model="status" class="h-9 rounded-btn border border-line bg-white px-2.5 text-[12.5px] font-semibold outline-none">
        <option value="pending">Pending review</option>
        <option value="available">Available</option>
        <option value="sold">Sold</option>
        <option value="">All</option>
      </select>
    </div>

    <div v-if="pending" class="text-[13px] text-slate">Loading…</div>
    <div v-else-if="error" class="text-[13px] text-alert">Couldn't load listings.</div>

    <div v-else class="flex flex-col gap-3">
      <div
        v-for="l in listings"
        :key="l.db_id"
        class="flex flex-wrap items-center gap-3 rounded-card border border-line bg-white p-3.5"
      >
        <div class="min-w-0 flex-1">
          <div class="font-display text-sm font-semibold">{{ l.title }}</div>
          <div class="text-[12px] text-slate">
            {{ format(l.price) }} · {{ l.city }} · {{ l.condition }} · {{ l.ptaApproved ? 'PTA' : 'Non-PTA' }}
          </div>
        </div>
        <span class="rounded-full bg-mist px-2.5 py-1 text-[11px] font-semibold capitalize">{{ l.status }}</span>
        <div v-if="l.status === 'pending'" class="flex gap-2">
          <button
            :disabled="busy === l.db_id"
            class="rounded-btn bg-brand px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
            @click="act(l, 'approve')"
          >
            Approve
          </button>
          <button
            :disabled="busy === l.db_id"
            class="rounded-btn border border-line px-3 py-1.5 text-[12px] font-semibold text-alert hover:bg-alert-tint disabled:opacity-50"
            @click="act(l, 'reject')"
          >
            Reject
          </button>
        </div>
      </div>
      <div v-if="!listings.length" class="rounded-card border border-line bg-white px-4 py-8 text-center text-[13px] text-slate">
        Nothing here.
      </div>
    </div>
  </div>
</template>
