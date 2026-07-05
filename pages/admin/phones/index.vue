<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

import type { Phone } from '~/data/types'

const { $api } = useNuxtApp()
const { format } = usePrice()

const { data, pending, error, refresh } = await useAsyncData('admin-phones', () =>
  $api<{ data: Phone[] }>('/admin/phones'),
)
const phones = computed(() => data.value?.data ?? [])

const deleting = ref<string | null>(null)
async function remove(phone: Phone) {
  if (!confirm(`Delete "${phone.name}"? This can be restored from the database (soft delete).`)) return
  deleting.value = phone.slug
  try {
    await $api(`/admin/phones/${phone.slug}`, { method: 'DELETE' })
    await refresh()
  } finally {
    deleting.value = null
  }
}

useHead({ title: 'Phones — Mobilo Admin' })
</script>

<template>
  <div>
    <div class="mb-5 flex items-center justify-between gap-3">
      <h1 class="m-0 font-display text-2xl font-bold tracking-tight">Phones</h1>
    </div>

    <div v-if="pending" class="text-[13px] text-slate">Loading…</div>
    <div v-else-if="error" class="text-[13px] text-alert">Couldn't load phones.</div>

    <div v-else class="overflow-hidden rounded-card border border-line bg-white">
      <table class="w-full text-left text-[13px]">
        <thead class="border-b border-line bg-canvas text-[11px] uppercase tracking-wide text-slate">
          <tr>
            <th class="px-3.5 py-2.5">Name</th>
            <th class="px-3.5 py-2.5">Brand</th>
            <th class="px-3.5 py-2.5">Price</th>
            <th class="px-3.5 py-2.5"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in phones" :key="p.slug" class="border-b border-hairline last:border-0">
            <td class="px-3.5 py-2.5 font-semibold">{{ p.name }}</td>
            <td class="px-3.5 py-2.5 text-slate">{{ p.brand }}</td>
            <td class="px-3.5 py-2.5 tabular-nums">{{ format(p.price) }}</td>
            <td class="px-3.5 py-2.5 text-right">
              <button
                :disabled="deleting === p.slug"
                class="rounded-btn border border-line px-3 py-1.5 text-[12px] font-semibold text-alert hover:bg-alert-tint disabled:opacity-50"
                @click="remove(p)"
              >
                {{ deleting === p.slug ? 'Deleting…' : 'Delete' }}
              </button>
            </td>
          </tr>
          <tr v-if="!phones.length">
            <td colspan="4" class="px-3.5 py-6 text-center text-slate">No phones yet.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
