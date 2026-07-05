<script setup lang="ts">
import type { Phone, Brand } from '~/data/types'

const repo = usePhoneRepository()
const usedRepo = useUsedListingRepository()
const { format } = usePrice()

const { data: phones, pending: phonesPending } = await useAsyncData<Phone[]>('phones', () => repo.all())
const { data: brands } = await useAsyncData<Brand[]>('brands', () => repo.brands())
const { data: used } = await useAsyncData('used-preview', async () => (await usedRepo.all()).slice(0, 4))

useSeoMeta({
  title: 'Mobilo.pk — Find, Compare, Buy & Sell Mobiles in Pakistan',
  description:
    'Compare mobile specs and prices, get AI recommendations, find purchase links, and browse verified used mobile listings across Pakistan.',
  ogTitle: 'Mobilo.pk — Find, Compare, Buy & Sell Mobiles in Pakistan',
  ogDescription:
    'Compare mobile specs and prices, get AI recommendations, and browse verified used listings across Pakistan.',
})

const popular = computed(() => phones.value ?? [])
const budgets = [
  { limit: 'Rs. 30,000', count: 12 },
  { limit: 'Rs. 50,000', count: 18 },
  { limit: 'Rs. 100,000', count: 24 },
  { limit: 'Rs. 150,000', count: 15 },
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="border-b border-line bg-gradient-to-b from-white to-canvas">
      <div class="mx-auto flex max-w-[1200px] flex-col items-center gap-3.5 px-4 pb-[clamp(24px,4.5vw,44px)] pt-[clamp(28px,5vw,52px)] text-center">
        <div class="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">Pakistan's smartest phone platform</div>
        <h1 class="m-0 max-w-[720px] font-display text-[clamp(28px,5.5vw,48px)] font-extrabold leading-[1.12] tracking-tight [text-wrap:balance]">
          Find, Compare, Buy, or Sell Mobiles in Pakistan
        </h1>
        <p class="m-0 max-w-[560px] text-[clamp(14px,2vw,16.5px)] leading-relaxed text-slate [text-wrap:pretty]">
          Compare specs, prices, AI recommendations, purchase links, and used mobile listings — all in one place.
        </p>
        <HeroSearch />
        <div class="flex flex-wrap justify-center gap-2.5">
          <NuxtLink
            v-for="a in [
              { label: 'Compare Mobiles', to: '/compare' },
              { label: 'Best by Budget', to: '/mobiles' },
              { label: 'Sell Your Mobile', to: '/sell' },
            ]"
            :key="a.to"
            :to="a.to"
            class="inline-flex h-11 items-center rounded-full border border-line bg-white px-5 text-[13.5px] font-semibold text-ink no-underline hover:bg-mist"
          >
            {{ a.label }}
          </NuxtLink>
        </div>
        <div class="mt-2 flex flex-wrap justify-center gap-[18px] text-[12.5px] text-slate">
          <span>✓ 1,200+ phones</span><span>✓ Daily price updates</span><span>✓ Verified used listings</span>
        </div>
      </div>
    </section>

    <div class="mx-auto flex w-full max-w-[1200px] flex-col gap-[clamp(36px,5vw,56px)] px-4 pb-12 pt-6">
      <AdSlot note="top banner ad · responsive" />

      <section>
        <SectionHeading title="Popular Mobiles" view-all-to="/mobiles" />
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <template v-if="phonesPending">
            <SkeletonCard v-for="n in 8" :key="n" />
          </template>
          <MobileCard v-for="p in popular" v-else :key="p.slug" :phone="p" />
        </div>
      </section>

      <section>
        <SectionHeading title="Best Phones by Budget" />
        <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
          <NuxtLink
            v-for="b in budgets"
            :key="b.limit"
            to="/mobiles"
            class="flex flex-col gap-1 rounded-card border border-line bg-white px-4 py-[18px] text-ink no-underline transition-shadow hover:shadow-raised"
          >
            <div class="text-[11px] font-semibold uppercase tracking-[0.1em] text-brand">Under</div>
            <div class="font-display text-[clamp(19px,2.5vw,24px)] font-extrabold tracking-tight">{{ b.limit }}</div>
            <div class="mt-0.5 text-xs text-slate">{{ b.count }} ranked picks →</div>
          </NuxtLink>
        </div>
      </section>

      <section>
        <SectionHeading title="Shop by Brand" view-all-to="/mobiles" view-all-label="All brands →" />
        <div class="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          <NuxtLink
            v-for="br in brands"
            :key="br.name"
            :to="`/mobiles?brand=${br.name}`"
            class="flex flex-col items-center gap-2 rounded-card border border-line bg-white px-3.5 py-[18px] text-center text-ink no-underline transition-shadow hover:shadow-raised"
          >
            <div class="grid h-10 w-10 place-items-center rounded-btn bg-canvas font-display text-[15px] font-bold text-slate">{{ br.initial }}</div>
            <div class="text-[12.5px] font-semibold">{{ br.name }}</div>
            <div class="text-[10.5px] text-muted">{{ br.count }} models</div>
          </NuxtLink>
        </div>
      </section>

      <SponsoredCard title="Infinix Note 40 Pro — flagship charging at Rs. 64,999" />

      <section>
        <SectionHeading title="Fresh in Used Mobiles" view-all-to="/used" />
        <div class="grid gap-3 sm:grid-cols-2">
          <UsedMobileCard v-for="l in used" :key="l.id" :listing="l" />
        </div>
      </section>
    </div>

    <CompareBar />
  </div>
</template>
