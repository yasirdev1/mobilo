<script setup lang="ts">
/**
 * Hero search with AI-mode toggle (from Home hero).
 * Normal mode → suggestion dropdown → /mobiles?q=…
 * AI mode → budget select + priority chips → "Get AI Picks"
 */
import type { Phone } from '~/data/types'

const repo = usePhoneRepository()
const { format } = usePrice()
const router = useRouter()

const query = ref('')
const focused = ref(false)
const aiMode = ref(false)
const budget = ref('') // '' = any; otherwise a max-price string
const priorities = ['📷 Camera', '🎮 Gaming', '🔋 Battery', '💰 Budget']
const activePriorities = ref<string[]>([])

// Debounced suggestion lookup — avoids a repository/API call on every keystroke.
const suggestions = ref<Phone[]>([])
let debounce: ReturnType<typeof setTimeout>
watch(query, (q) => {
  clearTimeout(debounce)
  debounce = setTimeout(async () => {
    suggestions.value = (await repo.search(q)).slice(0, 5)
  }, 200)
})

const showSuggestions = computed(() => focused.value && !aiMode.value && suggestions.value.length > 0)

function togglePriority(p: string) {
  const i = activePriorities.value.indexOf(p)
  i >= 0 ? activePriorities.value.splice(i, 1) : activePriorities.value.push(p)
}
function doSearch() {
  if (aiMode.value) {
    // Carry the user's budget & priorities so the results/AI page can act on them.
    router.push({
      path: '/mobiles',
      query: {
        ai: '1',
        ...(budget.value ? { budget: budget.value } : {}),
        ...(activePriorities.value.length ? { priorities: activePriorities.value.join(',') } : {}),
      },
    })
  } else {
    router.push({ path: '/mobiles', query: query.value ? { q: query.value } : {} })
  }
}
</script>

<template>
  <div class="relative w-full max-w-[620px]">
    <div class="mt-1.5 flex flex-col overflow-hidden rounded-[14px] border-[1.5px] border-line bg-white shadow-raised">
      <div class="flex h-14 items-center gap-2 pl-4 pr-2">
        <span class="relative h-[15px] w-[15px] flex-none rounded-full border-2 border-muted">
          <span class="absolute left-[13px] top-[11px] h-[7px] w-0.5 -rotate-45 bg-muted" />
        </span>
        <input
          v-model="query"
          type="text"
          :aria-label="aiMode ? 'Describe the phone you want' : 'Search phones'"
          :placeholder="aiMode ? 'e.g. best camera phone for vlogging…' : 'Search iPhone 15, Samsung A55, best gaming phone under 100k…'"
          class="min-w-0 flex-1 border-none bg-transparent text-[14.5px] text-ink outline-none"
          @focus="focused = true"
          @blur="focused = false"
        />
        <button
          class="h-[42px] flex-none whitespace-nowrap rounded-btn px-5 text-sm font-semibold text-white"
          :class="aiMode ? 'bg-deep' : 'bg-brand hover:bg-brand-dark'"
          @click="doSearch"
        >
          {{ aiMode ? 'Get AI Picks' : 'Search' }}
        </button>
      </div>

      <!-- AI toggle strip -->
      <label
        class="flex cursor-pointer items-center gap-2 border-t border-mist px-4 py-2.5"
        :class="aiMode ? 'bg-[#f2f9f5]' : 'bg-white'"
      >
        <span class="relative h-[18px] w-8 flex-none">
          <input v-model="aiMode" type="checkbox" class="absolute inset-0 z-10 m-0 cursor-pointer opacity-0" />
          <span class="absolute inset-0 rounded-full transition-colors" :class="aiMode ? 'bg-brand' : 'bg-[#d3dbd6]'" />
          <span class="absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white shadow transition-all" :class="aiMode ? 'left-4' : 'left-0.5'" />
        </span>
        <span class="text-[12.5px] font-semibold text-ink">✦ Ask AI instead</span>
        <span class="text-[11.5px] text-muted">— tell us your budget &amp; priority, we'll shortlist</span>
      </label>

      <!-- AI preference row -->
      <div v-if="aiMode" class="flex flex-wrap gap-2 px-4 pb-3.5">
        <select v-model="budget" aria-label="Budget" class="h-[34px] cursor-pointer rounded-full border border-line bg-canvas px-3 text-[12.5px] font-medium text-ink outline-none focus-visible:border-brand">
          <option value="">Any budget</option>
          <option value="50000">Under Rs. 50,000</option>
          <option value="100000">Under Rs. 100,000</option>
          <option value="150000">Under Rs. 150,000</option>
          <option value="150001">Above Rs. 150,000</option>
        </select>
        <button
          v-for="p in priorities"
          :key="p"
          class="h-[34px] rounded-full border px-[13px] text-[12.5px] font-semibold"
          :class="activePriorities.includes(p) ? 'border-brand bg-brand-tint text-brand' : 'border-line bg-canvas text-slate'"
          @click="togglePriority(p)"
        >
          {{ p }}
        </button>
      </div>
    </div>

    <!-- Suggestions dropdown -->
    <div
      v-if="showSuggestions"
      class="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-[14px] border border-line bg-white text-left shadow-overlay"
    >
      <NuxtLink
        v-for="s in suggestions"
        :key="s.slug"
        :to="`/mobiles/${s.slug}`"
        class="flex items-center gap-3 px-4 py-2.5 text-ink no-underline hover:bg-canvas"
        @mousedown.prevent
      >
        <div class="h-[34px] w-[34px] flex-none rounded-lg bg-mist" />
        <div class="min-w-0 flex-1">
          <div class="text-[13px] font-semibold leading-snug">{{ s.name }}</div>
          <div class="text-[11px] text-muted">{{ s.specsLine }}</div>
        </div>
        <div class="flex-none font-display text-[12.5px] font-bold">{{ format(s.price) }}</div>
      </NuxtLink>
      <button
        class="w-full border-t border-mist px-4 py-3 text-left text-[12.5px] font-semibold text-brand hover:bg-canvas"
        @mousedown.prevent="doSearch"
      >
        See all results for "{{ query }}" →
      </button>
    </div>
  </div>
</template>
