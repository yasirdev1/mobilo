<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { $api } = useNuxtApp()

// Lightweight stats from paginated admin endpoints (meta.total).
const { data: stats } = await useAsyncData('admin-stats', async () => {
  const [phones, pending, listings] = await Promise.all([
    $api<any>('/admin/phones', { query: { per_page: 1 } }).catch(() => null),
    $api<any>('/admin/listings', { query: { status: 'pending', per_page: 1 } }).catch(() => null),
    $api<any>('/admin/listings', { query: { per_page: 1 } }).catch(() => null),
  ])
  return {
    phones: phones?.meta?.total ?? phones?.total ?? '—',
    pending: pending?.meta?.total ?? pending?.total ?? '—',
    listings: listings?.meta?.total ?? listings?.total ?? '—',
  }
})

useHead({ title: 'Dashboard — Mobilo Admin' })
</script>

<template>
  <div>
    <h1 class="m-0 mb-5 font-display text-2xl font-bold tracking-tight">Dashboard</h1>
    <div class="grid grid-cols-2 gap-3 lg:grid-cols-3">
      <div class="rounded-card border border-line bg-white p-5">
        <div class="text-[12px] font-semibold uppercase tracking-wide text-slate">Phones</div>
        <div class="mt-1 font-display text-3xl font-extrabold tabular-nums">{{ stats?.phones }}</div>
      </div>
      <NuxtLink to="/admin/listings" class="rounded-card border border-line bg-white p-5 no-underline text-ink transition-shadow hover:shadow-raised">
        <div class="text-[12px] font-semibold uppercase tracking-wide text-alert">Pending review</div>
        <div class="mt-1 font-display text-3xl font-extrabold tabular-nums">{{ stats?.pending }}</div>
      </NuxtLink>
      <div class="rounded-card border border-line bg-white p-5">
        <div class="text-[12px] font-semibold uppercase tracking-wide text-slate">Total listings</div>
        <div class="mt-1 font-display text-3xl font-extrabold tabular-nums">{{ stats?.listings }}</div>
      </div>
    </div>
  </div>
</template>
