<script setup lang="ts">
const route = useRoute()
const repo = usePhoneRepository()
const { format } = usePrice()

const slug = String(route.params.slug)
const { data: phone, error: phoneError } = await useAsyncData(`phone-${slug}`, () => repo.bySlug(slug))
const { data: offers } = await useAsyncData(`offers-${slug}`, () => repo.retailerPrices(slug))

if (phoneError.value) {
  throw createError({ statusCode: 500, statusMessage: 'Could not load this phone', fatal: true })
}
if (!phone.value) {
  throw createError({ statusCode: 404, statusMessage: 'Phone not found', fatal: true })
}

const sections = computed(() => Object.entries(phone.value?.specs ?? {}))

// Related phones — same brand first, then closest by price. Loaded lazily
// (non-critical) so it can show a skeleton without blocking the main content.
const { data: related, pending: relatedPending } = useLazyAsyncData(`related-${slug}`, async () => {
  const all = await repo.all()
  const cur = all.find((p) => p.slug === slug)
  if (!cur) return []
  const sameBrand = all.filter((p) => p.slug !== slug && p.brand === cur.brand)
  const rest = all
    .filter((p) => p.slug !== slug && p.brand !== cur.brand)
    .sort((a, b) => Math.abs(a.price - cur.price) - Math.abs(b.price - cur.price))
  return [...sameBrand, ...rest].slice(0, 4)
})

// Lowest retailer offer (falls back to the phone's headline price).
const lowPrice = computed(() => {
  const prices = (offers.value ?? []).map((o) => o.price).filter((n) => Number.isFinite(n))
  return prices.length ? Math.min(...prices) : phone.value?.price
})

useSeoMeta({
  title: () => `${phone.value?.name} Price in Pakistan — Specs & Where to Buy | Mobilo.pk`,
  description: () =>
    phone.value
      ? `${phone.value.name} price in Pakistan from ${format(lowPrice.value ?? phone.value.price)}. ${phone.value.specsLine}. Compare retailer prices and full specs on Mobilo.pk.`
      : '',
  ogTitle: () => `${phone.value?.name} — Price & Specs`,
  ogDescription: () => phone.value?.specsLine ?? '',
  ogImage: () => phone.value?.image ?? '',
})

// Structured data: Product (rich price results) + BreadcrumbList (breadcrumb
// rich snippet). Absolute URLs are built from the request origin.
const origin = useRequestURL().origin
useHead(() => ({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: phone.value?.name,
        category: 'Mobile Phone',
        ...(phone.value?.brand ? { brand: { '@type': 'Brand', name: phone.value.brand } } : {}),
        ...(phone.value?.image ? { image: phone.value.image } : {}),
        description: phone.value?.specsLine,
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'PKR',
          lowPrice: lowPrice.value,
          offerCount: offers.value?.length || 1,
          availability: 'https://schema.org/InStock',
        },
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: 'Mobiles', item: `${origin}/mobiles` },
          { '@type': 'ListItem', position: 3, name: phone.value?.name, item: `${origin}/mobiles/${slug}` },
        ],
      }),
    },
  ],
}))
</script>

<template>
  <div v-if="phone" class="mx-auto w-full max-w-[1200px] px-4 py-6">
    <!-- Breadcrumb -->
    <nav class="mb-4 text-[12.5px] text-slate">
      <NuxtLink to="/" class="text-slate no-underline">Home</NuxtLink>
      <span class="text-[#b3beb8]"> / </span>
      <NuxtLink to="/mobiles" class="text-slate no-underline">Mobiles</NuxtLink>
      <span class="text-[#b3beb8]"> / </span>
      <span class="font-semibold text-ink">{{ phone.name }}</span>
    </nav>

    <div class="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div class="flex flex-col gap-6">
        <!-- Header card -->
        <div class="flex flex-col gap-4 rounded-card border border-line bg-white p-5 sm:flex-row">
          <div class="grid h-[220px] w-full flex-none place-items-center rounded-xl bg-mist sm:w-[180px]">
            <img v-if="phone.image" :src="phone.image" :alt="phone.name" class="h-full w-full object-contain" />
          </div>
          <div class="flex flex-col gap-3">
            <h1 class="m-0 font-display text-[clamp(22px,3vw,28px)] font-extrabold tracking-tight">{{ phone.name }}</h1>
            <div class="font-display text-2xl font-bold tabular-nums">{{ format(phone.price) }}</div>
            <div class="text-[13px] text-slate">{{ phone.specsLine }} · Launched {{ phone.launched }}</div>
            <div v-if="phone.scores" class="flex flex-wrap gap-2.5">
              <ScoreChip label="Performance" :value="phone.scores.performance" />
              <ScoreChip label="Camera" :value="phone.scores.camera" />
              <ScoreChip label="Battery" :value="phone.scores.battery" />
              <ScoreChip label="Value" :value="phone.scores.value" />
            </div>
          </div>
        </div>

        <!-- Retailer prices FIRST (per product decision) -->
        <section>
          <SectionHeading title="Where to Buy" />
          <div class="flex flex-col gap-2.5">
            <RetailerPriceRow v-for="o in offers ?? []" :key="o.retailer" :offer="o" />
          </div>
        </section>

        <AdSlot />

        <!-- Specs -->
        <section v-for="[section, rows] in sections" :key="section">
          <SectionHeading :title="section" />
          <div class="overflow-hidden rounded-xl border border-line bg-white">
            <div
              v-for="(value, label) in rows"
              :key="label"
              class="grid grid-cols-[140px_1fr] border-b border-hairline last:border-b-0"
            >
              <div class="px-3.5 py-3 text-xs font-semibold text-slate">{{ label }}</div>
              <div class="border-l border-hairline px-3.5 py-3 text-[13px]">{{ value }}</div>
            </div>
          </div>
        </section>
      </div>

      <!-- Sidebar -->
      <aside class="flex h-max flex-col gap-4 lg:sticky lg:top-[76px]">
        <NuxtLink
          :to="`/sell?preset=${encodeURIComponent(phone.name)}`"
          class="grid h-[52px] place-items-center rounded-xl bg-ink text-[15px] font-semibold text-white no-underline hover:bg-[#223129]"
        >
          Sell this phone
        </NuxtLink>
        <NuxtLink
          :to="`/compare?phones=${phone.slug}`"
          class="grid h-[52px] place-items-center rounded-xl bg-brand-tint text-[15px] font-semibold text-brand no-underline"
        >
          Compare with another →
        </NuxtLink>
        <ShareButton :title="`${phone.name} — Mobilo.pk`" :text="`${phone.name} price & specs`" label="Share this phone" />
        <AdSlot height="250px" note="sidebar ad · 300×250" />
      </aside>
    </div>

    <!-- You might also like -->
    <section v-if="relatedPending || related?.length" class="mt-10">
      <SectionHeading title="You might also like" />
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <template v-if="relatedPending">
          <SkeletonCard v-for="n in 4" :key="n" />
        </template>
        <MobileCard v-for="p in related ?? []" v-else :key="p.slug" :phone="p" />
      </div>
    </section>

    <CompareBar />
  </div>
</template>
