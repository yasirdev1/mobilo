<script setup lang="ts">
const route = useRoute()
const repo = useUsedListingRepository()
const { format } = usePrice()

const id = String(route.params.id)
const { data: listing, error: listingError } = await useAsyncData(`used-${id}`, () => repo.byId(id))
if (listingError.value) throw createError({ statusCode: 500, statusMessage: 'Could not load this listing', fatal: true })
if (!listing.value) throw createError({ statusCode: 404, statusMessage: 'Listing not found', fatal: true })

useSeoMeta({
  title: () => `${listing.value?.title} — Used — Mobilo.pk`,
  description: () =>
    listing.value
      ? `${listing.value.title} for ${format(listing.value.price)} in ${listing.value.city}. Condition: ${listing.value.condition}, ${listing.value.ptaApproved ? 'PTA approved' : 'non-PTA'}. View seller details on Mobilo.pk.`
      : '',
  ogTitle: () => listing.value?.title ?? '',
  ogDescription: () => (listing.value ? `${listing.value.condition} · ${listing.value.city}` : ''),
  ogImage: () => listing.value?.image ?? '',
})

// BreadcrumbList structured data (Used Mobiles → this listing).
const origin = useRequestURL().origin
useHead(() => ({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Used Mobiles', item: `${origin}/used` },
          { '@type': 'ListItem', position: 2, name: listing.value?.title, item: `${origin}/used/${id}` },
        ],
      }),
    },
  ],
}))

// Similar listings in the same city (lazy — shows a skeleton, non-critical).
const { data: similar, pending: similarPending } = useLazyAsyncData(`used-similar-${id}`, async () => {
  if (!listing.value) return []
  const all = await repo.all({ city: listing.value.city })
  return all.filter((l) => l.id !== id).slice(0, 4)
})
</script>

<template>
  <div v-if="listing" class="mx-auto w-full max-w-[1000px] px-4 py-6">
    <nav class="mb-4 text-[12.5px] text-slate">
      <NuxtLink to="/used" class="text-slate no-underline">Used Mobiles</NuxtLink>
      <span class="text-[#b3beb8]"> / </span>
      <span class="font-semibold text-ink">{{ listing.title }}</span>
    </nav>

    <div class="grid gap-6 md:grid-cols-[1fr_320px]">
      <div class="flex flex-col gap-5">
        <div class="grid h-[280px] place-items-center rounded-card border border-line bg-mist">
          <img v-if="listing.image" :src="listing.image" :alt="listing.title" class="h-full w-full rounded-card object-cover" />
        </div>
        <div class="flex flex-col gap-3 rounded-card border border-line bg-white p-5">
          <h1 class="m-0 font-display text-[clamp(20px,3vw,26px)] font-extrabold tracking-tight">{{ listing.title }}</h1>
          <div class="font-display text-2xl font-bold tabular-nums">{{ format(listing.price) }}</div>
          <div class="flex flex-wrap gap-1.5">
            <PtaBadge :approved="listing.ptaApproved" />
            <span class="rounded-full bg-mist px-2.5 py-1.5 text-[11.5px] font-semibold">{{ listing.condition }}</span>
            <span class="rounded-full border border-line bg-white px-2.5 py-1.5 text-[11.5px] font-semibold text-slate">{{ listing.city }} · {{ listing.posted }}</span>
          </div>
        </div>
        <!-- Safety notice -->
        <div class="flex items-start gap-2.5 rounded-card border border-[#f5c6c0] bg-alert-tint p-4">
          <div class="grid h-[22px] w-[22px] flex-none place-items-center rounded-full bg-alert font-display text-[13px] font-bold text-white">!</div>
          <div class="text-[13px] leading-normal text-alert-deep">
            Please verify the phone, PTA status, condition, and payment before making a deal.
          </div>
        </div>
      </div>

      <aside class="flex h-max flex-col gap-3 md:sticky md:top-[76px]">
        <SellerCard v-if="listing.seller" :seller="listing.seller" />
        <ShareButton :title="`${listing.title} — Mobilo.pk`" :text="`${listing.title} · ${listing.city}`" label="Share this listing" />
      </aside>
    </div>

    <!-- Similar listings -->
    <section v-if="similarPending || similar?.length" class="mt-10">
      <SectionHeading :title="`More used mobiles in ${listing.city}`" view-all-to="/used" />
      <div class="grid gap-3 sm:grid-cols-2">
        <template v-if="similarPending">
          <SkeletonCard v-for="n in 2" :key="n" />
        </template>
        <UsedMobileCard v-for="l in similar ?? []" v-else :key="l.id" :listing="l" />
      </div>
    </section>
  </div>
</template>
