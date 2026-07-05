<script setup lang="ts">
import type { Phone } from '~/data/types'

const route = useRoute()
const router = useRouter()
const repo = usePhoneRepository()
const { format } = usePrice()

const { data: allPhones } = await useAsyncData('phones-compare', () => repo.all())

const slugs = ref<string[]>(
  String(route.query.phones ?? '')
    .split(',')
    .filter(Boolean),
)
watch(slugs, (v) => router.replace({ query: { phones: v.join(',') || undefined } }), { deep: true })

const phones = computed<Phone[]>(() =>
  slugs.value.map((s) => (allPhones.value ?? []).find((p) => p.slug === s)).filter(Boolean) as Phone[],
)

const view = ref<'▦ Table View' | '☰ By Spec'>('▦ Table View')
const query = ref('')
const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  return (allPhones.value ?? []).filter((p) => p.name.toLowerCase().includes(q) && !slugs.value.includes(p.slug)).slice(0, 5)
})

function add(slug: string) {
  if (slugs.value.length < 4) slugs.value.push(slug)
  query.value = ''
}
function remove(slug: string) {
  slugs.value = slugs.value.filter((s) => s !== slug)
}

/** All spec rows across sections, with winner detection for numeric-ish values. */
const specSections = computed(() => {
  const sections = new Map<string, Set<string>>()
  for (const p of phones.value)
    for (const [sec, rows] of Object.entries(p.specs ?? {}))
      for (const label of Object.keys(rows)) {
        if (!sections.has(sec)) sections.set(sec, new Set())
        sections.get(sec)!.add(label)
      }
  return [...sections.entries()].map(([sec, labels]) => ({
    section: sec,
    rows: [...labels].map((label) => {
      const values = phones.value.map((p) => p.specs?.[sec]?.[label] ?? '—')
      const nums = values.map((v) => parseFloat(v.replace(/[^\d.]/g, '')))
      const valid = nums.filter((n) => !isNaN(n))
      const winner = valid.length > 1 && new Set(valid).size > 1 ? nums.indexOf(Math.max(...valid)) : -1
      return { label, values, winner }
    }),
  }))
})

const dotColors = ['#0b8a5c', '#2f6fed', '#9a6b1f', '#b42318']

useSeoMeta({
  title: 'Compare Mobile Phones Side by Side | Mobilo.pk',
  description:
    'Compare up to 4 mobile phones side by side — specs, prices, and performance — to find the best phone for you in Pakistan.',
  ogTitle: 'Compare Mobile Phones Side by Side',
  ogDescription: 'Compare up to 4 phones on specs, prices, and performance in Pakistan.',
})
</script>

<template>
  <div class="mx-auto w-full max-w-[1200px] px-4 py-6">
    <h1 class="m-0 mb-4 font-display text-[clamp(22px,3.5vw,30px)] font-bold tracking-tight">Compare Mobiles</h1>

    <!-- Add phone -->
    <div class="relative mb-4 max-w-[480px]">
      <div class="flex gap-2">
        <input
          v-model="query"
          type="text"
          aria-label="Search a phone to add"
          placeholder="Search a phone to add…"
          class="h-12 w-full rounded-btn border-[1.5px] border-line px-3.5 text-sm font-medium outline-none focus:border-brand"
        />
        <button class="h-12 flex-none rounded-btn bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark" :disabled="!results.length" @click="results[0] && add(results[0].slug)">
          Add
        </button>
      </div>
      <div v-if="results.length" class="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-xl border border-line bg-white shadow-overlay">
        <button v-for="r in results" :key="r.slug" class="flex w-full items-center gap-3 px-3.5 py-2.5 text-left hover:bg-canvas" @click="add(r.slug)">
          <span class="flex-1 text-[13px] font-semibold">{{ r.name }}</span>
          <span class="font-display text-xs font-bold text-slate">{{ format(r.price) }}</span>
        </button>
      </div>
    </div>

    <!-- Selected chips -->
    <div class="mb-5 flex flex-wrap gap-2">
      <div v-for="(p, i) in phones" :key="p.slug" class="flex items-center gap-1.5 rounded-full border border-line bg-canvas py-1.5 pl-3 pr-1.5">
        <span class="h-2 w-2 rounded-full" :style="{ background: dotColors[i] }" />
        <span class="text-[12.5px] font-semibold">{{ p.name }}</span>
        <button class="grid h-[22px] w-[22px] place-items-center rounded-full bg-line text-[11px] font-semibold text-slate" :aria-label="`Remove ${p.name}`" @click="remove(p.slug)">
          <span aria-hidden="true">✕</span>
        </button>
      </div>
    </div>

    <SegmentedControl v-model="view" :options="['▦ Table View', '☰ By Spec']" class="mb-5" />

    <EmptyState
      v-if="!phones.length"
      title="No phones selected"
      message="Search above to add up to 4 phones to compare."
      action-label="Browse mobiles"
      @action="$router.push('/mobiles')"
    />

    <!-- Table view -->
    <div v-else-if="view === '▦ Table View'" class="overflow-x-auto">
      <div class="min-w-[560px] overflow-hidden rounded-xl border border-line bg-white">
        <!-- Header cards -->
        <div class="grid border-b border-line" :style="{ gridTemplateColumns: `120px repeat(${phones.length}, 1fr)` }">
          <div class="bg-canvas" />
          <div v-for="(p, i) in phones" :key="p.slug" class="border-l border-hairline p-3.5">
            <div class="mb-2 h-16 rounded-lg bg-mist" />
            <div class="flex items-center gap-1.5 font-display text-[13px] font-semibold">
              <span class="h-2 w-2 flex-none rounded-full" :style="{ background: dotColors[i] }" />{{ p.name }}
            </div>
            <div class="mt-1 font-display text-sm font-bold tabular-nums">{{ format(p.price) }}</div>
          </div>
        </div>
        <template v-for="sec in specSections" :key="sec.section">
          <div class="bg-canvas px-3.5 py-2 text-[11.5px] font-bold uppercase tracking-[0.05em]">{{ sec.section }}</div>
          <div
            v-for="row in sec.rows"
            :key="row.label"
            class="grid border-t border-hairline"
            :style="{ gridTemplateColumns: `120px repeat(${phones.length}, 1fr)` }"
          >
            <div class="px-3.5 py-3 text-xs font-semibold leading-snug text-slate">{{ row.label }}</div>
            <div
              v-for="(v, i) in row.values"
              :key="i"
              class="border-l border-hairline px-3.5 py-3 text-[13px]"
              :class="row.winner === i ? 'bg-winner-tint font-semibold text-winner' : ''"
            >
              <template v-if="row.winner === i">✓ </template>{{ v }}
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- By-spec view -->
    <div v-else class="flex max-w-[560px] flex-col gap-4">
      <div v-for="sec in specSections" :key="sec.section" class="overflow-hidden rounded-xl border border-line bg-white">
        <div class="border-b border-mist bg-canvas px-3.5 py-2.5 text-[11.5px] font-bold uppercase tracking-[0.05em]">{{ sec.section }}</div>
        <div v-for="row in sec.rows" :key="row.label">
          <div class="px-3.5 pb-1 pt-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{{ row.label }}</div>
          <div
            v-for="(v, i) in row.values"
            :key="i"
            class="flex items-center gap-2.5 border-t border-hairline px-3.5 py-2.5"
            :class="row.winner === i ? 'bg-winner-tint' : ''"
          >
            <span class="h-2 w-2 flex-none rounded-full" :style="{ background: dotColors[i] }" />
            <span class="flex-1 text-xs font-medium text-slate">{{ phones[i].name }}</span>
            <span class="text-[13px]" :class="row.winner === i ? 'font-semibold text-winner' : ''">
              <template v-if="row.winner === i">✓ </template>{{ v }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
