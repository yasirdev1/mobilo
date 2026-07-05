<script setup lang="ts">
const { user, logout, can } = useAuth()

const nav = [
  { label: 'Dashboard', to: '/admin', icon: '▤' },
  { label: 'Phones', to: '/admin/phones', icon: '▦', perm: 'phones.manage' },
  { label: 'Listings', to: '/admin/listings', icon: '♻', perm: 'listings.viewAny' },
]

const visibleNav = computed(() => nav.filter((n) => !n.perm || can(n.perm)))

async function doLogout() {
  await logout()
  await navigateTo('/login')
}
</script>

<template>
  <div class="flex min-h-screen bg-canvas">
    <!-- Sidebar -->
    <aside class="hidden w-60 flex-none flex-col border-r border-line bg-white p-4 md:flex">
      <NuxtLink to="/admin" class="mb-6 flex items-center gap-2 no-underline">
        <span class="grid h-[30px] w-[30px] place-items-center rounded-[9px] bg-brand font-display text-[15px] font-extrabold text-white">M</span>
        <span class="font-display text-lg font-bold tracking-tight text-ink">Mobilo <span class="text-slate">Admin</span></span>
      </NuxtLink>
      <nav class="flex flex-col gap-1">
        <NuxtLink
          v-for="item in visibleNav"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13.5px] font-semibold text-ink no-underline hover:bg-mist"
          active-class="bg-brand-tint text-brand"
        >
          <span aria-hidden="true">{{ item.icon }}</span>{{ item.label }}
        </NuxtLink>
      </nav>
      <div class="mt-auto flex flex-col gap-1 pt-4 text-[13px]">
        <NuxtLink to="/" class="rounded-lg px-3 py-2 font-semibold text-slate no-underline hover:bg-mist">← View site</NuxtLink>
        <button class="rounded-lg px-3 py-2 text-left font-semibold text-alert hover:bg-alert-tint" @click="doLogout">Log out</button>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex min-w-0 flex-1 flex-col">
      <header class="flex h-14 items-center justify-between border-b border-line bg-white px-4">
        <div class="text-[13px] font-semibold text-slate md:hidden">Mobilo Admin</div>
        <div class="flex-1" />
        <div class="text-[13px] text-slate">{{ user?.name }}</div>
      </header>
      <main class="flex-1 p-4 md:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
